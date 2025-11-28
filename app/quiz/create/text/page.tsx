import React from "react";
import { CreateQuizForm } from "@/components/quiz/CreateQuizForm";

export default function TextPage() {
	return (
		<div className="max-w-5xl mx-auto py-10 px-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-800">
					Create Quiz from Text
				</h1>
				<p className="text-slate-500 text-sm">
					Paste your notes to test your understanding.
				</p>
			</div>
			<CreateQuizForm sourceType="TEXT" />
		</div>
	);
}
