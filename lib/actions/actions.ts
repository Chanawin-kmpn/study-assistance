"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse, VerbosityLevel } from "pdf-parse";
import { getVectorStore, embeddings } from "../vector-store";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import "pdf-parse/worker";

export async function uploadDocument(formData: FormData) {
	try {
		const { userId } = await auth();
		const clerk = await clerkClient();

		if (!userId) return { success: false, message: "Unauthorized" };

		// ----- ensure user ใน Prisma -----
		let dbUser = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!dbUser) {
			const user = await clerk.users.getUser(userId);
			const email =
				user.primaryEmailAddress?.emailAddress ??
				`no-email-${userId}@example.com`;

			dbUser = await prisma.user.create({
				data: {
					id: userId,
					email,
				},
			});
		}

		const file = formData.get("file") as File;
		if (!file) throw new Error("No file uploaded");
		const uniqueId = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2, 9)}`;
		const uniqueFileName = `${userId}-${uniqueId}-${file.name}`;

		// ----- upload ไฟล์ไป Blob -----
		const blob = await put(uniqueFileName, file, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		// ----- อ่าน PDF แล้วแตกเป็น chunk -----
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const parser = new PDFParse({
			data: buffer,
			verbosity: VerbosityLevel.WARNINGS,
		});
		const result = await parser.getText();
		await parser.destroy();

		const text = result.text;
		const pageCount = result.total;

		// ----- สร้าง Document ใน Prisma ก่อน เพื่อจะได้ documentId -----
		const document = await prisma.document.create({
			data: {
				name: file.name,
				url: blob.url,
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
					// ใช้ document.id เพื่อกันชนกันระหว่างไฟล์ชื่อซ้ำ
					id: `${document.id}-${i}`,
					values: embedding,
					metadata: {
						text: doc.pageContent,
						source: file.name,
						userId: dbUser!.id,
						url: blob.url,
						documentId: document.id, // 👈 สำคัญ: ผูก documentId ที่นี่
					},
				};
			})
		);

		const batchSize = 50;
		for (let i = 0; i < vectors.length; i += batchSize) {
			const batch = vectors.slice(i, i + batchSize);
			await vectorStore.upsert(batch);
		}

		// ถ้าคุณใช้ /dashboard ก็ revalidate ต่อไปได้
		revalidatePath("/chat");
		// หรือ revalidatePath("/dashboard");

		return {
			success: true,
			message: "Uploaded & Linked to User",
			documentId: document.id, // 👈 ให้ฝั่ง client ใช้ได้ด้วย
			document,
		};
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to process document." };
	}
}
