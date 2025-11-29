"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	Save,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitQuiz } from "@/lib/actions/quiz.actions";

// Define Type ให้ตรงกับข้อมูลที่ส่งมาจาก Server (แบบไม่มี isCorrect)
type Choice = {
	id: string;
	text: string;
};

type Question = {
	id: string;
	prompt: string;
	choices: Choice[];
};

type QuizPlayerProps = {
	quiz: {
		id: string;
		title: string;
		description?: string | null;
		questions: Question[];
	};
};

export function QuizPlayer({ quiz }: QuizPlayerProps) {
	const router = useRouter();

	// State
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Timer State
	const [startTime] = useState(() => Date.now());
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	// Timer Effect
	useEffect(() => {
		const timer = setInterval(() => {
			setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);
		return () => clearInterval(timer);
	}, [startTime]);

	// Helper: Format เวลา (MM:SS)
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	// Logic เลือกคำตอบ
	const handleSelect = (choiceId: string) => {
		const currentQ = quiz.questions[currentQuestionIndex];
		setAnswers((prev) => ({
			...prev,
			[currentQ.id]: choiceId,
		}));
	};

	// Logic เปลี่ยนข้อ
	const handleNext = () => {
		if (currentQuestionIndex < quiz.questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	// Logic Submit
	const handleSubmit = async () => {
		// เช็คว่าตอบครบไหม (Optional)
		const answeredCount = Object.keys(answers).length;
		const totalCount = quiz.questions.length;

		if (answeredCount < totalCount) {
			const confirm = window.confirm(
				`You have answered ${answeredCount}/${totalCount} questions. Are you sure you want to submit?`
			);
			if (!confirm) return;
		}

		setIsSubmitting(true);
		try {
			// ส่ง answers และ duration (elapsedSeconds) ไปที่ Server Action
			const result = await submitQuiz(quiz.id, answers, elapsedSeconds);

			if (result.success) {
				toast.success("Quiz submitted successfully!");
				router.replace(`/quiz/${quiz.id}/result/${result.attemptId}`);
			} else {
				toast.error("Failed to submit. Please try again.");
				setIsSubmitting(false);
			}
		} catch (error) {
			toast.error("Something went wrong.");
			setIsSubmitting(false);
		}
	};

	// --- Variables สำหรับ Render ---
	const currentQuestion = quiz.questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
	const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
	const hasAnsweredCurrent = !!answers[currentQuestion.id];

	return (
		<div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto p-4 md:p-6">
			{/* Header: Progress & Timer */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex flex-col gap-1">
					<h2 className="font-bold text-slate-700 flex items-center gap-2">
						<span className="text-indigo-600">Q{currentQuestionIndex + 1}</span>
						<span className="text-slate-400 text-sm font-normal">
							/ {quiz.questions.length}
						</span>
					</h2>
					<Badge
						variant="secondary"
						className="text-xs font-mono w-fit flex gap-1 items-center"
					>
						<Clock className="w-3 h-3" />
						{formatTime(elapsedSeconds)}
					</Badge>
				</div>
				<div className="w-1/3 md:w-1/2">
					<Progress value={progress} className="h-2" />
				</div>
			</div>

			{/* Main Card: Question */}
			<Card className="flex-1 flex flex-col border-slate-200 shadow-md overflow-hidden">
				<CardHeader className="bg-slate-50 border-b border-slate-100 py-8">
					<h3 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
						{currentQuestion.prompt}
					</h3>
				</CardHeader>

				<CardContent className="flex-1 overflow-y-auto p-6 space-y-3">
					{currentQuestion.choices.map((choice) => {
						const isSelected = answers[currentQuestion.id] === choice.id;
						return (
							<div
								key={choice.id}
								onClick={() => handleSelect(choice.id)}
								className={cn(
									"flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative group",
									isSelected
										? "border-indigo-600 bg-indigo-50 shadow-sm"
										: "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
								)}
							>
								<div
									className={cn(
										"w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors",
										isSelected
											? "border-indigo-600 bg-indigo-600"
											: "border-slate-300 group-hover:border-indigo-300"
									)}
								>
									{isSelected && (
										<div className="w-2.5 h-2.5 rounded-full bg-white" />
									)}
								</div>
								<span
									className={cn(
										"text-lg font-medium",
										isSelected ? "text-indigo-900" : "text-slate-700"
									)}
								>
									{choice.text}
								</span>
							</div>
						);
					})}
				</CardContent>

				<Separator />

				{/* Footer: Navigation */}
				<CardFooter className="p-6 bg-white flex justify-between items-center">
					<Button
						variant="ghost"
						onClick={handlePrev}
						disabled={currentQuestionIndex === 0 || isSubmitting}
						className="text-slate-500"
					>
						<ChevronLeft className="w-5 h-5 mr-1" /> Previous
					</Button>

					{isLastQuestion ? (
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting} // ถ้าอยากบังคับตอบทุกข้อ ให้เพิ่ม || !hasAnsweredCurrent
							className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
								</>
							) : (
								<>
									Submit Quiz <Save className="w-4 h-4 ml-2" />
								</>
							)}
						</Button>
					) : (
						<Button
							onClick={handleNext}
							className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
						>
							Next <ChevronRight className="w-5 h-5 ml-1" />
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
