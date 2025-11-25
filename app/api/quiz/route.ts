import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/helper/getCurrentUser";

const quizSchema = z.object({
	questions: z.array(
		z.object({
			prompt: z.string(),
			explanation: z.string(),
			choices: z.array(
				z.object({
					text: z.string(),
					isCorrect: z.boolean(),
				})
			),
		})
	),
});

// body ที่เราคาดหวังจากฝั่ง client
const requestSchema = z.object({
	context: z.string().min(1),

	title: z.string().min(1),
	description: z.string().optional(),

	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
	questionAmount: z.number().int().min(1).max(20),

	sourceType: z.enum(["PDF", "LINK", "TEXT"]),
	documentId: z.string().optional(), // ถ้ามาจาก PDF
	sourceUrl: z.string().url().optional(), // ถ้ามาจาก LINK
	rawText: z.string().optional(), // ถ้ามาจาก TEXT
	specificRequirement: z.string().optional(), // จากช่อง Specific Requirement
});

export async function POST(req: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const json = await req.json();
		const body = requestSchema.parse(json);

		const {
			context,
			title,
			description,
			difficulty,
			questionAmount,
			sourceType,
			documentId,
			sourceUrl,
			rawText,
			specificRequirement,
		} = body;

		// 1) ให้ AI สร้าง quiz object
		const model = google("gemini-flash-latest");

		const systemPrompt = `
คุณเป็นผู้ช่วยติวหนังสือสำหรับนักเรียนภาษาไทย
สร้างข้อสอบปรนัย ${questionAmount} ข้อ จากเนื้อหาต่อไปนี้
- ภาษา: ไทยทั้งหมด
- รูปแบบ: Multiple choice 1 คำตอบที่ถูกต่อข้อ
- ระดับความยาก: ${difficulty}
- ข้อกำหนดเพิ่มเติม: ${specificRequirement || "ไม่มี ให้ใช้ความเหมาะสมของคุณ"}

อย่าตอบอย่างอื่น นอกจากโครงสร้างตาม schema ที่กำหนด.
เนื้อหา:
${context}
    `.trim();

		const result = await generateObject({
			model,
			schema: quizSchema,
			prompt: systemPrompt,
		});

		const { questions } = result.object;

		// 2) สร้าง Quiz ใน Prisma พร้อม Question + Choice แบบ nested
		const quiz = await prisma.quiz.create({
			data: {
				userId: user.id,
				documentId: documentId ?? null,
				title,
				description: description ?? null,
				sourceType,
				sourceUrl: sourceUrl ?? null,
				rawText: rawText ?? null,
				difficulty,
				questionCount: questionAmount,
				questions: {
					create: questions.map((q, index) => ({
						order: index + 1,
						prompt: q.prompt,
						explanation: q.explanation,
						choices: {
							create: q.choices.map((c) => ({
								text: c.text,
								isCorrect: c.isCorrect,
							})),
						},
					})),
				},
			},
			include: {
				questions: {
					include: {
						choices: true,
					},
				},
			},
		});

		// 3) ส่ง quiz ที่สร้างแล้วกลับไปให้ UI
		return NextResponse.json(quiz);
	} catch (error) {
		console.error("Error creating quiz...", error);

		if (error instanceof z.ZodError) {
			return new NextResponse(error.message, { status: 400 });
		}

		return new NextResponse("Failed to create quiz", { status: 500 });
	}
}
