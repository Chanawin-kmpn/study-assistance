import React from "react";
import Link from "next/link";
import { FileText, Link as LinkIcon, Type, Plus } from "lucide-react";
import { getUserQuizzes } from "@/lib/actions/quiz.actions";
import { QuizCard } from "@/components/quiz/QuizCard";

export default async function QuizPage() {
	// ดึงข้อมูลจริงจาก DB
	const quizzes = await getUserQuizzes();

	return (
		<div className="flex-1 p-8 bg-slate-50/50 min-h-screen space-y-10">
			{/* Header */}
			<div className="text-center max-w-2xl mx-auto space-y-2">
				<h1 className="text-3xl font-bold text-slate-900">Quiz Library</h1>
				<p className="text-slate-500">
					Create new quizzes from your documents or review your past attempts to
					master your subjects.
				</p>
			</div>

			<hr className="border-slate-200" />

			{/* Section 1: Create Quiz Options */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
					<Plus className="w-5 h-5 text-indigo-600" /> Create New Quiz
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Card 1: Upload PDF */}
					<Link href="/quiz/create/pdf-upload" className="group block">
						<div className="h-full p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center cursor-pointer">
							<div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<FileText className="w-7 h-7 text-red-500" />
							</div>
							<h3 className="font-bold text-slate-800">From PDF Document</h3>
							<p className="text-xs text-slate-500 mt-2">
								Upload a PDF or select from library to generate questions.
							</p>
						</div>
					</Link>

					{/* Card 2: Insert Link */}
					<Link href="/quiz/create/insert-link" className="group block">
						<div className="h-full p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center cursor-pointer">
							<div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<LinkIcon className="w-7 h-7 text-blue-500" />
							</div>
							<h3 className="font-bold text-slate-800">From Web Link</h3>
							<p className="text-xs text-slate-500 mt-2">
								Paste a URL to create a quiz from web content.
							</p>
						</div>
					</Link>

					{/* Card 3: Text */}
					<Link href="/quiz/create/text" className="group block">
						<div className="h-full p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center cursor-pointer">
							<div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<Type className="w-7 h-7 text-emerald-500" />
							</div>
							<h3 className="font-bold text-slate-800">From Text</h3>
							<p className="text-xs text-slate-500 mt-2">
								Paste your notes or any text to generate a quiz.
							</p>
						</div>
					</Link>
				</div>
			</div>

			{/* Section 2: Quiz List */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold text-slate-800">
					Your Quizzes ({quizzes.length})
				</h2>

				{quizzes.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
						<p className="text-slate-400">
							No quizzes created yet. Start by choosing an option above.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{quizzes.map((quiz) => (
							<QuizCard key={quiz.id} quiz={quiz} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
