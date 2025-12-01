"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
	Loader2,
	Search,
	Brain,
	FileText,
	Link as LinkIcon,
	Type,
	Plus,
	LayoutGrid,
	Sparkles,
	MessageSquareText,
	Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthRequiredCard } from "@/components/AuthRequireCard";
import { QuizCard } from "@/components/quiz/QuizCard";
import Link from "next/link";
import { QuizWithAttempts } from "@/types/types.global";

// 1. Fetcher Function
const fetchQuizzes = async () => {
	const res = await axios.get<QuizWithAttempts[]>("/api/quiz");
	return res.data;
};

export default function QuizLibraryPage() {
	const { isLoaded, isSignedIn } = useUser();
	const [searchQuery, setSearchQuery] = useState("");

	// 2. React Query
	const { data: quizzes, isLoading } = useQuery({
		queryKey: ["quizzes"],
		queryFn: fetchQuizzes,
		enabled: !!isSignedIn,
		staleTime: 1000 * 60 * 5,
	});

	const quizList = quizzes || [];

	const filteredQuizzes = quizList.filter((quiz) =>
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
			<header className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-slate-50 z-20 border-b border-slate-100/50 backdrop-blur-sm bg-slate-50/90">
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
						<div className="w-full mb-12">
							<div className="flex items-center gap-2 mb-6">
								<div className="p-1.5 rounded-md bg-primary text-white shadow-sm shadow-primary/20">
									<Plus className="w-4 h-4" />
								</div>
								<h2 className="text-lg font-bold text-slate-800">
									Create New Quiz
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
								{/* Card 1: PDF */}
								<Link href="/quiz/create/pdf-upload" className="group">
									<div className="bg-white h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition-all p-6 flex flex-col relative overflow-hidden">
										<div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
											Supports AI Chat
										</div>
										<div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
											<FileText className="w-6 h-6 text-red-500" />
										</div>
										<h3 className="font-bold text-lg text-slate-800 group-hover:text-red-600 mb-1">
											From PDF
										</h3>
										<p className="text-xs text-slate-400 mb-4 line-clamp-2">
											Upload slides, textbooks, or research papers.
										</p>
										<div className="mt-auto pt-4 border-t border-slate-50">
											<div className="flex items-start gap-2">
												<MessageSquareText className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
												<span className="text-[11px] font-medium text-slate-500 leading-tight">
													Best for{" "}
													<span className="text-red-500 font-bold">
														Long Documents
													</span>
													. Saves to Vector DB for future chatting.
												</span>
											</div>
										</div>
									</div>
								</Link>

								{/* Card 2: Link */}
								<Link href="/quiz/create/insert-link" className="group">
									<div className="bg-white h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all p-6 flex flex-col relative overflow-hidden">
										<div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
											<LinkIcon className="w-6 h-6 text-blue-500" />
										</div>
										<h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 mb-1">
											From Web Link
										</h3>
										<p className="text-xs text-slate-400 mb-4 line-clamp-2">
											Paste a URL from any website or article.
										</p>
										<div className="mt-auto pt-4 border-t border-slate-50">
											<div className="flex items-start gap-2">
												<Sparkles className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
												<span className="text-[11px] font-medium text-slate-500 leading-tight">
													Best for{" "}
													<span className="text-blue-500 font-bold">
														Articles & News
													</span>
													. Extracts content instantly for testing.
												</span>
											</div>
										</div>
									</div>
								</Link>

								{/* Card 3: Text */}
								<Link href="/quiz/create/text" className="group">
									<div className="bg-white h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 transition-all p-6 flex flex-col relative overflow-hidden">
										<div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
											<Type className="w-6 h-6 text-emerald-500" />
										</div>
										<h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 mb-1">
											From Text
										</h3>
										<p className="text-xs text-slate-400 mb-4 line-clamp-2">
											Paste your raw notes or summaries.
										</p>
										<div className="mt-auto pt-4 border-t border-slate-50">
											<div className="flex items-start gap-2">
												<Zap className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
												<span className="text-[11px] font-medium text-slate-500 leading-tight">
													Best for{" "}
													<span className="text-emerald-500 font-bold">
														Short Notes
													</span>
													. Quick generation without storing vectors.
												</span>
											</div>
										</div>
									</div>
								</Link>
							</div>
						</div>

						<div className="w-full">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
								<h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
									<LayoutGrid className="w-5 h-5 text-primary" />
									Your Quizzes ({filteredQuizzes.length})
								</h2>
								<div className="relative w-full sm:w-auto">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
									<Input
										placeholder="Search quizzes..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9 w-full sm:w-72 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-primary/50 focus-visible:border-primary"
									/>
								</div>
							</div>

							{/* เช็ค isLoading จาก useQuery */}
							{isLoading ? (
								<div className="flex justify-center py-12">
									<Loader2 className="w-8 h-8 text-primary animate-spin" />
								</div>
							) : filteredQuizzes.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
									{filteredQuizzes.map((quiz) => (
										<div key={quiz.id} className="h-full">
											<QuizCard quiz={quiz} />
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 shadow-inner">
										<Brain className="w-8 h-8 text-slate-300" />
									</div>
									<h3 className="text-slate-600 font-bold text-lg">
										No quizzes found
									</h3>
									<p className="text-slate-400 text-sm mt-1 max-w-xs">
										It looks a bit empty here. Pick a method above to create
										your first quiz!
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
