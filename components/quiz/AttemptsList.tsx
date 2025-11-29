"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Trophy, ArrowRight, History } from "lucide-react";
import Link from "next/link";

type Attempt = {
	id: string;
	score: number;
	createdAt: Date;
};

interface AttemptsListProps {
	attempts: Attempt[];
	quizId: string;
}

export function AttemptsList({ attempts, quizId }: AttemptsListProps) {
	const router = useRouter();
	const [sortType, setSortType] = useState<"latest" | "highest">("latest");

	// ถ้าไม่มี Attempt เลย ให้โชว์ Empty State
	if (!attempts || attempts.length === 0) {
		return (
			<div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-10 text-center animate-in fade-in zoom-in duration-500">
				<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
					<History className="w-8 h-8 text-slate-300" />
				</div>
				<h3 className="text-lg font-semibold text-slate-700 mb-2">
					No Attempts Yet
				</h3>
				<p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
					You haven&apos;t taken this quiz yet. Start your first attempt to see
					your progress here!
				</p>
				<Link href={`/quiz/${quizId}/play`}>
					<Button
						variant="outline"
						className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
					>
						Start First Attempt
					</Button>
				</Link>
			</div>
		);
	}

	// Logic การ Sort
	const sortedAttempts = [...attempts].sort((a, b) => {
		if (sortType === "highest") {
			// เรียงคะแนนมาก -> น้อย, ถ้าเท่ากันเอาเวลาล่าสุดขึ้นก่อน
			if (b.score !== a.score) return b.score - a.score;
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		} else {
			// เรียงเวลาล่าสุด -> เก่าสุด
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}
	});

	return (
		<div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
					<History className="w-5 h-5" /> Recent History
				</h3>

				{/* Toggle Sort */}
				<Tabs
					defaultValue="latest"
					value={sortType}
					onValueChange={(v) => setSortType(v as "latest" | "highest")}
					className="w-[200px]"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="latest">Latest</TabsTrigger>
						<TabsTrigger value="highest">Highest</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="border rounded-xl overflow-hidden shadow-sm bg-white">
				<Table>
					<TableHeader className="bg-slate-50">
						<TableRow>
							<TableHead className="w-[100px]">Attempt</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Score</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedAttempts.map((attempt, index) => (
							<TableRow
								key={attempt.id}
								className="hover:bg-slate-50 cursor-pointer group transition-colors"
								onClick={() =>
									router.push(`/quiz/${quizId}/result/${attempt.id}`)
								}
							>
								<TableCell className="font-medium text-slate-600">
									#{attempts.length - index}
									{/* หมายเหตุ: index นี้อาจจะไม่ตรงเป๊ะถ้าวัดจาก Database จริง แต่ใช้แสดงผลคร่าวๆ ได้ */}
								</TableCell>
								<TableCell className="text-slate-600">
									<div className="flex items-center gap-2">
										<CalendarDays className="w-4 h-4 text-slate-400" />
										{formatDistanceToNow(new Date(attempt.createdAt), {
											addSuffix: true,
										})}
									</div>
								</TableCell>
								<TableCell>
									<Badge
										className={`
                                            ${
																							attempt.score >= 80
																								? "bg-green-100 text-green-700 hover:bg-green-200"
																								: attempt.score >= 50
																								? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
																								: "bg-red-100 text-red-700 hover:bg-red-200"
																						}
                                            border-0
                                        `}
									>
										{Math.round(attempt.score)}%
									</Badge>
									{sortType === "highest" && index === 0 && (
										<Trophy className="w-4 h-4 text-amber-500 inline-ml ml-2" />
									)}
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<ArrowRight className="w-4 h-4 text-slate-400" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
