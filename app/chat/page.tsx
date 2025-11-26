"use client";

import React, {
	useState,
	useRef,
	ChangeEvent,
	useEffect,
	useCallback,
} from "react";
import { useRouter } from "next/navigation";
// Import Clerk hooks
import { useUser } from "@clerk/nextjs";
import { uploadDocument } from "@/lib/actions/actions";
import { Upload, Loader2, FileText, Search, Trash2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthRequiredCard } from "@/components/AuthRequireCard";

type DocumentItem = {
	id: string;
	name: string;
	url: string;
	createdAt: string;
	pageCount?: number | null;
};

export default function DefaultChatPage() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useUser(); // Clerk Auth State
	const fileInputRef = useRef<HTMLInputElement>(null);

	// --- State ---
	const [documents, setDocuments] = useState<DocumentItem[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [dragActive, setDragActive] = useState(false);
	const [isLoadingDocs, setIsLoadingDocs] = useState(true);

	// --- Fetch Documents (เรียกเฉพาะตอน Login แล้ว) ---
	const fetchDocuments = useCallback(async () => {
		if (!isSignedIn) return; // ถ้าไม่ login ไม่ต้อง fetch

		try {
			setIsLoadingDocs(true);
			const res = await fetch("/api/documents");
			if (!res.ok) return;
			const data: DocumentItem[] = await res.json();
			setDocuments(data);
		} catch (err) {
			console.error("Failed to fetch documents", err);
		} finally {
			setIsLoadingDocs(false);
		}
	}, [isSignedIn]);

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			fetchDocuments();
		} else if (isLoaded && !isSignedIn) {
			setIsLoadingDocs(false); // เลิกโหลดถ้าเช็คแล้วว่าไม่ได้ login
		}
	}, [isLoaded, isSignedIn, fetchDocuments]);

	// --- Filter Logic ---
	const filteredDocuments = documents.filter((doc) =>
		doc.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// --- Actions ---
	const handleUploadProcess = async (file: File) => {
		if (!file || file.type !== "application/pdf") return;
		setIsUploading(true);
		setUploadStatus("");
		try {
			const formData = new FormData();
			formData.append("file", file);
			const result = await uploadDocument(formData);
			if (result.documentId) {
				await fetchDocuments();
				setUploadStatus("Upload Complete!");
			}
		} catch (err) {
			console.error("Failed to upload document", err);
			setUploadStatus("Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) handleUploadProcess(e.target.files[0]);
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Delete "${name}"?`)) return;
		try {
			await fetch(`/api/documents/${id}`, { method: "DELETE" });
			setDocuments((prev) => prev.filter((d) => d.id !== id));
		} catch (err) {
			console.error("Failed to delete", err);
		}
	};

	// --- Render Loading State (ตอนกำลังเช็ค User) ---
	if (!isLoaded) {
		return (
			<div className="h-full flex items-center justify-center bg-slate-50">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-slate-50 relative overflow-y-auto font-prompt">
			{/* --- Header --- */}
			<header className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-slate-50 z-20">
				<div>
					<h1 className="text-2xl font-bold text-primary">PDF Chat Space</h1>
					<p className="text-slate-500 text-sm">
						Manage your study materials and start learning.
					</p>
				</div>
			</header>

			<div className="flex-1 flex flex-col items-center p-6 pb-20 max-w-6xl mx-auto w-full">
				{/* --- CONTENT SWITCHING LOGIC --- */}
				{isSignedIn ? (
					/* ================= LOGGED IN STATE ================= */
					<>
						{/* 1. Upload Area */}
						<div
							className={`w-full max-w-2xl bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 cursor-pointer p-8 text-center group mb-12
                        ${
													dragActive
														? "border-secondary bg-orange-50 scale-[1.02]"
														: "border-dashed border-slate-200 hover:border-primary/30 hover:shadow-xl"
												}
                    `}
							onClick={() => fileInputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setDragActive(true);
							}}
							onDragLeave={() => setDragActive(false)}
							onDrop={(e) => {
								e.preventDefault();
								setDragActive(false);
								if (e.dataTransfer.files[0])
									handleUploadProcess(e.dataTransfer.files[0]);
							}}
						>
							{isUploading ? (
								<div className="flex flex-col items-center py-4">
									<Loader2 className="w-10 h-10 text-secondary animate-spin mb-3" />
									<h3 className="text-base font-bold text-primary">
										Uploading & Processing...
									</h3>
									<p className="text-slate-400 text-xs">
										Please wait while AI analyzes your document.
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center py-4">
									<div
										className={`w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
											dragActive
												? "bg-secondary/10 text-secondary"
												: "text-primary"
										}`}
									>
										<Upload className="w-8 h-8" />
									</div>
									<h3 className="text-xl font-bold text-primary mb-1">
										Drop PDF here to Upload
									</h3>
									<p className="text-slate-400 mb-6 text-sm">
										or click to browse (Lecture, Book, Slide)
									</p>

									<Button
										variant="outline"
										className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6 h-9 text-xs"
									>
										Browse File
									</Button>
									{uploadStatus && (
										<p className="mt-3 text-xs font-medium text-emerald-600">
											{uploadStatus}
										</p>
									)}
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>

						{/* 2. Document List */}
						<div className="w-full">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-bold text-primary flex items-center gap-2">
									<FileText className="w-5 h-5" />
									My Documents ({filteredDocuments.length})
								</h2>
								{/* Search Bar (แสดงเฉพาะตอน Login แล้ว) */}
								{isSignedIn && (
									<div className="relative w-full md:w-auto">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
										<Input
											placeholder="Search documents..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="pl-9 w-full md:w-72 rounded-full border-slate-200 bg-white focus-visible:ring-secondary"
										/>
									</div>
								)}
							</div>

							{isLoadingDocs ? (
								<div className="flex justify-center py-12">
									<Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
								</div>
							) : filteredDocuments.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{filteredDocuments.map((doc) => (
										<Card
											key={doc.id}
											className="group hover:shadow-md hover:border-secondary/50 transition-all border-slate-200 bg-white cursor-pointer"
											onClick={() => router.push(`/chat/${doc.id}`)}
										>
											<CardContent className="p-4">
												<div className="flex justify-between items-start mb-3">
													<div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
														<FileText className="w-5 h-5" />
													</div>

													<Button
														variant="ghost"
														className="h-8 w-8 text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50"
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(doc.id, doc.name);
														}}
													>
														<Trash2 className="w-4 h-4 " />
													</Button>
												</div>

												<h3 className="font-semibold text-slate-700 text-sm line-clamp-2 mb-2 h-10 group-hover:text-primary">
													{doc.name}
												</h3>

												<div className="flex items-center text-[10px] text-slate-400 gap-1">
													<Clock className="w-3 h-3" />
													<span>
														{new Date(doc.createdAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															}
														)}
													</span>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								/* Empty State (Logged In but no files) */
								<div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
									<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
										<Search className="w-6 h-6 text-slate-400" />
									</div>
									<h3 className="text-slate-600 font-medium">
										No documents found
									</h3>
									<p className="text-slate-400 text-sm">
										Upload a PDF above to get started.
									</p>
								</div>
							)}
						</div>
					</>
				) : (
					/* ================= GUEST STATE (NOT LOGGED IN) ================= */
					<div className="flex items-center justify-center h-full">
						<AuthRequiredCard
							title="Authentication Required"
							description="Please sign in to upload documents and access your personal library. It's free and secure."
							footerText="Join thousands of students learning smarter with AI."
							// showBackButton={false} // ไม่ต้องใส่เพราะ default คือ false
						/>
					</div>
				)}
			</div>
		</div>
	);
}
