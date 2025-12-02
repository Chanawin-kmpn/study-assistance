"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

// ดึงรายการ Chat ทั้งหมดของ Document นี้
export async function getChatsByDocument(documentId: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthenticated");

	return await prisma.chat.findMany({
		where: {
			userId,
			documentId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

// ดึงข้อความทั้งหมดใน Chat หนึ่งๆ
export async function getChatMessages(chatId: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthenticated");

	// เช็คว่าเป็นเจ้าของ chat ไหม
	const chat = await prisma.chat.findFirst({
		where: { id: chatId, userId },
	});

	if (!chat || chat.userId !== userId)
		throw new Error("Chat not found or access denied");

	return await prisma.message.findMany({
		where: { chatId },
		orderBy: { createdAt: "asc" },
	});
}

export async function deleteChat(chatId: string, documentId: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthenticated");
	console.log(documentId);

	const chat = await prisma.chat.findFirst({
		where: { id: chatId, userId },
	});

	if (!chat || chat.userId !== userId)
		throw new Error("Chat not found or access denied");

	await prisma.chat.delete({
		where: { id: chatId },
	});

	revalidatePath(`/chat/${documentId}`);
}
