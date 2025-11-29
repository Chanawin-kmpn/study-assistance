"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

type Answer = {
	questionId: string;
	choiceId: string;
	isCorrect: boolean;
	explanation: string | null;
};

// export async function getUserQuizzes() {
// 	const { userId } = await auth();
// 	if (!userId) throw new Error("Unauthorized");

// 	try {
// 		const quizzes = await prisma.quiz.findMany({
// 			where: { userId },
// 			orderBy: { createdAt: "desc" },
// 			include: {
// 				attempts: true,
// 			},
// 		});
// 		return quizzes;
// 	} catch (error) {
// 		console.error("Failed to get quizzes", error);
// 		return [];
// 	}
// }

export async function submitQuiz(
	quizId: string,
	userAnswers: Record<string, string>,
	timeTaken: number
) {
	try {
		const { userId } = await auth();
		if (!userId) throw new Error("Unauthorized");

		// 1. ดึง Quiz และ Choice เพื่อมาตรวจคำตอบ
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				questions: {
					include: { choices: true },
				},
			},
		});

		if (!quiz) throw new Error("Quiz not found");

		let correctCount = 0; // เปลี่ยนชื่อตัวแปรให้ชัดเจนว่าคือนับจำนวนข้อถูก
		const totalQuestions = quiz.questions.length;

		// เตรียมข้อมูลสำหรับบันทึกคำตอบรายข้อ (QuizAnswer)
		const answersToSave: Answer[] = [];

		quiz.questions.forEach((question) => {
			const selectedChoiceId = userAnswers[question.id];
			const correctChoice = question.choices.find((choice) => choice.isCorrect);

			const questionExplanation = question.explanation || null;

			// ตรวจคำตอบ
			const isCorrect = correctChoice && selectedChoiceId === correctChoice.id;
			if (isCorrect) {
				correctCount++;
			}

			// ถ้ามีการตอบ (ไม่ข้าม) ให้เตรียมข้อมูลลง DB
			if (selectedChoiceId) {
				answersToSave.push({
					questionId: question.id,
					choiceId: selectedChoiceId, // Choice ที่ User เลือก
					isCorrect: !!isCorrect, // บันทึกไว้เลยจะได้ไม่ต้อง query เช็คใหม่ทีหลัง (Optional)
					explanation: !isCorrect ? questionExplanation : null,
				});
			}
		});

		// คำนวณ %
		const percentage =
			totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

		// 2. บันทึก Attempt พร้อม Answers (Nested Create)
		const attempt = await prisma.quizAttempt.create({
			data: {
				userId: userId,
				quizId: quizId,

				// Score Data
				score: correctCount, // จำนวนข้อที่ถูก (Int)
				total: totalQuestions, // คะแนนเต็ม (Int)
				percentage: percentage, // เปอร์เซ็นต์ (Float)

				// Status & Time
				status: "COMPLETED",
				duration: timeTaken, // บันทึกเวลาที่ใช้ (วินาที)
				completedAt: new Date(), // เวลาที่ส่ง

				// Resume Info (Reset เพราะจบแล้ว)
				currentQuestionIndex: totalQuestions,

				// Create Relations: บันทึกคำตอบรายข้อไปพร้อมกันเลย
				answers: {
					create: answersToSave,
				},
			},
		});

		revalidatePath(`/quiz/${quizId}`);
		return { success: true, attemptId: attempt.id };
	} catch (error) {
		console.error("Error submitting quiz:", error);
		return { success: false, message: "Failed to submit quiz" };
	}
}
