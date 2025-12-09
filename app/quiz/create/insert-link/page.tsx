import { CreateQuizForm } from "@/components/quiz/CreateQuizForm";

export default function InsertLinkPage() {
	return (
		<>
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-primary">
					Create Quiz from Link
				</h1>
				<p className="text-slate-500 text-sm">
					Generate questions from any website or article.
				</p>
			</div>
			<CreateQuizForm sourceType="LINK" />
		</>
	);
}
