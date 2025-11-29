import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";

interface QuizPlayPageProps {
	params: Promise<{ quizId: string }>;
}

export default async function QuizPlayPage({ params }: QuizPlayPageProps) {
	const { userId } = await auth();
	if (!userId) redirect("/");

	const { quizId } = await params;

	// 1. Fetch Quiz Data
	const quiz = await prisma.quiz.findUnique({
		where: {
			id: quizId,
		},
		include: {
			questions: {
				// ต้องดึง choices มาด้วย
				include: {
					choices: true,
				},
				orderBy: { order: "asc" }, // เรียงข้อ 1, 2, 3
			},
		},
	});

	if (!quiz) {
		return <div>Quiz not found</div>;
	}

	// 2. Security Check: ต้องมั่นใจว่าเราไม่ได้ส่ง field "isCorrect" ไปที่ Client
	// สร้าง object ใหม่ที่สะอาด (Sanitize Data)
	const sanitizedQuiz = {
		id: quiz.id,
		title: quiz.title,
		description: quiz.description,
		questions: quiz.questions.map((q) => ({
			id: q.id,
			prompt: q.prompt,
			// ส่งไปแค่ id กับ text พอ
			choices: q.choices.map((c: { id: string; text: string }) => ({
				id: c.id,
				text: c.text,
			})),
		})),
	};

	return <QuizPlayer quiz={sanitizedQuiz} />;
}
