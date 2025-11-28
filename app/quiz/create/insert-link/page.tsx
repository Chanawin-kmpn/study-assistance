import React from "react";
import { CreateQuizForm } from "@/components/quiz/CreateQuizForm";

export default function InsertLinkPage() {
	return (
		<div className="max-w-5xl mx-auto py-10 px-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-800">
					Create Quiz from Link
				</h1>
				<p className="text-slate-500 text-sm">
					Generate questions from any website or article.
				</p>
			</div>
			<CreateQuizForm sourceType="LINK" />
		</div>
	);
}
