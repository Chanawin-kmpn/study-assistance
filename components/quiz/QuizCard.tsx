import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Trophy, Clock, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { QuizDifficulty } from "@/generated/prisma/enums";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QuizCardProps } from "@/types/types.global";

export const QuizCard = ({ quiz }: QuizCardProps) => {
	const attempts = quiz.attempts || [];
	const isCompleted = attempts.length > 0;

	let bestScore = 0;
	if (isCompleted) {
		const maxAttempt = attempts.reduce((prev, curr) =>
			(curr.percentage || 0) > (prev.percentage || 0) ? curr : prev
		);
		bestScore = Math.round(maxAttempt.percentage || 0);
	}

	// Theme Colors based on Difficulty
	const themeColor = {
		[QuizDifficulty.EASY]: {
			bg: "bg-emerald-50",
			text: "text-emerald-700",
			badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
			icon: "text-emerald-600",
			gradient: "from-emerald-500/10 to-emerald-500/5",
			bar: "bg-emerald-500",
		},
		[QuizDifficulty.MEDIUM]: {
			bg: "bg-amber-50",
			text: "text-amber-700",
			badge: "bg-amber-100 text-amber-700 border-amber-200",
			icon: "text-amber-600",
			gradient: "from-amber-500/10 to-amber-500/5",
			bar: "bg-amber-500",
		},
		[QuizDifficulty.HARD]: {
			bg: "bg-rose-50",
			text: "text-rose-700",
			badge: "bg-rose-100 text-rose-700 border-rose-200",
			icon: "text-rose-600",
			gradient: "from-rose-500/10 to-rose-500/5",
			bar: "bg-rose-500",
		},
	}[quiz.difficulty];

	return (
		<Card className="group relative flex flex-col h-full border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 overflow-hidden rounded-2xl">
			{/* Background Gradient Effect on Hover */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
					themeColor.gradient
				)}
			/>

			{/* Top Section: Status & Difficulty */}
			<div className="relative p-5 pb-0 flex justify-between items-start z-10">
				<div
					className={cn(
						"w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
						isCompleted
							? "bg-indigo-100 text-indigo-600"
							: "bg-white border border-slate-100 text-slate-400"
					)}
				>
					{isCompleted ? (
						<Trophy className="w-5 h-5" />
					) : (
						<Target className="w-5 h-5" />
					)}
				</div>

				<Badge
					variant="outline"
					className={cn(
						"font-bold tracking-wide px-2.5 py-1 rounded-lg",
						themeColor.badge
					)}
				>
					{quiz.difficulty}
				</Badge>
			</div>

			{/* Middle Section: Content */}
			<CardHeader className="relative pt-4 pb-2 z-10">
				<h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-indigo-700 transition-colors h-[3.5rem]">
					{quiz.title}
				</h3>
			</CardHeader>

			<CardContent className="relative flex-1 pb-4 z-10">
				<div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4">
					<div className="flex items-center gap-1.5">
						<div className="p-1 rounded bg-slate-100 text-slate-600">
							<span className="font-bold">{quiz.questionCount}</span>
						</div>
						<span>Questions</span>
					</div>
					<div className="w-1 h-1 rounded-full bg-slate-300" />
					<div className="flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5 text-slate-400" />
						<span>
							{formatDistanceToNow(new Date(quiz.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
				</div>

				{/* Progress Bar for Best Score (Only if completed) */}
				{isCompleted && (
					<div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-1000",
								themeColor.bar
							)}
							style={{ width: `${bestScore}%` }}
						/>
					</div>
				)}
			</CardContent>

			{/* Bottom Section: Action */}
			<CardFooter className="relative pt-0 pb-5 px-5 mt-auto z-10 flex items-center justify-between gap-3">
				{isCompleted ? (
					<div className="flex flex-col">
						<span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
							Best Score
						</span>
						<span className={cn("text-lg font-black", themeColor.text)}>
							{bestScore}%
						</span>
					</div>
				) : (
					<div className="flex flex-col">
						<span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
							Status
						</span>
						<span className="text-sm font-bold text-slate-600">
							Not Started
						</span>
					</div>
				)}

				<Link href={`/quiz/${quiz.id}`}>
					<Button
						className={cn(
							"rounded-xl px-6 shadow-lg shadow-indigo-200/50 transition-all duration-300",
							isCompleted
								? "bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
								: "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
						)}
					>
						{isCompleted ? (
							<RotateCcw className="w-4 h-4 mr-2" />
						) : (
							<Play className="w-4 h-4 mr-2 fill-current" />
						)}
						{isCompleted ? "Retake" : "Start"}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};
