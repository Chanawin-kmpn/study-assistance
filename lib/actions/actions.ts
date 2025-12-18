"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse, VerbosityLevel } from "pdf-parse";
import { getVectorStore, embeddings } from "../vector-store";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
// import { put } from "@vercel/blob"; // 👈 ลบออก: ไม่ต้องอัปโหลดแล้ว
import "pdf-parse/worker";
import { checkContentSafety } from "@/lib/safety";
import { del } from "@vercel/blob";

export async function processDocumentFromUrl(
	fileUrl: string, // 👈 รับ URL ของไฟล์ที่อัปโหลดเสร็จแล้ว
	fileName: string // 👈 รับชื่อไฟล์
) {
	try {
		const { userId } = await auth();
		const clerk = await clerkClient();

		if (!userId) return { success: false, message: "Unauthorized" };

		// ----- ensure user ใน Prisma -----
		// ... (โค้ดตรวจสอบและสร้าง user เหมือนเดิม) ...
		let dbUser = await prisma.user.findUnique({ where: { id: userId } });
		if (!dbUser) {
			const user = await clerk.users.getUser(userId);
			const email =
				user.primaryEmailAddress?.emailAddress ??
				`no-email-${userId}@example.com`;
			dbUser = await prisma.user.create({
				data: { id: userId, email },
			});
		}

		const response = await fetch(fileUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const parser = new PDFParse({
			data: buffer,
			verbosity: VerbosityLevel.WARNINGS,
		});
		const result = await parser.getText();
		await parser.destroy();

		const text = result.text;
		if (!text || text.trim().length === 0) {
			return {
				success: false,
				message: "Unable to read text from PDF or file is empty.",
			};
		}

		const safetyCheck = await checkContentSafety(text);
		if (!safetyCheck.isSafe) {
			// 🗑️ เนื้อหาไม่ผ่าน! ลบไฟล์ออกจาก Blob ทันที
			console.warn(
				`[Moderation] Blocking file "${fileName}" due to: ${safetyCheck.reason}`
			);

			try {
				await del(fileUrl);
			} catch (delError) {
				console.error("Failed to delete unsafe blob:", delError);
			}

			return {
				success: false,
				message: `Upload rejected: Content contains inappropriate material (${safetyCheck.reason}).`,
			};
		}

		const pageCount = result.total;

		const document = await prisma.document.create({
			data: {
				name: fileName, // 👈 ใช้ชื่อไฟล์ที่รับมา
				url: fileUrl, // 👈 ใช้ URL ที่รับมา
				userId: userId,
				pageCount,
			},
		});

		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const docs = await splitter.createDocuments([text]);

		// ----- ฝัง vector + ผูก documentId ลง metadata -----
		const vectorStore = await getVectorStore();

		const vectors = await Promise.all(
			docs.map(async (doc, i) => {
				const embedding = await embeddings.embedQuery(doc.pageContent);
				return {
					id: `${document.id}-${i}`,
					values: embedding,
					metadata: {
						text: doc.pageContent,
						source: fileName, // 👈 ใช้ชื่อไฟล์ที่รับมา
						userId: dbUser!.id,
						url: fileUrl, // 👈 ใช้ URL ที่รับมา
						documentId: document.id,
					},
				};
			})
		);

		const batchSize = 50;
		for (let i = 0; i < vectors.length; i += batchSize) {
			const batch = vectors.slice(i, i + batchSize);
			await vectorStore.upsert(batch);
		}

		revalidatePath("/chat");

		return {
			success: true,
			message: "Processed document successfully",
			documentId: document.id,
			document,
		};
	} catch (error) {
		console.error("Processing Error:", error);
		return { success: false, message: "Failed to process document." };
	}
}
