"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

// ดึงรายการ Chat ทั้งหมดของ Document นี้
export async function getChatsByDocument(documentId: string) {
	const { userId } = await auth();
	if (!userId) return [];

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
	if (!userId) return [];

	// เช็คว่าเป็นเจ้าของ chat ไหม
	const chat = await prisma.chat.findUnique({
		where: { id: chatId, userId },
	});

	if (!chat) return [];

	return await prisma.message.findMany({
		where: { chatId },
		orderBy: { createdAt: "asc" },
	});
}
