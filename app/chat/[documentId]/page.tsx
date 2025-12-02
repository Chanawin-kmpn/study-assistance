"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	FormEvent,
	useRef,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { nanoid } from "nanoid";
import { Loader2 } from "lucide-react";
import axios from "axios"; // ✅ Import axios

import { AuthRequiredCard } from "@/components/AuthRequireCard";
import {
	getChatMessages,
	getChatsByDocument,
} from "@/lib/actions/chat.actions";
import type { PdfMainViewerHandle } from "@/components/PdfMainViewer";

// Import new components
import { ChatLeftSidebar } from "@/components/chat/ChatLeftSidebar";
import { ChatPdfViewer } from "@/components/chat/ChatPdfViewer";
import { ChatRightPanel } from "@/components/chat/ChatRightPanel";
import { ChatMode, ChatSession, DocumentItem } from "@/types/types.global";

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
	const [chatMode, setChatMode] = useState<ChatMode>("summary");
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [numPages, setNumPages] = useState<number>(0);
	const [selectedPage, setSelectedPage] = useState<number>(1);
	const [input, setInput] = useState("");
	const [zoomScale, setZoomScale] = useState<number>(1.0);

	// Setup useChat
	const { messages, setMessages, status, sendMessage, error, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			body: { documentId: selectedDocumentId, chatId, mode: chatMode },
		}),
		id: chatId,
		messages: [],
		onFinish: () => {
			void refreshHistory();
		},
	});

	const isThinking = status === "submitted" || status === "streaming";

	// Logic
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

	const handleNewChat = () => {
		const newId = nanoid();
		setChatId(newId);
		setMessages([]);
		setIsHistoryOpen(false);
	};

	const refreshHistory = async () => {
		if (!selectedDocumentId) return;
		try {
			const history = await getChatsByDocument(selectedDocumentId);
			setChatHistory(history);
		} catch (e) {
			console.error("Failed to refresh history", e);
		}
	};

	const initPageData = useCallback(async () => {
		if (!selectedDocumentId || !isSignedIn) return;

		try {
			const [docRes, historyData] = await Promise.all([
				axios
					.get<DocumentItem[]>("/api/documents")
					.then((res) => res.data)
					.catch(() => []),
				getChatsByDocument(selectedDocumentId),
			]);

			const foundDoc = (docRes as DocumentItem[]).find(
				(d) => d.id === selectedDocumentId
			);
			if (foundDoc) setDocumentInfo(foundDoc);

			setChatHistory(historyData);

			if (historyData.length > 0) {
				await selectChat(historyData[0].id);
			}
		} catch (error) {
			console.error("Failed to init page data:", error);
		}
	}, [selectedDocumentId, isSignedIn, selectChat]);

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			void (async () => {
				await initPageData();
			})();
		}
	}, [isLoaded, isSignedIn, initPageData]);

	// Handlers
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
		sendMessage(
			{ text: input },
			{
				body: {
					documentId: selectedDocumentId,
					chatId,
					mode: chatMode,
				},
			}
		);
		setInput("");
	};

	const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3.0));
	const handleZoomOut = () =>
		setZoomScale((prev) => Math.max(prev - 0.25, 0.5));
	const handleZoomReset = () => setZoomScale(1.0);

	const handleCreateQuiz = () => {
		router.push(`/quiz/create/pdf-upload?documentId=${selectedDocumentId}`);
	};

	// Render
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
			<ChatLeftSidebar
				documentInfo={documentInfo}
				selectedPage={selectedPage}
				onSelectPage={handleSidebarSelect}
			/>

			<ChatPdfViewer
				ref={mainViewerRef}
				documentInfo={documentInfo}
				selectedPage={selectedPage}
				numPages={numPages}
				zoomScale={zoomScale}
				onPageChange={handleMainPageChange}
				onSelectPage={handleSidebarSelect}
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onZoomReset={handleZoomReset}
				onCreateQuiz={handleCreateQuiz}
			/>

			<ChatRightPanel
				chatId={chatId}
				documentId={selectedDocumentId}
				messages={messages}
				input={input}
				isThinking={isThinking}
				error={error}
				chatHistory={chatHistory}
				chatMode={chatMode}
				setChatMode={setChatMode}
				isHistoryOpen={isHistoryOpen}
				onInputChange={setInput}
				onSubmit={handleSubmit}
				onStop={stop}
				onNewChat={handleNewChat}
				onSelectChat={selectChat}
				onHistoryOpenChange={setIsHistoryOpen}
			/>
		</div>
	);
};

export default ChatPage;
