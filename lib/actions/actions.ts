"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse } from "pdf-parse";
import { getVectorStore, embeddings } from "../vector-store";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { put } from "@vercel/blob";

export async function uploadDocument(formData: FormData) {
	try {
		const { userId } = await auth();
		const clerk = await clerkClient();

		if (!userId) return { success: false, message: "Unauthorized" };

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

		const blob = await put(file.name, file, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const parser = new PDFParse({ data: buffer });
		const result = await parser.getText();
		await parser.destroy();

		const text = result.text;

		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const docs = await splitter.createDocuments([text]);

		const vectorStore = await getVectorStore();

		const vectors = await Promise.all(
			docs.map(async (doc, i) => {
				const embedding = await embeddings.embedQuery(doc.pageContent);
				return {
					id: `${file.name}-${i}`,
					values: embedding,
					metadata: {
						text: doc.pageContent,
						source: file.name,
						userId: dbUser.id,
						url: blob.url,
					},
				};
			})
		);

		const batchSize = 50;
		for (let i = 0; i < vectors.length; i += batchSize) {
			const batch = vectors.slice(i, i + batchSize);
			await vectorStore.upsert(batch);
		}

		await prisma.document.create({
			data: {
				name: file.name,
				url: blob.url,
				userId: userId,
			},
		});

		revalidatePath("/dashboard");
		return { success: true, message: "Uploaded & Linked to User" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to process document." };
	}
}
