import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Trophy,
	Clock,
	FileText,
	Link as LinkIcon,
	Type,
	Play,
	ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { QuizDifficulty } from "@/generated/prisma/enums"; // หรือ path enum ของคุณ
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

	// Helper: Source Icon
	const getSourceIcon = () => {
		switch (
			quiz.sourceType // สมมติว่ามี field sourceType
		) {
			case "LINK":
				return <LinkIcon className="w-3.5 h-3.5" />;
			case "TEXT":
				return <Type className="w-3.5 h-3.5" />;
			default:
				return <FileText className="w-3.5 h-3.5" />;
		}
	};

	// Helper: Theme Color based on Difficulty
	const themeColor = {
		[QuizDifficulty.EASY]: "text-emerald-600 bg-emerald-50 border-emerald-200",
		[QuizDifficulty.MEDIUM]: "text-amber-600 bg-amber-50 border-amber-200",
		[QuizDifficulty.HARD]: "text-rose-600 bg-rose-50 border-rose-200",
	}[quiz.difficulty];

	// Helper: Score Color
	const scoreColor = isCompleted
		? bestScore >= 80
			? "text-emerald-600 bg-emerald-50 border-emerald-100"
			: bestScore >= 50
			? "text-amber-600 bg-amber-50 border-amber-100"
			: "text-rose-600 bg-rose-50 border-rose-100"
		: "";

	return (
		<Link href={`/quiz/${quiz.id}`} className="block h-full">
			<Card className="group relative flex flex-col h-full border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 overflow-hidden rounded-2xl cursor-pointer">
				<CardContent className="p-5 flex flex-col h-full">
					{/* 1. Quiz Title & Description */}
					<div className="mb-4">
						<h3 className="text-lg font-bold text-primary leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
							{quiz.title}
						</h3>
						<p className="text-sm text-slate-500 line-clamp-1">
							{quiz.description || "No description available"}
						</p>
					</div>

					{/* 2. Questions Count */}
					<div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
						<span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 border border-slate-200">
							{quiz.questionCount} Questions
						</span>
					</div>

					{/* 3. Status Box (The Main Feature) */}
					<div className="mb-5 flex-1 min-h-[100px]">
						{isCompleted ? (
							// UI for Completed
							<div
								className={cn(
									"h-full w-full rounded-xl border flex flex-col items-center justify-center gap-1 p-4 transition-colors",
									scoreColor
								)}
							>
								<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
									<Trophy className="w-3.5 h-3.5" /> Best Score
								</div>
								<span className="text-3xl font-black tracking-tight">
									{bestScore}%
								</span>
								<div className="text-[10px] opacity-70 mt-1 font-medium">
									Click to review or retake
								</div>
							</div>
						) : (
							// UI for Not Started
							<div className="h-full w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 p-4 group-hover:bg-primary/10/30 group-hover:border-primary/20 transition-all">
								<div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
									<Play className="w-5 h-5 text-secondary/50 fill-current ml-0.5" />
								</div>
								<div className="text-xs font-semibold text-slate-500 group-hover:text-primary">
									Ready to Start?
								</div>
							</div>
						)}
					</div>

					{/* 4. Footer Row 1: Type & Difficulty */}
					<div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
						{/* Type */}
						<div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
							{getSourceIcon()}
							<span className="uppercase">{quiz.sourceType || "PDF"}</span>
						</div>

						{/* Difficulty */}
						<Badge
							variant="outline"
							className={cn(
								"text-[10px] font-bold px-2 py-0.5 rounded-md uppercase",
								themeColor
							)}
						>
							{quiz.difficulty}
						</Badge>
					</div>

					{/* 5. Footer Row 2: Created At */}
					<div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400 font-medium">
						<Clock className="w-3 h-3" />
						Created{" "}
						{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
					</div>
				</CardContent>

				{/* Hover Arrow Indicator (Optional Decoration) */}
				<div className="absolute top-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
					<ArrowRight className="w-5 h-5 text-primary/60" />
				</div>
			</Card>
		</Link>
	);
};
