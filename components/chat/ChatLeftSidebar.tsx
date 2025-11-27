"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PdfSidebar } from "@/components/PdfSidebar";

type ChatLeftSidebarProps = {
	documentInfo: { id: string; name: string; url: string } | null;
	selectedPage: number;
	onSelectPage: (page: number) => void;
};

export const ChatLeftSidebar: React.FC<ChatLeftSidebarProps> = ({
	documentInfo,
	selectedPage,
	onSelectPage,
}) => {
	const router = useRouter();

	return (
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
						onSelect={onSelectPage}
					/>
				) : (
					<div className="flex items-center justify-center h-full text-slate-400">
						<Loader2 className="animate-spin mr-2 w-4 h-4" /> Loading...
					</div>
				)}
			</div>
		</div>
	);
};
