"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
	FileUp,
	Link as LinkIcon,
	Type,
	Wand2,
	FileCheck,
	X,
	Loader2,
	Upload,
	FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // อย่าลืมลง library นี้ หรือใช้ตัวอื่นตามโปรเจกต์
import { uploadDocument } from "@/lib/actions/actions"; // Import Server Action
import { TWENTY_MB_IN_BYTES } from "@/constants/constant"; // Import Constant

type QuizSourceType = "PDF" | "LINK" | "TEXT";

interface CreateQuizFormProps {
	sourceType: QuizSourceType;
	defaultDocumentId?: string;
}

export const CreateQuizForm = ({
	sourceType,
	defaultDocumentId,
}: CreateQuizFormProps) => {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// --- State ---
	const [isLoading, setIsLoading] = useState(false); // สำหรับตอนกด Generate Quiz
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false); // สำหรับ UI Drag & Drop

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		difficulty: "MEDIUM",
		questionCount: 10,
		specificRequirement: "",
		sourceUrl: "",
		sourceText: "",
		documentId: defaultDocumentId || "",
	});

	if (defaultDocumentId) {
		setFormData((prev) => ({ ...prev, documentId: defaultDocumentId }));
	}

	const handleFileSelect = (file: File) => {
		if (!file || file.type !== "application/pdf") {
			toast.error("Please upload a PDF file.");
			return;
		}
		if (file.size > TWENTY_MB_IN_BYTES) {
			toast.error("File is larger than 20MB.");
			return;
		}

		// เก็บไฟล์ไว้ที่ State ก่อน ยังไม่ส่งไป Server
		setSelectedFile(file);

		// Auto-fill Title จากชื่อไฟล์
		if (!formData.title) {
			setFormData((prev) => ({
				...prev,
				title: file.name.replace(".pdf", ""),
			}));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
	};

	// --- Submit Logic ---
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (sourceType === "PDF" && !formData.documentId && !selectedFile) {
			toast.error("Please select a PDF file.");
			return;
		}
		if (sourceType === "LINK" && !formData.sourceUrl) {
			toast.error("Please enter a URL.");
			return;
		}
		if (sourceType === "TEXT" && !formData.sourceText) {
			toast.error("Please enter some text.");
			return;
		}

		setIsLoading(true);
		try {
			let targetDocumentId = formData.documentId;

			if (sourceType === "PDF" && selectedFile && !targetDocumentId) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", selectedFile);
				const uploadToastId = toast.loading("Uploading document...");
				const result = await uploadDocument(uploadFormData);
				if (!result.success || !result.documentId) {
					toast.dismiss(uploadToastId);
					toast.error(result.message || "Failed to upload file.");
					setIsLoading(false);
					return; // จบการทำงาน
				}
				toast.dismiss(uploadToastId);
				targetDocumentId = result.documentId;
				// Update State เผื่อไว้ (แต่จริงๆ เราจะใช้ targetDocumentId ยิงต่อเลย)
				setFormData((prev) => ({ ...prev, documentId: targetDocumentId }));
			}

			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast.success("Quiz generated successfully!");
		} catch (error) {
			console.error("Error:", error);
			toast.error("Something went wrong.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		setFormData((prev) => ({ ...prev, documentId: "", title: "" }));
		if (fileInputRef.current) fileInputRef.current.value = "";

		// ถ้าเปลี่ยนไฟล์ เราอาจจะลบ Query Param ออกเพื่อให้ URL สะอาด (Optional)
		router.replace("/quiz/create/pdf-upload");
	};

	// --- Render Source Inputs ---
	const renderSourceInput = () => {
		switch (sourceType) {
			case "PDF":
				// 1. กรณีมีไฟล์แล้ว (Selected / Uploaded)
				if (formData.documentId || selectedFile) {
					const fileName = selectedFile
						? selectedFile.name
						: `Document ID: ${formData.documentId?.slice(0, 8)}...`;

					const isExisting = !!formData.documentId && !selectedFile;

					return (
						<div className="flex flex-col items-center justify-center h-full border-2 border-solid border-indigo-200 bg-indigo-50/30 rounded-xl p-10 relative animate-in fade-in zoom-in duration-300">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-red-50"
								onClick={handleRemoveFile}
								title="Remove / Change File"
								disabled={isLoading}
							>
								<X className="w-4 h-4" />
							</Button>

							<div className="w-20 h-20 bg-white shadow-md rounded-full flex items-center justify-center mb-4">
								{/* ถ้าเลือกไฟล์เอง แสดงไอคอนปกติ / ถ้ามาจาก Chat แสดงไอคอน Check */}
								{selectedFile ? (
									<FileText className="w-10 h-10 text-indigo-500" />
								) : (
									<FileCheck className="w-10 h-10 text-green-500" />
								)}
							</div>

							<p className="text-lg font-bold text-slate-700 text-center px-4 line-clamp-2">
								{fileName}
							</p>

							<div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
								<span
									className={`w-2 h-2 rounded-full ${
										isExisting ? "bg-green-500" : "bg-amber-500 animate-pulse"
									}`}
								/>
								<p className="text-xs text-slate-500 font-medium">
									{isExisting ? "Ready in Cloud" : "Ready to Upload"}
								</p>
							</div>

							{!isExisting && (
								<p className="text-[10px] text-slate-400 mt-4 max-w-[200px] text-center">
									File will be uploaded when you click &quot;Generate Quiz&quot;
								</p>
							)}
						</div>
					);
				}

				// กรณี 2: ยังไม่ได้เลือกไฟล์ (แสดง Dropzone)
				return (
					<div
						className={`flex flex-col items-center justify-center h-full rounded-xl border-2 transition-all duration-300 cursor-pointer p-8 text-center group relative overflow-hidden
                            ${
															dragActive
																? "border-indigo-500 bg-indigo-50 scale-[0.99]"
																: "border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100 hover:shadow-md"
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
							if (e.dataTransfer.files[0]) {
								handleFileSelect(e.dataTransfer.files[0]);
							}
						}}
					>
						<div className="flex flex-col items-center py-4 z-10">
							<div
								className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110
                                ${
																	dragActive
																		? "bg-indigo-100 text-indigo-600"
																		: "bg-white shadow-sm text-slate-400 group-hover:text-indigo-500"
																}`}
							>
								{dragActive ? (
									<Upload className="w-8 h-8 animate-bounce" />
								) : (
									<FileUp className="w-8 h-8" />
								)}
							</div>
							<h3 className="text-lg font-bold text-slate-700 mb-2 group-hover:text-indigo-700 transition-colors">
								{dragActive ? "Drop PDF Here" : "Select PDF File"}
							</h3>
							<p className="text-slate-400 mb-6 text-xs max-w-[200px]">
								Drag and drop your PDF here, or click to browse.
							</p>

							<Button
								type="button"
								variant="outline"
								className="border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full px-6 h-8 text-xs"
							>
								Browse File
							</Button>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf"
							className="hidden"
							onChange={handleFileChange}
						/>
					</div>
				);

			case "LINK":
				return (
					<div className="flex flex-col h-full justify-center space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
						<div className="text-center mb-2">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<LinkIcon className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="text-sm font-bold text-slate-700">Insert Link</h3>
						</div>
						<div className="space-y-2">
							<Label>Website URL</Label>
							<Input
								placeholder="https://example.com/article"
								value={formData.sourceUrl}
								onChange={(e) =>
									setFormData({ ...formData, sourceUrl: e.target.value })
								}
							/>
						</div>
						<p className="text-[10px] text-slate-400">
							We will scrape the content...
						</p>
					</div>
				);

			case "TEXT":
				return (
					<div className="flex flex-col h-full p-4 bg-slate-50 rounded-xl border border-slate-200">
						<div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
							<Type className="w-4 h-4" /> Paste Your Text
						</div>
						<Textarea
							className="flex-1 min-h-[200px] resize-none bg-white focus-visible:ring-indigo-500"
							placeholder="Paste your study notes..."
							value={formData.sourceText}
							onChange={(e) =>
								setFormData({ ...formData, sourceText: e.target.value })
							}
						/>
					</div>
				);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full"
		>
			{/* LEFT COLUMN: Source Input */}
			<div className="lg:h-[500px] flex flex-col">
				<Label className="mb-3 block font-bold text-slate-700">
					1. Source Content <span className="text-red-500">*</span>
				</Label>
				<div className="flex-1">{renderSourceInput()}</div>
			</div>

			{/* RIGHT COLUMN: Configuration */}
			<div className="flex flex-col space-y-5">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Quiz Title</Label>
						<Input
							placeholder="e.g. World War II History"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<Label>Description (Optional)</Label>
						<Textarea
							placeholder="Briefly describe what this quiz is about..."
							className="h-20 resize-none"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Difficulty</Label>
							<Select
								defaultValue={formData.difficulty}
								onValueChange={(val) =>
									setFormData({ ...formData, difficulty: val })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="EASY">Easy</SelectItem>
									<SelectItem value="MEDIUM">Medium</SelectItem>
									<SelectItem value="HARD">Hard</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Questions</Label>
							<Input
								type="number"
								min={1}
								max={20}
								value={formData.questionCount}
								onChange={(e) =>
									setFormData({
										...formData,
										questionCount: parseInt(e.target.value),
									})
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Specific Requirements</Label>
						<Textarea
							placeholder="e.g. Focus on dates and key figures, avoid minor details."
							className="h-24 resize-none"
							value={formData.specificRequirement}
							onChange={(e) =>
								setFormData({
									...formData,
									specificRequirement: e.target.value,
								})
							}
						/>
					</div>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<Button
						type="submit"
						className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								{/* เปลี่ยนข้อความตามสถานะ */}
								{selectedFile && !formData.documentId
									? "Uploading & Generating..."
									: "Generating Quiz..."}
							</>
						) : (
							<>
								<Wand2 className="w-5 h-5 mr-2" /> Generate Quiz
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
};
