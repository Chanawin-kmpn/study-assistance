"use client";

import React, { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { BrainCircuit, PlusCircle, History, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { UIMessage } from "ai";

type ChatSession = { id: string; title: string; createdAt: Date };

type ChatRightPanelProps = {
	chatId: string;
	messages: UIMessage[];
	input: string;
	isThinking: boolean;
	error: Error | undefined;
	chatHistory: ChatSession[];
	isHistoryOpen: boolean;
	onInputChange: (value: string) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onStop: () => void;
	onNewChat: () => void;
	onSelectChat: (id: string) => void;
	onHistoryOpenChange: (open: boolean) => void;
};

export const ChatRightPanel: React.FC<ChatRightPanelProps> = ({
	chatId,
	messages,
	input,
	isThinking,
	error,
	chatHistory,
	isHistoryOpen,
	onInputChange,
	onSubmit,
	onStop,
	onNewChat,
	onSelectChat,
	onHistoryOpenChange,
}) => {
	return (
		<div className="w-[500px] flex flex-col border-l border-slate-200 bg-white shadow-[-5px_0_20px_-5px_rgba(0,0,0,0.05)] z-30 h-full min-h-0">
			{/* Header */}
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
			</div>

			{/* Messages Area */}
			<div className="flex-1 flex flex-col bg-slate-50/50 overflow-y-auto">
				<div className="p-4" key={chatId}>
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
								className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed overflow-auto
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
				</div>
			</div>

			{/* Input Area */}
			<div className="p-4 border-t border-slate-200 bg-white flex-none flex flex-col gap-2">
				<div className="flex items-center gap-1 self-end">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-slate-400 hover:text-primary"
						onClick={onNewChat}
						title="New Chat"
					>
						<PlusCircle className="w-5 h-5" />
					</Button>

					<Sheet open={isHistoryOpen} onOpenChange={onHistoryOpenChange}>
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
									onClick={onNewChat}
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
											onClick={() => onSelectChat(chat.id)}
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

				<form onSubmit={onSubmit} className="relative flex items-center">
					<Input
						value={input}
						onChange={(e) => onInputChange(e.target.value)}
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
								onClick={onStop}
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
	);
};
