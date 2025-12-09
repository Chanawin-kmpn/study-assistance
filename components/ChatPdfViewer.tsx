"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

type Props = {
	fileUrl: string;
	onPageChange?: (page: number, total: number) => void;
};

export function ChatPdfViewer({ fileUrl, onPageChange }: Props) {
	const [numPages, setNumPages] = useState(0);
	const [selectedPage, setSelectedPage] = useState(1);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const raf = requestAnimationFrame(() => {
			setSelectedPage(1);
			if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
		});
		return () => cancelAnimationFrame(raf);
	}, [fileUrl]);

	useEffect(() => {
		if (!containerRef.current || numPages === 0) return;
		const root = containerRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

				if (visible?.target) {
					const pageIndex = pageRefs.current.indexOf(
						visible.target as HTMLDivElement
					);
					if (pageIndex >= 0) {
						const page = pageIndex + 1;
						setSelectedPage(page);
						onPageChange?.(page, numPages);
					}
				}
			},
			{ root, threshold: 0.6 }
		);

		pageRefs.current.forEach((el) => el && observer.observe(el));
		return () => observer.disconnect();
	}, [numPages, onPageChange]);

	const scrollToPage = (page: number) => {
		const el = pageRefs.current[page - 1];
		if (el && containerRef.current) {
			containerRef.current.scrollTo({
				top: el.offsetTop - 24,
				behavior: "smooth",
			});
		}
		setSelectedPage(page);
		onPageChange?.(page, numPages);
	};

	return (
		<div className="flex gap-4 h-full">
			{/* thumbnails */}
			<div className="w-[90px] bg-[#090f1f] border border-slate-800 rounded-lg p-2">
				<div className="text-xs text-slate-300 mb-2 px-1">Pages</div>
				<div className="h-[calc(100%-1.75rem)] overflow-y-auto pr-1">
					<Document
						file={fileUrl}
						loading={null}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					>
						{Array.from({ length: numPages || 0 }, (_, i) => i + 1).map(
							(page) => (
								<div
									key={page}
									onClick={() => scrollToPage(page)}
									className={`mb-2 cursor-pointer rounded-md border overflow-hidden ${
										page === selectedPage
											? "border-primary/60 bg-primary/10"
											: "border-slate-700 hover:bg-slate-800/60"
									}`}
								>
									<Page
										pageNumber={page}
										width={70}
										renderTextLayer={false}
										renderAnnotationLayer={false}
									/>
								</div>
							)
						)}
					</Document>
				</div>
			</div>

			{/* main viewer */}
			<div
				ref={containerRef}
				className="flex-1 overflow-auto bg-[#050816] rounded-lg px-4 py-6 flex flex-col items-center"
			>
				<Document
					file={fileUrl}
					onLoadSuccess={({ numPages }) => {
						setNumPages(numPages);
						onPageChange?.(1, numPages);
					}}
					loading={
						<div className="text-xs text-slate-400 p-4">Loading PDF...</div>
					}
				>
					{Array.from({ length: numPages || 0 }, (_, i) => i + 1).map(
						(page) => (
							<div
								key={page}
								ref={(el) => {
									pageRefs.current[page - 1] = el;
								}}
								className="mb-6 shadow-lg shadow-black/40"
							>
								<Page
									pageNumber={page}
									renderTextLayer={false}
									renderAnnotationLayer={false}
								/>
							</div>
						)
					)}
				</Document>
			</div>
		</div>
	);
}
