"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios"; // ✅ Import axios

interface CreateQuizDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type DocumentItem = {
	id: string;
	name: string;
	createdAt: string;
};

export function CreateQuizDialog({
	open,
	onOpenChange,
}: CreateQuizDialogProps) {
	const router = useRouter();
	const [documents, setDocuments] = useState<DocumentItem[]>([]);
	const [isLoadingDocs, setIsLoadingDocs] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form State
	const [selectedDocId, setSelectedDocId] = useState<string>("");
	const [questionCount, setQuestionCount] = useState<number>(10);
	const [difficulty, setDifficulty] = useState<string>("EASY");

	// 1. Fetch Documents เมื่อเปิด Dialog (เปลี่ยนเป็น Axios)
	useEffect(() => {
		if (open) {
			const fetchDocs = async () => {
				setIsLoadingDocs(true);
				try {
					const res = await axios.get<DocumentItem[]>("/api/documents");
					setDocuments(res.data);
				} catch (error) {
					console.error("Error fetching docs:", error);
					toast.error("Failed to load documents.");
				} finally {
					setIsLoadingDocs(false);
				}
			};
			fetchDocs();

			// Reset Form
			setSelectedDocId("");
			setQuestionCount(10);
			setDifficulty("EASY");
		}
	}, [open]);

	// 2. Handle Create Quiz
	const handleCreate = async () => {
		if (!selectedDocId) {
			toast.error("Please select a document.");
			return;
		}

		setIsSubmitting(true);
		try {
			// เรียก API สร้าง Quiz (ใช้ axios อยู่แล้ว)
			const response = await axios.post("/api/quiz", {
				documentId: selectedDocId,
				questionCount: questionCount,
				difficulty: difficulty,
			});

			const { quizId } = response.data;

			toast.success("Quiz created successfully!");
			onOpenChange(false);
			// Redirect ไปหน้าเล่น Quiz ทันที
			router.push(`/quiz/${quizId}`);
			router.refresh();
		} catch (error) {
			console.error("Error creating quiz:", error);
			toast.error("Failed to create quiz. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Quiz</DialogTitle>
					<DialogDescription>
						Select a document from your library to generate a quiz.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* 1. Document Selection */}
					<div className="space-y-2">
						<Label>Select Document</Label>
						{isLoadingDocs ? (
							<div className="flex items-center justify-center p-4 border rounded-md bg-slate-50">
								<Loader2 className="w-5 h-5 animate-spin text-slate-400" />
							</div>
						) : documents.length === 0 ? (
							<div className="text-center p-4 border border-dashed rounded-md text-sm text-slate-500">
								No documents found. Please upload a PDF in Chat Space first.
							</div>
						) : (
							<div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1">
								{documents.map((doc) => (
									<div
										key={doc.id}
										onClick={() => setSelectedDocId(doc.id)}
										className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
											selectedDocId === doc.id
												? "border-primary bg-primary/10 ring-1 ring-primary"
												: "border-slate-200 hover:border-primary/20 hover:bg-slate-50"
										}`}
									>
										<div className="flex items-center gap-3 overflow-hidden">
											<div
												className={`p-2 rounded-md ${
													selectedDocId === doc.id
														? "bg-primary/10 text-primary"
														: "bg-slate-100 text-slate-500"
												}`}
											>
												<FileText className="w-4 h-4" />
											</div>
											<span
												className={`text-sm truncate ${
													selectedDocId === doc.id
														? "font-medium text-primary"
														: "text-slate-700"
												}`}
											>
												{doc.name}
											</span>
										</div>
										{selectedDocId === doc.id && (
											<CheckCircle2 className="w-4 h-4 text-primary" />
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* 2. Options Grid */}
					<div className="grid grid-cols-2 gap-4">
						{/* Difficulty */}
						<div className="space-y-2">
							<Label>Difficulty</Label>
							<Select value={difficulty} onValueChange={setDifficulty}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="EASY">Easy</SelectItem>
									<SelectItem value="MEDIUM">Medium</SelectItem>
									<SelectItem value="HARD">Hard</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Question Count */}
						<div className="space-y-2">
							<Label>Questions</Label>
							<Input
								type="number"
								min={1}
								max={20}
								value={questionCount}
								onChange={(e) => setQuestionCount(Number(e.target.value))}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={isSubmitting || !selectedDocId}
						className="bg-primary text-white"
					>
						{isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Generate Quiz
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
