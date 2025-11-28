import React from "react";
import { CreateQuizForm } from "@/components/quiz/CreateQuizForm";

// Next.js 15: searchParams is a Promise
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PdfUploadPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	// 1. Await the searchParams
	const resolvedSearchParams = await searchParams;

	// 2. Extract documentId
	const documentId =
		typeof resolvedSearchParams.documentId === "string"
			? resolvedSearchParams.documentId
			: undefined;

	return (
		<div className="max-w-5xl mx-auto py-10 px-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-800">
					Create Quiz from PDF
				</h1>
				<p className="text-slate-500 text-sm">
					Upload a new PDF or use an existing document.
				</p>
			</div>
			{/* ส่งค่าไปให้ Form */}
			<CreateQuizForm sourceType="PDF" defaultDocumentId={documentId} />
		</div>
	);
}
