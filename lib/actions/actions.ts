"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore, embeddings } from "../vector-store";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import * as pdfjsLib from "pdfjs-dist";

export async function uploadDocument(formData: FormData) {
	try {
		const { userId } = await auth();
		const clerk = await clerkClient();

		if (!userId) return { success: false, message: "Unauthorized" };

		// Ensure user exists in Prisma
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

		// Upload file to Blob
		const blob = await put(uniqueFileName, file, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		// Read PDF using pdf-lib
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
		const totalPages = pdf.numPages;
		let text = "";

		for (let i = 1; i <= totalPages; i++) {
			const page = await pdf.getPage(i);
			const content = await page.getTextContent();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pageText = content.items.map((item: any) => item.str).join(" ");
			text += pageText + "\n";
		}

		// Create Document in Prisma to get documentId
		const document = await prisma.document.create({
			data: {
				name: file.name,
				url: blob.url,
				userId: userId,
				pageCount: totalPages,
			},
		});

		// Split text into chunks
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const docs = await splitter.createDocuments([text]);

		// Embed vectors and link metadata
		const vectorStore = await getVectorStore();

		const vectors = await Promise.all(
			docs.map(async (doc, i) => {
				const embedding = await embeddings.embedQuery(doc.pageContent);
				return {
					id: `${document.id}-${i}`,
					values: embedding,
					metadata: {
						text: doc.pageContent,
						source: file.name,
						userId: dbUser!.id,
						url: blob.url,
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

		// Revalidate cache
		revalidatePath("/chat");

		return {
			success: true,
			message: "Uploaded & Linked to User",
			documentId: document.id,
			document,
		};
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to process document." };
	}
}
