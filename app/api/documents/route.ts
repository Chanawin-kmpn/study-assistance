// app/api/documents/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const { userId } = await auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// ดึงเอกสารทั้งหมดของ user นี้จาก Prisma
		const documents = await prisma.document.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		// ส่งเป็น JSON ให้ฝั่ง client ใช้งานได้เลย
		return NextResponse.json(documents);
	} catch (error) {
		console.error("Error fetching documents:", error);
		return new NextResponse("Failed to fetch documents", { status: 500 });
	}
}
