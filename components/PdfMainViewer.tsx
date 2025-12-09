"use client";

import React, {
	useEffect,
	useRef,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

// Config Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

type PdfMainViewerProps = {
	fileUrl: string;
	selectedPage: number;
	onPageChange: (page: number, totalPages: number) => void;
	zoomScale?: number;
};

export type PdfMainViewerHandle = {
	scrollToPage: (page: number) => void;
};

export const PdfMainViewer = forwardRef<
	PdfMainViewerHandle,
	PdfMainViewerProps
>(({ fileUrl, selectedPage, onPageChange, zoomScale = 1.0 }, ref) => {
	const [numPages, setNumPages] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

	const isProgrammaticScroll = useRef(false);

	const actualWidth = 600 * zoomScale;

	useImperativeHandle(ref, () => ({
		scrollToPage: (page) => {
			const el = pageRefs.current[page - 1];
			if (el && containerRef.current) {
				isProgrammaticScroll.current = true;
				containerRef.current.scrollTo({
					top: el.offsetTop - 24,
					behavior: "smooth",
				});

				setTimeout(() => {
					isProgrammaticScroll.current = false;
				}, 800);
			}
		},
	}));

	// Observer Logic
	useEffect(() => {
		if (!containerRef.current || numPages === 0) return;
		const container = containerRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				if (isProgrammaticScroll.current) return;

				const visible = entries.reduce((prev, current) =>
					prev.intersectionRatio > current.intersectionRatio ? prev : current
				);

				if (visible.isIntersecting && visible.target) {
					const pageIndex = parseInt(
						visible.target.getAttribute("data-page-index") || "0"
					);
					onPageChange(pageIndex + 1, numPages);
				}
			},
			{
				root: container,
				threshold: [0.1, 0.5, 0.8],
				rootMargin: "-10% 0px -50% 0px",
			}
		);

		pageRefs.current.forEach((el) => el && observer.observe(el));
		return () => observer.disconnect();
	}, [numPages, onPageChange]);

	return (
		<div
			ref={containerRef}
			className="flex-1 h-full overflow-auto bg-slate-100/50 p-6 relative scroll-smooth"
		>
			{/* ✅ เพิ่ม wrapper เพื่อจัดการ centering */}
			<div className="flex flex-col items-center min-h-full pb-20">
				<Document
					key={fileUrl}
					file={fileUrl}
					onLoadSuccess={({ numPages }) => {
						setNumPages(numPages);
						onPageChange(1, numPages);
					}}
					loading={
						<div className="flex flex-col items-center justify-center h-full text-slate-400">
							<Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
							<span className="text-sm">Loading Document...</span>
						</div>
					}
				>
					{Array.from({ length: numPages }, (_, i) => i + 1).map((page, i) => (
						<div
							key={page}
							data-page-index={i}
							ref={(el) => {
								pageRefs.current[i] = el;
							}}
							className={`mb-8 transition-all duration-300 ${
								page === selectedPage
									? "shadow-xl ring-2 ring-secondary/60 z-10"
									: "shadow-sm opacity-90 hover:opacity-100"
							}`}
						>
							<Page
								pageNumber={page}
								width={actualWidth}
								renderTextLayer={false}
								renderAnnotationLayer={false}
								className="bg-white rounded-lg overflow-hidden"
							/>
						</div>
					))}
				</Document>
			</div>
		</div>
	);
});

PdfMainViewer.displayName = "PdfMainViewer";
