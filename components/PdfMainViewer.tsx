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
};

// Expose Method ให้ Parent เรียกใช้
export type PdfMainViewerHandle = {
	scrollToPage: (page: number) => void;
};

export const PdfMainViewer = forwardRef<
	PdfMainViewerHandle,
	PdfMainViewerProps
>(({ fileUrl, selectedPage, onPageChange }, ref) => {
	const [numPages, setNumPages] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Flag: บอกว่าตอนนี้กำลังเลื่อนด้วยการกดปุ่ม (เพื่อหยุด Observer ชั่วคราว)
	const isProgrammaticScroll = useRef(false);

	useImperativeHandle(ref, () => ({
		scrollToPage: (page) => {
			const el = pageRefs.current[page - 1];
			if (el && containerRef.current) {
				isProgrammaticScroll.current = true;
				containerRef.current.scrollTo({
					top: el.offsetTop - 24, // เว้นระยะหัวนิดหน่อย
					behavior: "smooth",
				});

				// ปลดล็อคหลังจากอนิเมชั่นจบ (ประมาณ 800ms)
				setTimeout(() => {
					isProgrammaticScroll.current = false;
				}, 800);
			}
		},
	}));

	// Observer Logic: หาหน้าที่ Visible มากที่สุด
	useEffect(() => {
		if (!containerRef.current || numPages === 0) return;
		const container = containerRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				// ถ้ากำลังเลื่อนด้วยสคริปต์ ให้ข้ามไปเลย กันเลขหน้าตีกัน
				if (isProgrammaticScroll.current) return;

				// หา Page ที่มีพื้นที่แสดงผลในจอมากที่สุด
				const visible = entries.reduce((prev, current) =>
					prev.intersectionRatio > current.intersectionRatio ? prev : current
				);

				if (visible.isIntersecting && visible.target) {
					// ดึงเลขหน้าจาก Attribute
					const pageIndex = parseInt(
						visible.target.getAttribute("data-page-index") || "0"
					);
					onPageChange(pageIndex + 1, numPages);
				}
			},
			{
				root: container,
				threshold: [0.1, 0.5, 0.8], // เช็คหลายจุดเพื่อความแม่นยำ
				rootMargin: "-10% 0px -50% 0px", // Trick: Focus พื้นที่ด้านบนของจอ
			}
		);

		pageRefs.current.forEach((el) => el && observer.observe(el));
		return () => observer.disconnect();
	}, [numPages, onPageChange]);

	return (
		<div
			ref={containerRef}
			className="flex-1 h-full overflow-y-auto bg-slate-100/50 p-6 relative scroll-smooth"
		>
			<Document
				file={fileUrl}
				onLoadSuccess={({ numPages }) => {
					setNumPages(numPages);
					onPageChange(1, numPages);
				}}
				loading={
					<div className="flex flex-col items-center justify-center h-full text-slate-400">
						<Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
						<span className="text-sm">Loading Document...</span>
					</div>
				}
				className="flex flex-col items-center min-h-full pb-20"
			>
				{Array.from({ length: numPages }, (_, i) => i + 1).map((page, i) => (
					<div
						key={page}
						data-page-index={i} // ใช้ระบุตัวตนให้ Observer
						ref={(el) => {
							pageRefs.current[i] = el;
						}}
						className={`mb-8 transition-all duration-500 origin-top ${
							page === selectedPage
								? "shadow-xl ring-1 ring-indigo-200 z-10"
								: "shadow-sm opacity-90 hover:opacity-100"
						}`}
					>
						<Page
							pageNumber={page}
							renderTextLayer={false}
							renderAnnotationLayer={false}
							className="bg-white rounded-lg overflow-hidden"
							width={600} // กำหนดความกว้างขั้นต่ำเพื่อให้ดูดี
						/>
					</div>
				))}
			</Document>
		</div>
	);
});

PdfMainViewer.displayName = "PdfMainViewer";
