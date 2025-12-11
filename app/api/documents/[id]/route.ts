import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // หรือ path ที่คุณใช้
import { prisma } from "@/lib/prisma";
import { deleteVectorsByDocumentId } from "@/lib/vector-store";
import { del } from "@vercel/blob";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const { userId } = await auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// 2. หา document (แก้ documentId -> id)
		const document = await prisma.document.findFirst({
			where: {
				id: id,
				userId,
			},
		});

		if (!document) {
			return new NextResponse("Not found", { status: 404 });
		}

		await deleteVectorsByDocumentId(document.id);

		if (document.url) {
			try {
				await del(document.url);
			} catch (error) {
				console.error(
					`Error deleting blob file for document ${document.id} at ${document.url}:`,
					error
				);
			}
		}

		await prisma.document.delete({
			where: { id: document.id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting document:", error);
		return new NextResponse("Failed to delete document", { status: 500 });
	}
}
