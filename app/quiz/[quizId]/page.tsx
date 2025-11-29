import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Brain,
	ChevronLeft,
	Clock,
	FileText,
	History,
	Play,
	Trophy,
	BookOpen,
	Target,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AttemptsList } from "@/components/quiz/AttemptsList";

interface QuizPageProps {
	params: Promise<{ quizId: string }>;
}

export default async function QuizDetailsPage({ params }: QuizPageProps) {
	const { userId } = await auth();
	if (!userId) redirect("/");

	const { quizId } = await params;

	// 1. Fetch Quiz Data
	const quiz = await prisma.quiz.findFirst({
		where: {
			id: quizId,
			userId: userId,
		},
		include: {
			_count: {
				select: { questions: true },
			},
			attempts: {
				where: { userId: userId },
				orderBy: { createdAt: "desc" },
				take: 20,
			},
		},
	});

	if (!quiz) {
		return (
			<div className="flex h-screen items-center justify-center">
				<h1 className="text-2xl font-bold text-slate-400">Quiz Not Found</h1>
			</div>
		);
	}

	// 2. Calculate Stats (Logic ปรับปรุงใหม่)
	const totalQuestions = quiz.questionCount || quiz._count.questions;
	const attempts = quiz.attempts || [];
	const attemptCount = attempts.length;

	let bestAttempt = null;
	let bestPercentage = 0;

	if (attemptCount > 0) {
		// หา Attempt ที่ percentage สูงที่สุด
		bestAttempt = attempts.reduce((prev, current) => {
			return (prev.percentage || 0) > (current.percentage || 0)
				? prev
				: current;
		});
		bestPercentage = Math.round(bestAttempt.percentage);
	}

	// Helper: เลือกสีตามคะแนน
	const getScoreColor = (p: number) => {
		if (p >= 80) return "text-green-600 stroke-green-600";
		if (p >= 50) return "text-yellow-600 stroke-yellow-600";
		return "text-red-600 stroke-red-600";
	};

	const difficultyColor =
		{
			EASY: "bg-green-100 text-green-700 border-green-200",
			MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
			HARD: "bg-red-100 text-red-700 border-red-200",
		}[quiz.difficulty] || "bg-slate-100 text-slate-700";

	return (
		<div className="flex flex-col h-full max-w-5xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500 pb-24">
			{/* --- Header --- */}
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-2 mb-2">
							<Badge variant="outline" className="text-xs text-slate-500 gap-1">
								{quiz.sourceType === "PDF" && <FileText className="w-3 h-3" />}
								{quiz.sourceType === "LINK" && <BookOpen className="w-3 h-3" />}
								{quiz.sourceType} Source
							</Badge>
							<span className="text-xs text-slate-400">
								Created {format(new Date(quiz.createdAt), "PP")}
							</span>
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
							{quiz.title}
						</h1>
					</div>
					<Badge
						className={`px-4 py-1 text-sm font-bold border ${difficultyColor}`}
					>
						{quiz.difficulty}
					</Badge>
				</div>

				<p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
					{quiz.description || "No description provided."}
				</p>
			</div>

			<Separator />

			{/* --- Stats Grid --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left: Info */}
				<Card className="border-slate-200 shadow-sm h-full">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-slate-700">
							<Brain className="w-5 h-5 text-indigo-500" />
							Quiz Details
						</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="flex flex-col p-4 bg-slate-50 rounded-xl items-center justify-center text-center border border-slate-100">
							<span className="text-3xl font-bold text-slate-800">
								{totalQuestions}
							</span>
							<span className="text-xs text-slate-500 uppercase font-semibold mt-1">
								Questions
							</span>
						</div>
						<div className="flex flex-col p-4 bg-slate-50 rounded-xl items-center justify-center text-center border border-slate-100">
							<Clock className="w-6 h-6 text-slate-400 mb-2" />
							<span className="text-xs text-slate-500 uppercase font-semibold">
								Est. Time
							</span>
							<span className="text-sm font-medium text-slate-700 mt-1">
								{Math.ceil(totalQuestions * 1.5)} Mins
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Right: Performance (Improved UI) */}
				<Card className="border-slate-200 shadow-sm h-full flex flex-col">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="flex items-center gap-2 text-slate-700">
							<Trophy className="w-5 h-5 text-amber-500" />
							Best Performance
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex items-center justify-center py-2">
						{attemptCount > 0 ? (
							<div className="flex items-center gap-8">
								{/* Circular Progress */}
								<div className="relative w-24 h-24">
									<svg className="w-full h-full transform -rotate-90">
										<circle
											cx="48"
											cy="48"
											r="40"
											stroke="currentColor"
											strokeWidth="8"
											fill="transparent"
											className="text-slate-100"
										/>
										<circle
											cx="48"
											cy="48"
											r="40"
											stroke="currentColor"
											strokeWidth="8"
											fill="transparent"
											strokeDasharray={251.2}
											strokeDashoffset={251.2 - (251.2 * bestPercentage) / 100}
											className={`transition-all duration-1000 ease-out ${getScoreColor(
												bestPercentage
											)}`}
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center flex-col">
										<span
											className={`text-xl font-bold ${getScoreColor(
												bestPercentage
											).replace("stroke", "text")}`}
										>
											{bestPercentage}%
										</span>
									</div>
								</div>

								{/* Text Detail */}
								<div className="flex flex-col space-y-1">
									<div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
										Best Score
									</div>
									<div className="text-2xl font-bold text-slate-800">
										{bestAttempt?.score}{" "}
										<span className="text-slate-400 text-lg">
											/ {bestAttempt?.total}
										</span>
									</div>
									<div className="text-xs text-slate-400 flex items-center gap-1">
										<Target className="w-3 h-3" />
										{attemptCount} Total Attempts
									</div>
								</div>
							</div>
						) : (
							<div className="text-center space-y-3 opacity-60 py-4">
								<div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
									<History className="w-7 h-7 text-slate-400" />
								</div>
								<div>
									<p className="text-sm font-medium text-slate-600">
										No attempts yet
									</p>
									<p className="text-xs text-slate-400 mt-1">
										Start the quiz to see your stats
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* --- Recent Attempts Section --- */}
			<div className="mt-8">
				<AttemptsList attempts={attempts} quizId={quizId} />
			</div>

			{/* --- Footer --- */}
			<div className="flex items-center justify-between pt-6 mt-auto">
				<Link href="/quiz">
					<Button
						variant="ghost"
						className="text-slate-500 hover:text-slate-800"
					>
						<ChevronLeft className="w-4 h-4 mr-2" /> Back
					</Button>
				</Link>
				<Link href={`/quiz/${quiz.id}/play`}>
					<Button
						size="lg"
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 px-8 h-12 text-lg hover:scale-105 transition-transform"
					>
						Start Quiz <Play className="w-5 h-5 ml-2 fill-current" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
