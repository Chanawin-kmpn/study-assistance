"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function getUserQuizzes() {
	const { userId } = await auth();
	if (!userId) return [];

	try {
		const quizzes = await prisma.quiz.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			include: {
				attempts: true,
			},
		});
		return quizzes;
	} catch (error) {
		console.error("Failed to get quizzes", error);
		return [];
	}
}
