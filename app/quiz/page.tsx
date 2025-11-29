"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
	Loader2,
	Search,
	Brain,
	FileText,
	Link as LinkIcon,
	Type,
	Plus,
	LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthRequiredCard } from "@/components/AuthRequireCard";
import { QuizCard } from "@/components/quiz/QuizCard";
import Link from "next/link";
import { QuizWithAttempts } from "@/types/types.global";

export default function QuizLibraryPage() {
	const { isLoaded, isSignedIn } = useUser();

	// --- State ---
	const [quizzes, setQuizzes] = useState<QuizWithAttempts[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// --- Fetch Quizzes ---
	const fetchQuizzes = useCallback(async () => {
		if (!isSignedIn) return;
		try {
			setIsLoading(true);
			const res = await fetch("/api/quiz"); // ตรวจสอบ Endpoint ให้ถูกต้อง
			if (!res.ok) throw new Error("Failed to fetch");
			const data = await res.json();
			setQuizzes(data);
		} catch (err) {
			console.error("Failed to fetch quizzes", err);
		} finally {
			setIsLoading(false);
		}
	}, [isSignedIn]);

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			fetchQuizzes();
		} else if (isLoaded && !isSignedIn) {
			setIsLoading(false);
		}
	}, [isLoaded, isSignedIn, fetchQuizzes]);

	// --- Filter Logic ---
	const filteredQuizzes = quizzes.filter((quiz) =>
		quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (!isLoaded) {
		return (
			<div className="h-full flex items-center justify-center bg-slate-50">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-slate-50 relative overflow-y-auto font-prompt">
			{/* --- Header (Style เดียวกับ Chat) --- */}
			<header className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-slate-50 z-20">
				<div>
					<h1 className="text-2xl font-bold text-primary">Quiz Library</h1>
					<p className="text-slate-500 text-sm">
						Create new quizzes or review your past attempts.
					</p>
				</div>
			</header>

			<div className="flex-1 flex flex-col items-center p-6 pb-20 max-w-6xl mx-auto w-full">
				{isSignedIn ? (
					<>
						{/* 1. Action Cards Area (แทนที่ Upload Box เดิม แต่ใช้ Design คล้ายกัน) */}
						<div className="w-full max-w-4xl mb-10">
							<div className="flex items-center gap-2 mb-4">
								<div className="p-1.5 rounded-md bg-primary/10 text-primary">
									<Plus className="w-4 h-4" />
								</div>
								<h2 className="text-lg font-bold text-primary">
									Create New Quiz
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Card 1: PDF */}
								<Link href="/quiz/create/pdf-upload" className="group">
									<div className="bg-white h-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/30 hover:shadow-lg hover:bg-indigo-50/30 transition-all p-6 flex flex-col items-center text-center cursor-pointer">
										<div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
											<FileText className="w-6 h-6 text-red-500" />
										</div>
										<h3 className="font-bold text-slate-700 group-hover:text-primary">
											From PDF
										</h3>
										<p className="text-xs text-slate-400 mt-1">
											Upload slides or books to generate questions.
										</p>
									</div>
								</Link>

								{/* Card 2: Link */}
								<Link href="/quiz/create/insert-link" className="group">
									<div className="bg-white h-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/30 hover:shadow-lg hover:bg-blue-50/30 transition-all p-6 flex flex-col items-center text-center cursor-pointer">
										<div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
											<LinkIcon className="w-6 h-6 text-blue-500" />
										</div>
										<h3 className="font-bold text-slate-700 group-hover:text-blue-600">
											From Web Link
										</h3>
										<p className="text-xs text-slate-400 mt-1">
											Paste a URL to create a quiz from web content.
										</p>
									</div>
								</Link>

								{/* Card 3: Text */}
								<Link href="/quiz/create/text" className="group">
									<div className="bg-white h-full rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/30 hover:shadow-lg hover:bg-emerald-50/30 transition-all p-6 flex flex-col items-center text-center cursor-pointer">
										<div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
											<Type className="w-6 h-6 text-emerald-500" />
										</div>
										<h3 className="font-bold text-slate-700 group-hover:text-emerald-600">
											From Text
										</h3>
										<p className="text-xs text-slate-400 mt-1">
											Paste notes to generate a quiz instantly.
										</p>
									</div>
								</Link>
							</div>
						</div>

						{/* 2. Quiz List */}
						<div className="w-full">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
								<h2 className="text-lg font-bold text-primary flex items-center gap-2">
									<LayoutGrid className="w-5 h-5" />
									Your Quizzes ({filteredQuizzes.length})
								</h2>

								<div className="relative w-full sm:w-auto">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
									<Input
										placeholder="Search quizzes..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9 w-full sm:w-72 rounded-full border-slate-200 bg-white focus-visible:ring-secondary"
									/>
								</div>
							</div>

							{isLoading ? (
								<div className="flex justify-center py-12">
									<Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
								</div>
							) : filteredQuizzes.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{filteredQuizzes.map((quiz) => (
										// ตรงนี้ Layout ของ Card จะถูกจัดการโดย Component QuizCard เอง
										// แต่เราครอบ div เพื่อกำหนดความสูงให้เท่ากัน
										<div key={quiz.id} className="h-full">
											<QuizCard quiz={quiz} />
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center">
									<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
										<Brain className="w-7 h-7 text-slate-400" />
									</div>
									<h3 className="text-slate-600 font-medium">
										No quizzes found
									</h3>
									<p className="text-slate-400 text-sm mt-1">
										Select an option above to create your first quiz.
									</p>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="flex items-center justify-center h-full w-full pt-10">
						<AuthRequiredCard
							title="Sign in to Access Quiz Library"
							description="Create personalized quizzes from your documents and track your learning progress."
							footerText="Join thousands of students mastering their subjects with AI."
						/>
					</div>
				)}
			</div>
		</div>
	);
}
