"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Import components จาก Clerk
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
	Home,
	FileText,
	MessageSquareText,
	Mail,
	GraduationCap,
	LogIn, // เพิ่ม Icon
} from "lucide-react";

export default function MainSidebar() {
	const pathname = usePathname();

	const menuItems = [
		{ name: "Home", icon: Home, path: "/" },
		{ name: "PDF Chat", icon: MessageSquareText, path: "/chat" },
		{ name: "My Quizzes", icon: FileText, path: "/quiz" },
	];

	return (
		<aside className="glass-panel w-64 h-full flex flex-col shrink-0 z-50 font-prompt transition-all duration-300">
			{/* Logo Section */}
			<div className="h-20 flex items-center px-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-primary shadow-sm border border-white/50">
						<GraduationCap className="w-6 h-6" />
					</div>
					<span className="text-lg font-bold text-primary tracking-tight">
						SchoolMate
					</span>
				</div>
			</div>

			{/* Menu Section */}
			<div className="flex-1 py-6 px-3 space-y-1">
				<div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
					Menu
				</div>
				{menuItems.map((item) => (
					<Link
						key={item.path}
						href={item.path}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
							item.path === pathname
								? "bg-white shadow-sm text-primary font-semibold ring-1 ring-slate-100"
								: "text-slate-500 hover:bg-white/60 hover:text-slate-800"
						}`}
					>
						<item.icon
							className={`w-5 h-5 transition-colors ${
								item.path === pathname
									? "text-secondary"
									: "text-slate-400 group-hover:text-slate-600"
							}`}
						/>
						<span>{item.name}</span>
					</Link>
				))}
			</div>

			{/* Bottom Section */}
			<div className="p-4 border-t border-white/20">
				<button className="w-full flex items-center gap-3 px-3 py-2 mb-3 text-slate-500 hover:text-primary hover:bg-white/50 rounded-lg transition-colors text-sm font-medium">
					<Mail className="w-4 h-4" />
					<span>Contact Support</span>
				</button>

				{/* --- Clerk Auth Logic --- */}

				{/* กรณี Login แล้ว: แสดง User Profile */}
				<SignedIn>
					<div className="flex items-center gap-3 px-3 py-2 bg-white/40 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
						<UserButton
							appearance={{
								elements: {
									userButtonAvatarBox: "w-8 h-8",
									userButtonTrigger: "focus:shadow-none",
								},
							}}
						/>
						<div className="flex flex-col overflow-hidden">
							<span className="text-xs font-bold text-slate-700 truncate font-inter">
								My Account
							</span>
							<span className="text-[10px] text-slate-400 truncate">
								Manage Plan
							</span>
						</div>
					</div>
				</SignedIn>

				{/* กรณียังไม่ Login: แสดงปุ่ม Sign In */}
				<SignedOut>
					<SignInButton mode="modal">
						<button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary hover:bg-[#2a2696] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm font-bold">
							<LogIn className="w-4 h-4" />
							<span>Sign In</span>
						</button>
					</SignInButton>
				</SignedOut>
			</div>
		</aside>
	);
}
