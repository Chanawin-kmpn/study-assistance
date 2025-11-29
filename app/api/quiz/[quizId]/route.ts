import { getCurrentUser } from "@/lib/helper/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ quizId: string }> }
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { quizId } = await params;
		const userId = user.id;

		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId, userId },
		});

		if (!quiz) {
			return new NextResponse("Quiz Not Found", { status: 404 });
		}

		await prisma.quiz.delete({
			where: { id: quizId },
		});

		return NextResponse.json({ success: true, message: "Deleted" });
	} catch (error) {
		console.error("[QUIZ_DELETE]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
