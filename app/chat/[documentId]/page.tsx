"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	FormEvent,
	useRef,
	useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
// 1. Import Clerk Hooks & Components
import { useUser } from "@clerk/nextjs";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	BrainCircuit,
	ChevronLeft,
	ChevronRight,
	ArrowLeft,
	Loader2,
	MoreVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Import Dynamic Components
const PdfSidebar = dynamic(
	() => import("@/components/PdfSidebar").then((m) => m.PdfSidebar),
	{ ssr: false }
);
const PdfMainViewer = dynamic(
	() => import("@/components/PdfMainViewer").then((m) => m.PdfMainViewer),
	{ ssr: false }
);

import type { PdfMainViewerHandle } from "@/components/PdfMainViewer";
import { AuthRequiredCard } from "@/components/AuthRequireCard";

type DocumentItem = {
	id: string;
	name: string;
	url: string;
};

const ChatPage = () => {
	const router = useRouter();
	const params = useParams<{ documentId: string }>();
	// 2. เรียกใช้ Auth Hook
	const { isLoaded, isSignedIn } = useUser();
	const selectedDocumentId = params.documentId ?? null;

	// ---------- Document & Viewer State ----------
	const [documentInfo, setDocumentInfo] = useState<DocumentItem | null>(null);
	const [numPages, setNumPages] = useState<number>(0);
	const [selectedPage, setSelectedPage] = useState<number>(1);

	const mainViewerRef = useRef<PdfMainViewerHandle>(null);

	// ---------- Chat State ----------
	const [input, setInput] = useState("");

	// หมายเหตุ: chatTransport ยังคงถูกสร้าง แต่ถ้าไม่ login API ปลายทางควรมี Middleware กันไว้อีกชั้น
	const chatTransport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				body: { documentId: selectedDocumentId },
			}),
		[selectedDocumentId]
	);
	const { messages, status, sendMessage, error, stop } = useChat({
		transport: chatTransport,
		id: selectedDocumentId || "default-chat",
	});
	const isThinking = status === "submitted" || status === "streaming";

	// ---------- Fetch Document Info ----------
	const fetchDocumentInfo = useCallback(async () => {
		if (!selectedDocumentId || !isSignedIn) return; // 3. เพิ่ม Check !isSignedIn ป้องกันการ Fetch
		try {
			const res = await fetch("/api/documents");
			if (!res.ok) return;
			const data: DocumentItem[] = await res.json();
			const found = data.find((d) => d.id === selectedDocumentId);
			if (found) setDocumentInfo(found);
		} catch (err) {
			console.error("Failed to fetch document info", err);
		}
	}, [selectedDocumentId, isSignedIn]);

	useEffect(() => {
		// รอให้ Loaded และ SignedIn ก่อนค่อย Fetch
		if (isLoaded && isSignedIn) {
			const t = setTimeout(() => {
				void fetchDocumentInfo();
			}, 0);
			return () => clearTimeout(t);
		}
	}, [fetchDocumentInfo, isLoaded, isSignedIn]);

	// ---------- Handlers ----------
	const handleSidebarSelect = (page: number) => {
		setSelectedPage(page);
		mainViewerRef.current?.scrollToPage(page);
	};

	const handleMainPageChange = (page: number, total: number) => {
		if (page !== selectedPage) {
			setSelectedPage(page);
		}
		setNumPages(total);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage({ text: input });
		setInput("");
	};

	const handleCreateQuiz = () => {
		router.push(`/quiz/create/pdf-upload?documentId=${selectedDocumentId}`);
	};

	// ---------- RENDER LOGIC ----------

	// 4. Loading State (ระหว่างเช็ค User)
	if (!isLoaded) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 text-primary animate-spin" />
			</div>
		);
	}

	// 5. Guest State (ยังไม่ Login) -> แสดง UI สวยๆ
	if (!isSignedIn) {
		return (
			<div className="flex items-center justify-center h-full">
				<AuthRequiredCard
					title="Access Restricted"
					description="To view this document and chat with AI, please sign in to your account."
					showBackButton={true}
				/>
			</div>
		);
	}

	// 6. Main UI (Login แล้ว)
	return (
		<div className="flex h-screen overflow-hidden bg-white text-slate-900 font-sans">
			{/* 1. Left Sidebar: Back + Thumbnails */}
			<div className="w-[280px] flex flex-col border-r border-slate-200 bg-slate-50 shadow-sm z-20">
				<div className="h-16 flex items-center px-4 border-b border-slate-200 bg-white">
					<Button
						variant="ghost"
						size="sm"
						className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 -ml-2"
						onClick={() => router.push("/chat")}
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Library
					</Button>
				</div>

				<div className="flex-1 overflow-hidden relative">
					{documentInfo ? (
						<PdfSidebar
							fileUrl={documentInfo.url}
							selectedPage={selectedPage}
							onSelect={handleSidebarSelect}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							<Loader2 className="animate-spin mr-2 w-4 h-4" /> Loading...
						</div>
					)}
				</div>
			</div>

			{/* 2. Center: Main Viewer + Toolbar */}
			<div className="flex-1 flex flex-col bg-slate-100/50 relative z-10">
				{/* Top Toolbar */}
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
						<div className="flex items-center bg-slate-100 rounded-lg p-1 gap-2 border border-slate-200">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 hover:bg-white hover:shadow-sm"
								onClick={() =>
									handleSidebarSelect(Math.max(1, selectedPage - 1))
								}
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
								className="h-7 w-7 hover:bg-white hover:shadow-sm"
								onClick={() =>
									handleSidebarSelect(Math.min(numPages, selectedPage + 1))
								}
								disabled={selectedPage >= numPages}
							>
								<ChevronRight className="w-4 h-4 text-slate-600" />
							</Button>
						</div>

						<Button
							size="sm"
							variant="outline"
							className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-xs"
							onClick={handleCreateQuiz}
						>
							Create Quiz
						</Button>
					</div>
				</div>

				{/* PDF Content */}
				<div className="flex-1 overflow-hidden relative">
					{documentInfo ? (
						<PdfMainViewer
							ref={mainViewerRef}
							fileUrl={documentInfo.url}
							selectedPage={selectedPage}
							onPageChange={handleMainPageChange}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							Select a document to view
						</div>
					)}
				</div>
			</div>

			{/* 3. Right: Chat Panel */}
			<div className="w-[400px] flex flex-col border-l border-slate-200 bg-white shadow-[-5px_0_20px_-5px_rgba(0,0,0,0.05)] z-30">
				<div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 bg-white">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
							<BrainCircuit className="w-5 h-5" />
						</div>
						<div>
							<h2 className="font-bold text-sm text-slate-800">AI Assistant</h2>
							<p className="text-[10px] text-slate-500">Always ready to help</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-slate-400"
					>
						<MoreVertical className="w-4 h-4" />
					</Button>
				</div>

				{/* Messages Area */}
				<ScrollArea className="flex-1 p-4 bg-slate-50/50">
					{messages.map((m) => (
						<div
							key={m.id}
							className={`mb-5 flex ${
								m.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
									m.role === "user"
										? "bg-indigo-600 text-white rounded-br-none"
										: "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
								}`}
							>
								<div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-li:my-0 text-inherit">
									{m.parts?.map((part, index) =>
										part.type === "text" ? (
											<ReactMarkdown key={index}>{part.text}</ReactMarkdown>
										) : null
									)}
								</div>
							</div>
						</div>
					))}

					{error && (
						<div className="mx-auto my-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs text-center">
							Error: {error.message}
						</div>
					)}

					{isThinking && (
						<div className="flex items-center gap-2 text-slate-400 text-xs px-2 animate-pulse">
							<div
								className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
								style={{ animationDelay: "0ms" }}
							/>
							<div
								className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
								style={{ animationDelay: "150ms" }}
							/>
							<div
								className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
								style={{ animationDelay: "300ms" }}
							/>
							<span className="ml-1">AI is analyzing...</span>
						</div>
					)}
				</ScrollArea>

				{/* Input Area */}
				<div className="p-4 border-t border-slate-200 bg-white">
					<form onSubmit={handleSubmit} className="relative flex items-center">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask any question about this PDF..."
							className="pr-20 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-sm shadow-sm"
							disabled={isThinking}
						/>
						<div className="absolute right-2">
							{isThinking ? (
								<Button
									type="button"
									size="sm"
									variant="ghost"
									onClick={() => stop()}
									className="h-8 px-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-medium"
								>
									Stop
								</Button>
							) : (
								<Button
									type="submit"
									size="sm"
									className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md px-4 transition-all hover:scale-105"
									disabled={!input.trim()}
								>
									Send
								</Button>
							)}
						</div>
					</form>
					<div className="text-[10px] text-center text-slate-400 mt-2">
						AI can make mistakes. Check important info.
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
