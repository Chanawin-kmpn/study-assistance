"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { PdfMainViewer } from "@/components/PdfMainViewer";
import type { PdfMainViewerHandle } from "@/components/PdfMainViewer";

type ChatPdfViewerProps = {
	documentInfo: { id: string; name: string; url: string } | null;
	selectedPage: number;
	numPages: number;
	zoomScale: number;
	onPageChange: (page: number, total: number) => void;
	onSelectPage: (page: number) => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onZoomReset: () => void;
	onCreateQuiz: () => void;
};

export const ChatPdfViewer = forwardRef<
	PdfMainViewerHandle,
	ChatPdfViewerProps
>(
	(
		{
			documentInfo,
			selectedPage,
			numPages,
			zoomScale,
			onPageChange,
			onSelectPage,
			onZoomIn,
			onZoomOut,
			onZoomReset,
			onCreateQuiz,
		},
		ref
	) => {
		return (
			<div
				className="flex flex-col bg-slate-100/50 relative z-10"
				style={{
					width: "calc(100vw - 780px)",
					minWidth: "400px",
				}}
			>
				{/* Header Controls */}
				<div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
					<div className="flex flex-col overflow-hidden mr-4">
						<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
							Current Document
						</span>
						<span
							className="font-bold text-sm text-slate-700 truncate"
							title={documentInfo?.name}
						>
							{documentInfo?.name || "Loading..."}
						</span>
					</div>
					<div className="flex items-center gap-4">
						{/* Zoom Controls */}
						<div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1 border border-slate-200">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={onZoomOut}
								disabled={zoomScale <= 0.5}
								title="Zoom Out"
							>
								<ZoomOut className="w-4 h-4 text-slate-600" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 px-2 min-w-[60px] text-xs font-medium text-slate-600"
								onClick={onZoomReset}
								title="Reset Zoom"
							>
								{Math.round(zoomScale * 100)}%
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={onZoomIn}
								disabled={zoomScale >= 3.0}
								title="Zoom In"
							>
								<ZoomIn className="w-4 h-4 text-slate-600" />
							</Button>
						</div>

						{/* Pagination Controls */}
						<div className="flex items-center bg-slate-100 rounded-lg p-1 gap-2 border border-slate-200">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() => onSelectPage(Math.max(1, selectedPage - 1))}
								disabled={selectedPage <= 1}
							>
								<ChevronLeft className="w-4 h-4 text-slate-600" />
							</Button>
							<span className="text-xs font-medium text-slate-600 w-20 text-center tabular-nums">
								{selectedPage} / {numPages || "--"}
							</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={() =>
									onSelectPage(Math.min(numPages, selectedPage + 1))
								}
								disabled={selectedPage >= numPages}
							>
								<ChevronRight className="w-4 h-4 text-slate-600" />
							</Button>
						</div>

						<Button
							size="sm"
							variant="outline"
							className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
							onClick={onCreateQuiz}
						>
							Create Quiz
						</Button>
					</div>
				</div>

				{/* PDF Viewer */}
				<div className="flex-1 overflow-hidden relative">
					{documentInfo ? (
						<PdfMainViewer
							key={documentInfo.url}
							ref={ref}
							fileUrl={documentInfo.url}
							selectedPage={selectedPage}
							onPageChange={onPageChange}
							zoomScale={zoomScale}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							Select a document to view
						</div>
					)}
				</div>
			</div>
		);
	}
);

ChatPdfViewer.displayName = "ChatPdfViewer";
