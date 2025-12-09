"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Config Worker ตามที่คุณระบุ
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

type PdfSidebarProps = {
	fileUrl: string;
	selectedPage: number;
	onSelect: (page: number) => void;
};

export function PdfSidebar({
	fileUrl,
	selectedPage,
	onSelect,
}: PdfSidebarProps) {
	const [numPages, setNumPages] = useState(0);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Auto-scroll: เมื่อ selectedPage เปลี่ยน ให้เลื่อน Sidebar หาหน้านั้น
	useEffect(() => {
		const activeItem = itemRefs.current[selectedPage - 1];
		if (activeItem && sidebarRef.current) {
			const container = sidebarRef.current;
			const itemTop = activeItem.offsetTop;
			const itemBottom = itemTop + activeItem.offsetHeight;
			const containerTop = container.scrollTop;
			const containerBottom = containerTop + container.offsetHeight;

			// ถ้า Item ไม่อยู่ในจอ ให้เลื่อนไปหา
			if (itemTop < containerTop || itemBottom > containerBottom) {
				activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	}, [selectedPage]);

	return (
		<div className="flex flex-col h-full bg-slate-50/50">
			<div className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-white sticky top-0 z-10">
				Pages
			</div>
			<div
				ref={sidebarRef}
				className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
			>
				<Document
					key={fileUrl}
					file={fileUrl}
					loading={<div className="text-xs text-slate-400 p-2">Loading...</div>}
					onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					className="flex flex-col gap-3 items-center"
				>
					{Array.from({ length: numPages }, (_, i) => i + 1).map((page, i) => (
						<div
							key={page}
							ref={(el) => {
								itemRefs.current[i] = el;
							}}
							onClick={() => onSelect(page)}
							className={`
                                relative cursor-pointer rounded-md overflow-hidden border transition-all duration-200
                                ${
																	page === selectedPage
																		? "border-secondary/50 shadow-md ring-2 ring-secondary/10"
																		: "border-slate-200 hover:border-secondary/30 bg-white hover:shadow-sm"
																}
                            `}
						>
							<div
								className={`absolute top-1 right-1 z-10 text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-sm ${
									page === selectedPage ? "bg-secondary" : "bg-slate-500/80"
								}`}
							>
								{page}
							</div>
							<Page
								pageNumber={page}
								width={150}
								renderTextLayer={false}
								renderAnnotationLayer={false}
								className="opacity-90 hover:opacity-100 transition-opacity"
							/>
						</div>
					))}
				</Document>
			</div>
		</div>
	);
}
