import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ quizId: string }> }
) {
	try {
		const { quizId } = await params;
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const quiz = await prisma.quiz.findFirst({
			where: { id: quizId, userId },
		});

		if (!quiz) {
			return new NextResponse("Quiz Not Found", { status: 404 });
		}

		await prisma.quiz.delete({
			where: { id: quiz.id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("[QUIZ_DELETE]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
