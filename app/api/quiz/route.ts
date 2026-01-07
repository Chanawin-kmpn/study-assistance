import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/helper/getCurrentUser";
import { getContextForQuiz } from "@/lib/vector-store";
import { checkContentSafety } from "@/lib/safety";

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
	// context ไม่บังคับแล้ว เพราะถ้าเป็น PDF เราจะไปหาเอง
	context: z.string().optional(),

	title: z.string().min(1),
	description: z.string().optional(),

	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
	language: z.enum(["TH", "EN"]).default("EN"),
	questionAmount: z.number().int().min(1).max(20),

	sourceType: z.enum(["PDF", "LINK", "TEXT"]),
	documentId: z.string().optional(),
	sourceUrl: z.string().url().optional(),
	rawText: z.string().optional(),
	specificRequirement: z.string().optional(),
});

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		const userId = user.id;

		const quizzes = await prisma.quiz.findMany({
			where: {
				userId,
			},
			include: {
				attempts: true, // ดึงประวัติการทำมาด้วยเพื่อใช้คำนวณ Best Score
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(quizzes);
	} catch (error) {
		console.error("[QUIZ_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const json = await req.json();
		const body = requestSchema.parse(json);

		const {
			title,
			description,
			difficulty,
			language,
			questionAmount,
			sourceType,
			documentId,
			sourceUrl,
			rawText,
			specificRequirement,
			context: providedContext,
		} = body;

		let finalContext = providedContext || "";

		if (sourceType === "PDF") {
			if (!documentId) {
				return new NextResponse("Document ID is required for PDF source", {
					status: 400,
				});
			}

			const vectorContent = await getContextForQuiz(
				documentId,
				questionAmount,
				specificRequirement
			);

			if (!vectorContent) {
				return new NextResponse("Failed to retrieve content from document", {
					status: 400,
				});
			}

			finalContext = vectorContent;
		} else if (sourceType === "TEXT" && rawText) {
			const safetyCheck = await checkContentSafety(rawText);

			if (!safetyCheck.isSafe) {
				return new NextResponse(
					`Cannot create quiz: Content contains inappropriate material (${safetyCheck.reason}).`,
					{ status: 400 } // ส่ง 400 Bad Request กลับไป
				);
			}
			finalContext = rawText;
		}
		if (!finalContext || finalContext.trim().length === 0) {
			return new NextResponse("Context content is missing or empty", {
				status: 400,
			});
		}
		const model = google("gemini-3-flash-preview");
		const languageInstruction =
			language === "TH"
				? "Thai language. Ensure all questions, choices, and explanations are written in natural, academic Thai."
				: "English language.";

		const systemPrompt = `
You are an expert AI tutor and assessment creator specializing in educational content.
Your task is to generate a multiple-choice quiz consisting of ${questionAmount} questions based strictly on the provided Context.

Configuration:
- Target Language: ${languageInstruction}
- Difficulty Level: ${difficulty}
- Topic/Title: ${title}
- Specific Requirements: ${
			specificRequirement ||
			"Focus on key concepts, main ideas, and important details."
		}

Format Requirements:
1. Question Structure: Multiple choice with 4 distinct options.
2. Answer Logic: Exactly one correct option per question.
3. Explanation: Provide a clear and helpful explanation for why the correct answer is right.
4. Output Format: Return strictly a JSON object matching the defined schema. No markdown, no conversational text.

Context:
${finalContext}
    `.trim();

		const result = await generateObject({
			model,
			schema: quizSchema,
			prompt: systemPrompt,
			temperature: 0.5, // ปรับให้นิ่งขึ้นหน่อย
		});

		const { questions } = result.object;
		const quiz = await prisma.quiz.create({
			data: {
				userId: user.id,
				documentId: documentId ?? null,
				title,
				description: description ?? `Generated from ${sourceType}`,
				sourceType,
				sourceUrl: sourceUrl ?? null,
				rawText: rawText ?? null,
				difficulty,
				questionCount: questionAmount, // ใช้ค่าที่ request มา หรือ questions.length ก็ได้
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
			select: {
				id: true,
			},
		});

		return NextResponse.json({ quizId: quiz.id });
	} catch (error) {
		console.error("Error creating quiz...", error);

		if (error instanceof z.ZodError) {
			return new NextResponse(error.message, { status: 400 });
		}

		return new NextResponse("Failed to create quiz", { status: 500 });
	}
}
