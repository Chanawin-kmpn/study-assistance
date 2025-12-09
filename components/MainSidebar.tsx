"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
	Home,
	FileText,
	MessageSquareText,
	LogIn,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function MainSidebar() {
	const pathname = usePathname();
	// ✅ State ควบคุมการย่อ/ขยาย
	const [isCollapsed, setIsCollapsed] = useState(false);

	const menuItems = [
		{ name: "Home", icon: Home, path: "/" },
		{ name: "PDF Chat", icon: MessageSquareText, path: "/chat" },
		{ name: "My Quizzes", icon: FileText, path: "/quiz" },
	];

	return (
		<aside
			className={`glass-panel h-full flex flex-col shrink-0 z-50 font-prompt transition-all duration-300 relative
            ${isCollapsed ? "w-20" : "w-64"} 
        `}
		>
			{/* ✅ Toggle Button */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="absolute -right-3 top-12 bg-white border border-slate-200 text-slate-500 rounded-full p-1 shadow-md hover:text-primary transition-colors z-50 cursor-pointer"
			>
				{isCollapsed ? (
					<ChevronRight className="w-4 h-4" />
				) : (
					<ChevronLeft className="w-4 h-4" />
				)}
			</button>

			{/* Logo Section */}
			<div
				className={`h-20 flex items-center ${
					isCollapsed ? "justify-center" : "px-6"
				} transition-all`}
			>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-primary shadow-sm border border-white/50 shrink-0">
						<Image src="/images/logo.png" width={24} height={24} alt="Logo" />
					</div>
					{/* ซ่อนชื่อเมื่อย่อ */}
					<span
						className={`text-lg font-bold text-primary tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300
                        ${isCollapsed ? "hidden" : "block"}
                    `}
					>
						SchoolMate
					</span>
				</div>
			</div>

			{/* Menu Section */}
			<div className="flex-1 py-6 px-3 space-y-1">
				<div
					className={`px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden
                    ${isCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto"}
                `}
				>
					Menu
				</div>
				{menuItems.map((item) => (
					<Link
						key={item.path}
						href={item.path}
						className={`flex items-center  gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                        ${
													item.path === pathname
														? "bg-white shadow-sm text-primary font-semibold ring-1 ring-slate-100"
														: "text-slate-500 hover:bg-white/60 hover:text-primary"
												}
                        ${isCollapsed ? "justify-center" : ""}
                    `}
					>
						<item.icon
							className={`w-5 h-5 shrink-0 transition-colors ${
								item.path === pathname
									? "text-secondary"
									: "text-slate-400 group-hover:text-slate-600"
							}`}
						/>

						{/* ซ่อน Text เมื่อย่อ */}
						<span
							className={`whitespace-nowrap overflow-hidden transition-all duration-300
                            ${isCollapsed ? "hidden" : "block"}
                        `}
						>
							{item.name}
						</span>

						{/* (Optional) Tooltip เมื่อย่อ sidebar เอาเมาส์ชี้แล้วจะเห็นชื่อเมนู */}
						{isCollapsed && (
							<div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
								{item.name}
							</div>
						)}
					</Link>
				))}
			</div>

			{/* Bottom Section */}
			<div className="p-4 border-t border-white/20">
				{/* --- Clerk Auth Logic --- */}

				{/* กรณี Login แล้ว */}
				<SignedIn>
					<div
						className={`flex items-center gap-3 px-3 py-2 bg-white/40 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm transition-all
                        ${
													isCollapsed
														? "justify-center bg-transparent border-0 shadow-none px-0"
														: ""
												}
                    `}
					>
						<UserButton
							appearance={{
								elements: {
									userButtonAvatarBox: "w-8 h-8",
									userButtonTrigger: "focus:shadow-none",
								},
							}}
						/>
						<div
							className={`flex flex-col overflow-hidden transition-all duration-300
                            ${
															isCollapsed
																? "w-0 opacity-0 hidden"
																: "w-auto opacity-100"
														}
                        `}
						>
							<span className="text-xs font-bold text-slate-700 truncate font-inter">
								My Account
							</span>
							<span className="text-[10px] text-slate-400 truncate">
								Manage Plan
							</span>
						</div>
					</div>
				</SignedIn>

				{/* กรณียังไม่ Login */}
				<SignedOut>
					<SignInButton mode="modal">
						<button
							className={`w-full flex items-center gap-2 bg-primary hover:bg-[#2a2696] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-bold
                            ${
															isCollapsed
																? "justify-center p-3 rounded-full aspect-square"
																: "justify-center px-3 py-2.5 text-sm"
														}
                        `}
						>
							<LogIn className="w-4 h-4 shrink-0" />
							<span
								className={`whitespace-nowrap overflow-hidden transition-all duration-300
                                ${
																	isCollapsed
																		? "w-0 opacity-0 hidden"
																		: "w-auto opacity-100"
																}
                            `}
							>
								Sign In
							</span>
						</button>
					</SignInButton>
				</SignedOut>
			</div>
		</aside>
	);
}
