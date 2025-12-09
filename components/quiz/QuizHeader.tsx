"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	FileText,
	BookOpen,
	MoreVertical,
	Trash2,
	AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios"; // ✅ Import axios

interface QuizHeaderProps {
	quiz: {
		id: string;
		title: string;
		description: string | null;
		sourceType: string;
		difficulty: "EASY" | "MEDIUM" | "HARD";
		createdAt: Date;
	};
}

export function QuizHeader({ quiz }: QuizHeaderProps) {
	const router = useRouter();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const difficultyColor =
		{
			EASY: "bg-green-100 text-green-700 border-green-200",
			MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
			HARD: "bg-red-100 text-red-700 border-red-200",
		}[quiz.difficulty] || "bg-slate-100 text-slate-700";

	// ✅ ใช้ axios.delete
	const handleDeleteQuiz = async () => {
		setIsDeleting(true);

		try {
			await axios.delete(`/api/quiz/${quiz.id}`);

			toast.success("Quiz deleted successfully");
			router.push("/quiz");
			router.refresh();
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete quiz");
			setIsDeleting(false);
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1 flex-1">
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
					<h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
						{quiz.title}
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<Badge
						className={`px-4 py-1 text-sm font-bold border whitespace-nowrap ${difficultyColor}`}
					>
						{quiz.difficulty}
					</Badge>

					{/* --- Dropdown Menu --- */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400"
							>
								<MoreVertical className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => setIsDeleteDialogOpen(true)}
								className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Quiz
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
				{quiz.description || "No description provided."}
			</p>

			{/* --- Delete Dialog --- */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 rounded-full bg-red-100">
								<AlertTriangle className="w-6 h-6 text-red-600" />
							</div>
							<AlertDialogTitle className="text-xl text-red-600">
								Delete Quiz?
							</AlertDialogTitle>
						</div>
						<AlertDialogDescription className="text-slate-600">
							Are you sure you want to delete{" "}
							<strong>&quot;{quiz.title}&quot;</strong>?
							<br />
							This will remove all questions and your attempt history
							permanently.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleDeleteQuiz();
							}}
							className="bg-red-600 hover:bg-red-700 text-white border-0"
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete Quiz"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
