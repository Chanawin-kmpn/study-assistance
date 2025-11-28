import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Quiz, QuizAttempt } from "@/generated/prisma/client";
import { QuizDifficulty } from "@/generated/prisma/enums";

type QuizWithAttempts = Quiz & { attempts: QuizAttempt[] };

interface QuizCardProps {
	quiz: QuizWithAttempts;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
	const isCompleted = quiz.attempts.length > 0;

	// Helper สีความยาก
	const difficultyColor = {
		[QuizDifficulty.EASY]: "bg-green-100 text-green-700 border-green-200",
		[QuizDifficulty.MEDIUM]: "bg-yellow-100 text-yellow-700 border-yellow-200",
		[QuizDifficulty.HARD]: "bg-red-100 text-red-700 border-red-200",
	};

	return (
		<Card className="group hover:shadow-md transition-all border-slate-200 bg-white overflow-hidden flex flex-col h-full">
			<CardHeader className="pb-3">
				<div className="flex justify-between items-start gap-2">
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className={difficultyColor[quiz.difficulty]}
						>
							{quiz.difficulty}
						</Badge>
						<span className="text-[10px] text-slate-400 flex items-center">
							<FileText className="w-3 h-3 mr-1" /> {quiz.questionCount} Qs
						</span>
					</div>
					{isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
				</div>
				<CardTitle className="text-lg font-bold line-clamp-1 mt-2 text-slate-800">
					{quiz.title}
				</CardTitle>
			</CardHeader>

			<CardContent className="flex-1 pb-2">
				<p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
					{quiz.description || "No description provided."}
				</p>
				<div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
					<Clock className="w-3 h-3" />
					{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
				</div>
			</CardContent>

			<CardFooter className="pt-2 bg-slate-50/50 border-t border-slate-100">
				<Button
					className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
					size="sm"
				>
					<PlayCircle className="w-4 h-4" />
					{isCompleted ? "Retake Quiz" : "Start Quiz"}
				</Button>
			</CardFooter>
		</Card>
	);
};
