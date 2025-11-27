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

// สร้าง Chat ID ใหม่ (จริงๆ ทำ Client Side ก็ได้ แต่ทำ Server ไว้เผื่อ Logic อื่นๆ)
export async function createNewChatId() {
	// เราใช้ cuid() จาก client side lib หรือจะ generate จาก DB ก็ได้
	// แต่เพื่อให้ง่าย เราจะ generate UUID/CUID จากฝั่ง Client แล้วส่งไป API ก็สะดวก
	// ดังนั้น function นี้อาจไม่จำเป็น ถ้าเราใช้ nanoid ฝั่ง client
	return null;
}
