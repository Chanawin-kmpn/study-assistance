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
			// ดึงมาเยอะหน่อยเผื่อ user อยาก sort ดูคะแนนสูงสุด
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

	// 2. Calculate Stats
	const totalQuestions = quiz.questionCount || quiz._count.questions;
	const attempts = quiz.attempts || [];
	const attemptCount = attempts.length;

	let bestScore = 0;
	if (attemptCount > 0) {
		const maxScoreAttempt = attempts.reduce((prev, current) => {
			return prev.score > current.score ? prev : current;
		});
		bestScore = Math.round(maxScoreAttempt.score);
	}

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
				<Card className="border-slate-200 shadow-sm">
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

				{/* Right: Performance */}
				<Card className="border-slate-200 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="flex items-center gap-2 text-slate-700">
							<Trophy className="w-5 h-5 text-amber-500" />
							Your Performance
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center h-[140px]">
						{attemptCount > 0 ? (
							<div className="text-center space-y-2">
								<div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
									{bestScore}%
								</div>
								<p className="text-sm text-slate-500">
									Best Score from{" "}
									<span className="font-medium text-slate-700">
										{attemptCount}
									</span>{" "}
									attempts
								</p>
							</div>
						) : (
							<div className="text-center space-y-2 opacity-60">
								<div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
									<History className="w-6 h-6 text-slate-400" />
								</div>
								<p className="text-sm text-slate-500">
									You haven&apos;t taken this quiz yet.
								</p>
								<p className="text-xs text-slate-400">
									Challenge yourself to get the best score!
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* --- Recent Attempts Section (New!) --- */}
			{/* เราส่งข้อมูล attempts ไปให้ Client Component จัดการเรื่อง Sort/Display */}
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
