"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { uploadDocument } from "@/lib/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, BrainCircuit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DefaultChatTransport } from "ai";

const Page = () => {
	// ใช้ useChat แบบในวิดีโอ
	const { messages, status, sendMessage, error, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});

	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState("");
	const [input, setInput] = useState("");

	const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsUploading(true);
		const formData = new FormData(e.currentTarget);

		const result = await uploadDocument(formData);
		setUploadStatus(result.message);
		setIsUploading(false);
	};

	// ✅ เพิ่ม handleSubmit ตามที่สอนในวิดีโอ
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) return;

		sendMessage({ text: input });
		setInput("");
	};

	const isThinking = status === "submitted" || status === "streaming";

	return (
		<div className="flex h-screen bg-slate-50 p-4 gap-4">
			{/* Sidebar: Upload & Settings */}
			<div className="w-1/4 flex flex-col gap-4">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Upload className="w-5 h-5" /> Documents
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleFileUpload} className="space-y-4">
							<Input type="file" name="file" accept=".pdf" required />
							<Button type="submit" className="w-full" disabled={isUploading}>
								{isUploading ? (
									<>
										<Loader2 className="animate-spin mr-2" />
										Uploading...
									</>
								) : (
									"Upload PDF"
								)}
							</Button>
							{uploadStatus && (
								<p className="text-sm text-muted-foreground">{uploadStatus}</p>
							)}
						</form>
					</CardContent>
				</Card>

				<Card className="flex-1 bg-blue-50 border-blue-200">
					<CardContent className="pt-6">
						<h3 className="font-bold text-blue-800 mb-2">
							Skooldio Assistant Tips
						</h3>
						<ul className="text-sm text-blue-700 list-disc pl-4 space-y-2">
							<li>Upload PDF course materials first.</li>
							<li>
								Ask specific questions like &qout;What is React Hook?&qout;
							</li>
							<li>
								Type &qout;Generate Quiz&qout; to test yourself (Future
								Feature).
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Main Chat Area */}
			<Card className="flex-1 flex flex-col h-full">
				<CardHeader className="border-b">
					<CardTitle className="flex items-center gap-2">
						<BrainCircuit className="w-6 h-6 text-indigo-600" />
						AI Tutor (Powered by Gemini & GPT-4o)
					</CardTitle>
				</CardHeader>

				<CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
					{/* แสดง error จาก useChat ถ้ามี */}
					{error && (
						<div className="text-red-500 text-sm p-3 border-b bg-red-50">
							{error.message}
						</div>
					)}

					<ScrollArea className="flex-1 p-4">
						{messages.map((m) => (
							<div
								key={m.id}
								className={`mb-4 flex ${
									m.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-lg p-3 ${
										m.role === "user"
											? "bg-indigo-600 text-white"
											: "bg-slate-100 text-slate-800"
									}`}
								>
									<p className="text-sm font-semibold mb-1 opacity-70">
										{m.role === "user" ? "You" : "AI Tutor"}
									</p>

									{/* ✅ ใช้ parts ตามโครงสร้าง UIMessage จากวิดีโอ */}
									{m.parts?.map((part, index) => {
										if (part.type === "text") {
											return (
												<div
													key={`${m.id}-${index}`}
													className="whitespace-pre-wrap"
												>
													{part.text}
												</div>
											);
										}
										return null;
									})}
								</div>
							</div>
						))}

						{isThinking && (
							<div className="text-slate-400 text-sm p-4">
								AI is thinking...
							</div>
						)}
					</ScrollArea>

					<div className="p-4 border-t bg-white">
						<form onSubmit={handleSubmit} className="flex gap-2">
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Ask about your lessons..."
								className="flex-1"
							/>

							{/* ปุ่มเปลี่ยนเป็น Stop ตอนกำลังคิด ตามแนววิดีโอ */}
							{isThinking ? (
								<Button type="button" variant="outline" onClick={() => stop()}>
									Stop
								</Button>
							) : (
								<Button type="submit" disabled={status !== "ready"}>
									Send
								</Button>
							)}
						</form>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Page;
