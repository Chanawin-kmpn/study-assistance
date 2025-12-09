"use client"; // ต้องเติม เพราะเราจะใช้ State

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { LogIn, ArrowLeft } from "lucide-react"; // ลบ LockKeyhole ของเดิมออก
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LockIcon from "./icon/LockIcon";

interface AuthRequiredCardProps {
	title?: string;
	description?: string;
	footerText?: string;
	showBackButton?: boolean;
}

export function AuthRequiredCard({
	title = "Authentication Required",
	description = "Please sign in to access this page. It's free and secure.",
	footerText = "Join thousands of students learning smarter with AI.",
	showBackButton = false,
}: AuthRequiredCardProps) {
	// State เพื่อบอกว่ากำลัง Hover ปุ่มอยู่หรือเปล่า
	const [isHoveringButton, setIsHoveringButton] = useState(false);

	return (
		<div className="w-full max-w-xl mx-auto mt-10">
			<Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative">
				<div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
				<div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/3" />

				<CardContent className="p-10 flex flex-col items-center text-center relative z-10">
					{/* --- ส่วนไอคอน --- */}
					<div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
						{/* ส่ง props isHovering ลงไปให้ LockIcon */}
						<LockIcon
							isHovering={isHoveringButton}
							className="w-10 h-10 text-slate-400"
						/>
					</div>

					<h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
					<p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
						{description}
					</p>

					{/* --- ปุ่ม Sign In --- */}
					<SignInButton mode="modal">
						<Button
							// เพิ่ม event handlers
							onMouseEnter={() => setIsHoveringButton(true)}
							onMouseLeave={() => setIsHoveringButton(false)}
							className="h-12 px-8 bg-primary text-white rounded-full font-prompt text-base shadow-lg shadow-primary/90 hover:scale-105 transition-transform"
						>
							<LogIn className="w-5 h-5 mr-2" />
							Sign In to Continue
						</Button>
					</SignInButton>

					{showBackButton && (
						<Link href="/" className="mt-4">
							<Button
								variant="ghost"
								className="text-slate-400 hover:text-slate-600 text-xs"
							>
								<ArrowLeft className="w-3 h-3 mr-1" />
								Back to Home
							</Button>
						</Link>
					)}

					{footerText && (
						<p className="mt-6 text-xs text-slate-400">{footerText}</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
