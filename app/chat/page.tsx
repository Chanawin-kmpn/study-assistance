"use client";

import React, {
	useState,
	useRef,
	ChangeEvent,
	useEffect,
	useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { uploadDocument } from "@/lib/actions/actions";
import { Upload, Loader2, FileText, Search, Trash2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthRequiredCard } from "@/components/AuthRequireCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TWENTY_MB_IN_BYPTES } from "@/constants/constant";
import { toast } from "sonner";

type DocumentItem = {
	id: string;
	name: string;
	url: string;
	createdAt: string;
	pageCount?: number | null;
};

export default function DefaultChatPage() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useUser();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// --- State ---
	const [documents, setDocuments] = useState<DocumentItem[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [isLoadingDocs, setIsLoadingDocs] = useState(true);

	// ✅ State สำหรับ tracking การลบ
	const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

	// ✅ Dialog State
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		documentId: string | null;
		documentName: string | null;
	}>({
		open: false,
		documentId: null,
		documentName: null,
	});

	// --- Fetch Documents ---
	const fetchDocuments = useCallback(async () => {
		if (!isSignedIn) return;

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
			setIsLoadingDocs(false);
		}
	}, [isLoaded, isSignedIn, fetchDocuments]);

	// --- Filter Logic ---
	const filteredDocuments = documents.filter((doc) =>
		doc.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// --- Actions ---
	const handleUploadProcess = async (file: File) => {
		if (!file || file.type !== "application/pdf") return;
		if (file.size > TWENTY_MB_IN_BYPTES) {
			toast.error("File is larger than 20MB.");
			return;
		}
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const result = await uploadDocument(formData);
			if (result.documentId) {
				await fetchDocuments();
				toast.success("Upload Complete!");
			}
		} catch (err) {
			console.error("Failed to upload document", err);
			toast.error("Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) handleUploadProcess(e.target.files[0]);
	};

	// ✅ เปิด Dialog แทน confirm
	const handleDeleteClick = (id: string, name: string) => {
		setDeleteDialog({
			open: true,
			documentId: id,
			documentName: name,
		});
	};

	// ✅ Confirm Delete พร้อม Loading State
	const handleConfirmDelete = async () => {
		if (!deleteDialog.documentId) return;

		const documentId = deleteDialog.documentId;

		// ✅ เริ่มแสดง loading
		setIsDeletingId(documentId);

		try {
			const res = await fetch(`/api/documents/${documentId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				setDocuments((prev) => prev.filter((d) => d.id !== documentId));
				toast.success("Document deleted successfully");

				// ปิด dialog หลังลบสำเร็จ
				setDeleteDialog({ open: false, documentId: null, documentName: null });
			} else {
				toast.error("Failed to delete document");
			}
		} catch (err) {
			console.error("Failed to delete", err);
			toast.error("An error occurred while deleting");
		} finally {
			// ✅ หยุด loading
			setIsDeletingId(null);
		}
	};

	// --- Render Loading State ---
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
				{isSignedIn ? (
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
									{filteredDocuments.map((doc) => {
										const isDeleting = isDeletingId === doc.id;

										return (
											<Card
												key={doc.id}
												className={`group hover:shadow-md hover:border-secondary/50 transition-all border-slate-200 bg-white cursor-pointer relative ${
													isDeleting ? "opacity-60 pointer-events-none" : ""
												}`}
												onClick={() =>
													!isDeleting && router.push(`/chat/${doc.id}`)
												}
											>
												{/* ✅ Loading Overlay ขณะลบ */}
												{isDeleting && (
													<div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
														<div className="flex flex-col items-center gap-2">
															<Loader2 className="w-6 h-6 text-red-500 animate-spin" />
															<span className="text-xs text-red-600 font-medium">
																Deleting...
															</span>
														</div>
													</div>
												)}

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
																handleDeleteClick(doc.id, doc.name);
															}}
															disabled={isDeleting}
														>
															<Trash2 className="w-4 h-4" />
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
										);
									})}
								</div>
							) : (
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
					<div className="flex items-center justify-center h-full">
						<AuthRequiredCard
							title="Authentication Required"
							description="Please sign in to upload documents and access your personal library. It's free and secure."
							footerText="Join thousands of students learning smarter with AI."
						/>
					</div>
				)}
			</div>

			{/* ✅ Confirm Dialog พร้อม Loading State */}
			<ConfirmDialog
				open={deleteDialog.open}
				onOpenChange={(open) => {
					// ป้องกันการปิด dialog ขณะกำลังลบ
					if (!isDeletingId) {
						setDeleteDialog({ open, documentId: null, documentName: null });
					}
				}}
				title="Delete Document"
				description={
					isDeletingId ? (
						<div className="flex items-center gap-2 text-slate-600">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Deleting document, please wait...</span>
						</div>
					) : (
						`Are you sure you want to delete "${deleteDialog.documentName}"? This action cannot be undone.`
					)
				}
				cancelLabel="Cancel"
				actionLabel={isDeletingId ? "Deleting..." : "Delete"}
				onAction={handleConfirmDelete}
				variant="destructive"
				// ✅ Disable ปุ่มทั้งหมดขณะกำลังลบ
				disabled={!!isDeletingId}
			/>
		</div>
	);
}
