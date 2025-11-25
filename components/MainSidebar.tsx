// components/MainSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
	Home,
	FileText,
	MessageSquareText,
	Mail,
	GraduationCap,
} from "lucide-react";

export default function MainSidebar() {
	const pathname = usePathname();

	// Helper เช็คว่าเมนูไหน Active

	const menuItems = [
		{ name: "Home", icon: Home, path: "/" },
		{ name: "Quiz", icon: FileText, path: "/quiz" }, // สมมติเส้นทาง
		{ name: "PDF Chat", icon: MessageSquareText, path: "/chat" },
	];

	return (
		<aside className="w-64 h-full bg-primary text-white flex flex-col shrink-0 shadow-xl z-50 ">
			{/* Logo Section */}
			<div className="h-20 flex items-center px-6 border-b border-[#1e1b85]">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
						<GraduationCap className="w-6 h-6" />
					</div>
					<span className="text-xl font-bold tracking-wide">SchoolMate</span>
				</div>
			</div>

			{/* Menu Section */}
			<div className="flex-1 py-8 px-4 space-y-3">
				{menuItems.map((item) => (
					<Link
						key={item.path}
						href={item.path}
						className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
							item.path === pathname
								? "bg-secondary text-white shadow-md font-semibold"
								: "text-slate-300 hover:bg-[#1e1b85] hover:text-white"
						}`}
					>
						<item.icon
							className={`w-5 h-5 ${
								item.path === pathname
									? "text-white"
									: "text-slate-400 group-hover:text-white"
							}`}
						/>
						<span>{item.name}</span>
					</Link>
				))}
			</div>

			{/* Bottom Section */}
			<div className="p-4 border-t border-[#1e1b85]">
				{/* Contact / Email Mock */}
				<button className="w-full flex items-center gap-4 px-4 py-3 mb-4 text-slate-400 hover:text-white hover:bg-[#1e1b85] rounded-xl transition-colors">
					<div className="w-8 h-8 rounded-full border border-slate-500 flex items-center justify-center">
						<Mail className="w-4 h-4" />
					</div>
					<span className="text-sm ">Contact Support</span>
				</button>

				{/* Clerk User Button */}
				<div className="flex items-center gap-3 px-4 py-2 bg-[#0b0945] rounded-xl border border-[#1e1b85]">
					<UserButton
						appearance={{
							elements: {
								userButtonAvatarBox: "w-8 h-8",
								userButtonTrigger: "focus:shadow-none",
							},
						}}
					/>
					<div className="flex flex-col">
						<span className="text-xs text-slate-300 font-inter">Account</span>
						<span className="text-[10px] text-slate-500 ">Manage Profile</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
