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
import { useUser } from "@clerk/nextjs";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	BrainCircuit,
	ChevronLeft,
	ChevronRight,
	ArrowLeft,
	Loader2,
	MessageSquare,
	PlusCircle,
	History,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

// Actions & Components
import type { PdfMainViewerHandle } from "@/components/PdfMainViewer";
import { AuthRequiredCard } from "@/components/AuthRequireCard";
import { getChatMessages, getChatsByDocument } from "@/lib/actions/chat.action";

// Dynamic imports
const PdfSidebar = dynamic(
	() => import("@/components/PdfSidebar").then((m) => m.PdfSidebar),
	{ ssr: false }
);
const PdfMainViewer = dynamic(
	() => import("@/components/PdfMainViewer").then((m) => m.PdfMainViewer),
	{ ssr: false }
);

type DocumentItem = { id: string; name: string; url: string };
type ChatSession = { id: string; title: string; createdAt: Date };

const ChatPage = () => {
	const router = useRouter();
	const params = useParams<{ documentId: string }>();
	const mainViewerRef = useRef<PdfMainViewerHandle>(null);

	const { isLoaded, isSignedIn } = useUser();
	const selectedDocumentId = params.documentId ?? null;

	// State
	const [documentInfo, setDocumentInfo] = useState<DocumentItem | null>(null);
	const [chatId, setChatId] = useState<string>(() => nanoid());
	const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [numPages, setNumPages] = useState<number>(0);
	const [selectedPage, setSelectedPage] = useState<number>(1);
	const [input, setInput] = useState("");
	const [zoomScale, setZoomScale] = useState<number>(1.0);

	// 1. Setup Transport
	const chatTransport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				body: { documentId: selectedDocumentId, chatId },
			}),
		[selectedDocumentId, chatId]
	);

	// 2. Setup useChat
	// ✅ ดึง setMessages ออกมาใช้
	const { messages, setMessages, status, sendMessage, error, stop } = useChat({
		transport: chatTransport,
		id: chatId, // ผูก ID ให้ตรง
		messages: [], // เริ่มต้นว่างๆ ไว้ เดี๋ยวเรา load เอง
		onFinish: () => {
			void refreshHistory();
		},
	});

	const isThinking = status === "submitted" || status === "streaming";

	// 3. Logic เลือก Chat เก่า
	const selectChat = useCallback(
		async (id: string) => {
			try {
				setChatId(id);
				setIsHistoryOpen(false);

				const msgs = await getChatMessages(id);

				const formattedMsgs = msgs.map((m) => ({
					id: m.id,
					role: m.role as "user" | "assistant",
					parts: [{ type: "text", text: m.content }],
				}));

				setMessages(formattedMsgs as unknown as UIMessage[]);
			} catch (error) {
				console.error("Error loading chat messages:", error);
			}
		},
		[setMessages]
	);

	// 4. Logic สร้าง Chat ใหม่
	const handleNewChat = () => {
		const newId = nanoid();
		setChatId(newId);
		setMessages([]); // ✅ เคลียร์หน้าจอผ่าน hook
		setIsHistoryOpen(false);
	};

	// 5. Refresh History
	const refreshHistory = async () => {
		if (!selectedDocumentId) return;
		try {
			const history = await getChatsByDocument(selectedDocumentId);
			setChatHistory(history);
		} catch (e) {
			console.error("Failed to refresh history", e);
		}
	};

	// 6. Load Data on Mount
	const initPageData = useCallback(async () => {
		// ถ้าไม่มี ID หรือยังไม่ Login ให้จบทำงานเลย
		if (!selectedDocumentId || !isSignedIn) return;

		try {
			// ✅ Performance: ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกันทั้ง 2 อย่าง
			const [docRes, historyData] = await Promise.all([
				fetch("/api/documents").then((res) => (res.ok ? res.json() : [])),
				getChatsByDocument(selectedDocumentId),
			]);

			// จัดการ Document Info
			const foundDoc = (docRes as DocumentItem[]).find(
				(d) => d.id === selectedDocumentId
			);
			if (foundDoc) setDocumentInfo(foundDoc);

			// จัดการ Chat History
			setChatHistory(historyData);

			// Logic การเลือก Chat เริ่มต้น
			if (historyData.length > 0) {
				// ถ้ามีประวัติ ให้เลือกอันล่าสุด (ตัวแรก)
				await selectChat(historyData[0].id);
			}
		} catch (error) {
			console.error("Failed to init page data:", error);
			// ❌ อย่าเรียก initPageData() ใน catch เด็ดขาด เพราะจะทำให้ browser ค้างถ้า error ถาวร
		}
	}, [selectedDocumentId, isSignedIn, selectChat]);

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			void (async () => {
				await initPageData();
			})();
		}
	}, [isLoaded, isSignedIn, initPageData]);
	// --- Handlers UI ---
	const handleSidebarSelect = (page: number) => {
		setSelectedPage(page);
		mainViewerRef.current?.scrollToPage(page);
	};

	const handleMainPageChange = (page: number, total: number) => {
		if (page !== selectedPage) setSelectedPage(page);
		setNumPages(total);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage({ text: input });
		setInput("");
	};

	const handleZoomIn = () => {
		setZoomScale((prev) => Math.min(prev + 0.25, 3.0)); // Max 300%
	};

	const handleZoomOut = () => {
		setZoomScale((prev) => Math.max(prev - 0.25, 0.5)); // Min 50%
	};

	const handleZoomReset = () => {
		setZoomScale(1.0); // Reset to 100%
	};

	const handleCreateQuiz = () => {
		router.push(`/quiz/create/pdf-upload?documentId=${selectedDocumentId}`);
	};

	// --- RENDER ---

	if (!isLoaded) {
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 text-primary animate-spin" />
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<div className="flex items-center justify-center h-full">
				<AuthRequiredCard
					title="Access Restricted"
					description="Please sign in to view this document."
					showBackButton={true}
				/>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-white text-slate-900 font-sans">
			{/* LEFT SIDEBAR */}
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
							key={documentInfo.url}
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

			{/* CENTER VIEWER - ✅ เปลี่ยนจาก flex-1 เป็น width คงที่ */}
			<div
				className="flex flex-col bg-slate-100/50 relative z-10"
				style={{
					width: "calc(100vw - 780px)", // 280px (sidebar) + 500px (chat) = 780px
					minWidth: "400px", // ป้องกันไม่ให้เล็กเกินไป
				}}
			>
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
						<div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1 border border-slate-200">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={handleZoomOut}
								disabled={zoomScale <= 0.5}
								title="Zoom Out"
							>
								<ZoomOut className="w-4 h-4 text-slate-600" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 px-2 min-w-[60px] text-xs font-medium text-slate-600"
								onClick={handleZoomReset}
								title="Reset Zoom"
							>
								{Math.round(zoomScale * 100)}%
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={handleZoomIn}
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
								className="h-7 w-7"
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
							className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
							onClick={handleCreateQuiz}
						>
							Create Quiz
						</Button>
					</div>
				</div>
				{/* ✅ Viewer Container - ต้องมี overflow-hidden เพื่อจำกัดพื้นที่ */}
				<div className="flex-1 overflow-hidden relative">
					{documentInfo ? (
						<PdfMainViewer
							key={documentInfo.url}
							ref={mainViewerRef}
							fileUrl={documentInfo.url}
							selectedPage={selectedPage}
							onPageChange={handleMainPageChange}
							zoomScale={zoomScale}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-slate-400">
							Select a document to view
						</div>
					)}
				</div>
			</div>

			{/* RIGHT: CHAT PANEL */}
			<div className="w-[500px] flex flex-col border-l border-slate-200 bg-white shadow-[-5px_0_20px_-5px_rgba(0,0,0,0.05)] z-30 h-full min-h-0">
				{/* ... rest of chat panel code remains the same ... */}
				<div className="h-16 flex-none flex items-center justify-between px-5 border-b border-slate-200 bg-white">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
							<BrainCircuit className="w-5 h-5" />
						</div>
						<div>
							<h2 className="font-bold text-sm text-slate-800">AI Assistant</h2>
							<p className="text-[10px] text-slate-500">Always ready to help</p>
						</div>
					</div>

					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-slate-400 hover:text-primary"
							onClick={handleNewChat}
							title="New Chat"
						>
							<PlusCircle className="w-5 h-5" />
						</Button>

						<Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-slate-400 hover:text-primary"
									title="Chat History"
								>
									<History className="w-5 h-5" />
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-[320px] sm:w-[360px] pt-10 px-4"
							>
								<SheetHeader>
									<SheetTitle className="flex items-center gap-2 text-slate-800">
										<History className="w-5 h-5" /> Chat History
									</SheetTitle>
								</SheetHeader>
								<div className="mt-6 flex flex-col h-full pb-10">
									<Button
										className="w-full mb-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 shadow-none justify-start"
										onClick={handleNewChat}
									>
										<PlusCircle className="w-4 h-4 mr-2" /> Start New Chat
									</Button>
									<ScrollArea className="flex-1 -mx-6 px-6">
										{chatHistory.length === 0 && (
											<p className="text-center text-slate-400 text-sm mt-10">
												No history yet.
											</p>
										)}
										{chatHistory.map((chat) => (
											<div
												key={chat.id}
												onClick={() => selectChat(chat.id)}
												className={`
                                group flex flex-col p-3 mb-2 rounded-xl cursor-pointer transition-all border
                                ${
																	chatId === chat.id
																		? "bg-indigo-600 text-white border-indigo-600 shadow-md"
																		: "bg-white hover:bg-slate-50 border-slate-100 text-slate-700"
																}
                            `}
											>
												<div className="flex items-start gap-3">
													<MessageSquare
														className={`w-4 h-4 mt-1 shrink-0 ${
															chatId === chat.id
																? "text-indigo-200"
																: "text-slate-400"
														}`}
													/>
													<div className="min-w-0">
														<p
															className={`text-sm font-medium truncate ${
																chatId === chat.id
																	? "text-white"
																	: "text-slate-800 group-hover:text-indigo-600"
															}`}
														>
															{chat.title}
														</p>
														<p
															className={`text-[10px] mt-1 ${
																chatId === chat.id
																	? "text-indigo-200"
																	: "text-slate-400"
															}`}
														>
															{new Date(chat.createdAt).toLocaleDateString()}
														</p>
													</div>
												</div>
											</div>
										))}
									</ScrollArea>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 flex flex-col bg-slate-50/50 overflow-y-auto">
					<ScrollArea className="p-4 flex-1" key={chatId}>
						{messages.length === 0 && (
							<div className="flex flex-col items-center justify-center h-full pt-20 text-slate-400 text-center px-10">
								<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
									<BrainCircuit className="w-6 h-6 text-indigo-300" />
								</div>
								<p className="text-sm">Ask any question about this document.</p>
							</div>
						)}

						{messages.map((m) => (
							<div
								key={m.id}
								className={`mb-5 flex ${
									m.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed overflow-hidden
                    ${
											m.role === "user"
												? "bg-indigo-600 text-white rounded-br-none"
												: "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
										}`}
								>
									<div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 text-inherit wrap-break-words min-w-0">
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
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-slate-200 bg-white flex-none">
					<form onSubmit={handleSubmit} className="relative flex items-center">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask any question..."
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
									className="h-8 px-3 text-red-500 hover:bg-red-50 text-xs"
								>
									Stop
								</Button>
							) : (
								<Button
									type="submit"
									size="sm"
									className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md px-4"
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
