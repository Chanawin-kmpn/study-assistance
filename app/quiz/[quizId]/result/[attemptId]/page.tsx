import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/helper/getCurrentUser";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	CheckCircle2,
	XCircle,
	RotateCcw,
	ArrowLeft,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResultPageProps {
	params: Promise<{
		quizId: string;
		attemptId: string;
	}>;
}

export default async function QuizResultPage({ params }: ResultPageProps) {
	const { quizId, attemptId } = await params;
	const user = await getCurrentUser();

	if (!user) redirect("/");

	const attempt = await prisma.quizAttempt.findUnique({
		where: { id: attemptId },
		include: {
			// ดึงคำตอบที่ User ตอบไปมาด้วย
			answers: true,
		},
	});

	const quiz = await prisma.quiz.findUnique({
		where: { id: quizId },
		include: {
			questions: {
				include: { choices: true },
			},
		},
	});

	if (!attempt || !quiz) return <div>Data not found</div>;

	// 3. สร้าง Map เพื่อให้ค้นหาคำตอบของ User ได้ง่ายๆ (O(1) Lookup)
	// key = questionId, value = choiceId ที่ User เลือก
	const userAnswersMap = new Map(
		attempt.answers.map((ans) => [ans.questionId, ans.choiceId])
	);

	return (
		<div className="max-w-4xl mx-auto p-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Score Summary */}
			<div className="flex flex-col items-center justify-center space-y-4 py-8">
				<h1 className="text-2xl font-bold text-secondary">Quiz Result</h1>

				<div className="relative flex flex-col items-center justify-center">
					<div
						className={cn(
							"text-6xl font-extrabold tracking-tight",
							attempt.percentage >= 80
								? "text-green-600"
								: attempt.percentage >= 50
								? "text-yellow-600"
								: "text-red-600"
						)}
					>
						{Math.round(attempt.percentage)}%
					</div>
					<span className="text-slate-400 font-medium mt-2">
						Score: {attempt.score} / {attempt.total}
					</span>
				</div>

				<p className="text-slate-500 text-sm">
					Completed on {new Date(attempt.createdAt).toLocaleDateString()} at{" "}
					{new Date(attempt.createdAt).toLocaleTimeString()}
				</p>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-center gap-4">
				<Link href={`/quiz/${quizId}`}>
					<Button variant="outline" className="text-primary hover:text-primary">
						<ArrowLeft className="w-4 h-4 mr-2" /> Back to Details
					</Button>
				</Link>
				<Link href={`/quiz/${quizId}/play`}>
					<Button className="bg-primary text-white">
						<RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
					</Button>
				</Link>
			</div>

			<div className="border-t border-slate-200 my-6" />

			{/* Questions Review */}
			<div className="space-y-6">
				<h2 className="text-xl font-bold text-secondary mb-4">
					Detailed Review
				</h2>

				{quiz.questions.map((q, index) => {
					// เช็คว่าข้อนี้ User ตอบอะไร
					const userAnswerId = userAnswersMap.get(q.id);
					const isCorrectAnswer = q.choices.find(
						(c) => c.id === userAnswerId
					)?.isCorrect;
					const isSkipped = !userAnswerId;

					return (
						<Card
							key={q.id}
							className={cn(
								"border-2 overflow-hidden",
								// เปลี่ยนสีขอบ Card ตามผลลัพธ์ (Optional)
								isCorrectAnswer
									? "border-green-100"
									: isSkipped
									? "border-slate-200"
									: "border-red-100"
							)}
						>
							<div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-start">
								<div>
									<span className="font-bold text-slate-500 mr-2">
										Q{index + 1}.
									</span>
									<span className="font-medium text-primary">{q.prompt}</span>
								</div>
								{/* Status Badge ที่หัวข้อ */}
								{isCorrectAnswer ? (
									<Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 gap-1">
										<CheckCircle2 className="w-3 h-3" /> Correct
									</Badge>
								) : isSkipped ? (
									<Badge variant="outline" className="text-slate-500 gap-1">
										<AlertCircle className="w-3 h-3" /> Skipped
									</Badge>
								) : (
									<Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 gap-1">
										<XCircle className="w-3 h-3" /> Incorrect
									</Badge>
								)}
							</div>

							<CardContent className="p-6 space-y-3">
								{q.choices.map((choice) => {
									const isSelected = userAnswerId === choice.id;
									const isCorrect = choice.isCorrect;

									let styleClass = "bg-white border-slate-200 text-slate-600"; // Default

									if (isCorrect) {
										// เฉลยที่ถูก (สีเขียวเสมอ ไม่ว่าจะตอบถูกหรือผิด)
										styleClass =
											"bg-green-50 border-green-200 text-green-800 font-medium";
									} else if (isSelected && !isCorrect) {
										// User ตอบผิด (สีแดง)
										styleClass = "bg-red-50 border-red-200 text-red-800";
									} else if (isSelected && isCorrect) {
										// User ตอบถูก (สีเขียวเข้มขึ้นนิดนึง - แต่จริงๆใช้ logic isCorrect ข้างบนคลุมแล้ว)
										styleClass = "bg-green-100 border-green-300 text-green-900";
									}

									return (
										<div
											key={choice.id}
											className={cn(
												"flex items-center justify-between p-3 rounded-lg border transition-colors",
												styleClass
											)}
										>
											<div className="flex items-center gap-3">
												{/* Radio Circle จำลอง */}
												<div
													className={cn(
														"w-4 h-4 rounded-full border flex items-center justify-center",
														isSelected
															? isCorrect
																? "border-green-600 bg-green-600"
																: "border-red-500 bg-red-500"
															: "border-slate-300"
													)}
												>
													{isSelected && (
														<div className="w-1.5 h-1.5 bg-white rounded-full" />
													)}
												</div>
												<span className="flex-1">{choice.text}</span>
											</div>

											{/* Labels */}
											<div className="flex items-center gap-2">
												{isSelected && !isCorrect && (
													<span className="text-xs font-bold text-red-600">
														Your Answer
													</span>
												)}
												{isCorrect && (
													<Badge className="bg-green-600 hover:bg-green-600 text-xs">
														Correct Answer
													</Badge>
												)}
											</div>
										</div>
									);
								})}

								{/* Explanation Zone: แสดงเมื่อมี explanation และ (ตอบผิด หรือ อยากให้โชว์ตลอดก็ได้) */}
								{q.explanation && (
									<div
										className={cn(
											"mt-4 p-4 rounded-lg border text-sm flex gap-3 items-start",
											isCorrectAnswer
												? "bg-primary/10 border-primary-20 text-primary"
												: "bg-red-50 border-red-100 text-red-800"
										)}
									>
										<AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
										<div>
											<span className="font-bold block mb-1">Explanation:</span>
											{q.explanation}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
