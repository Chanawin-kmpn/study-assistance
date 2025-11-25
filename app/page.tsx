// app/home/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Upload,
	Link as LinkIcon,
	Type,
	CheckCircle2,
	Star,
} from "lucide-react";

export default function HomePage() {
	return (
		<div className="min-h-full bg-white">
			{/* --- Hero Section --- */}
			<section className="relative pt-16 pb-24 overflow-hidden">
				<div className="container mx-auto px-6 md:px-12 relative z-10">
					<div className="flex flex-col lg:flex-row items-center gap-12">
						{/* Text Content */}
						<div className="lg:w-1/2 space-y-8">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-[#100e5e]/10 text-[#100e5e] text-sm font-medium ">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
								</span>
								AI-Powered Learning Platform
							</div>

							<h1 className="text-4xl md:text-6xl font-bold text-[#100e5e]  leading-tight">
								Smart Learning <br />
								<span className="text-[#f97607]">Deeper & More Amazing</span>
							</h1>

							<p className="text-slate-600 text-lg  leading-relaxed max-w-xl">
								SchoolMate คือผู้ช่วยอัจฉริยะที่จะเปลี่ยนเอกสารการเรียนของคุณ
								ให้กลายเป็นบทเรียนที่เข้าใจง่าย เราช่วยคุณ{" "}
								<strong className="text-[#100e5e]">
									สรุปเนื้อหา (Summary)
								</strong>
								,<strong className="text-[#100e5e]"> ตอบคำถาม (Q&A)</strong> และ
								<strong className="text-[#100e5e]">
									{" "}
									สร้างแบบฝึกหัด (Generate Quiz)
								</strong>{" "}
								ได้ในพริบตา
							</p>

							<div className="flex flex-wrap gap-4">
								<Link href="/chat">
									<Button className="h-12 px-8 bg-secondary hover:bg-[#d86606] text-white rounded-full  text-base shadow-lg shadow-orange-500/20 transition-transform hover:scale-105">
										Start Learning Now <ArrowRight className="ml-2 w-5 h-5" />
									</Button>
								</Link>

								<Button
									variant="outline"
									className="h-12 px-8 border-[#100e5e] text-[#100e5e] hover:bg-primary/5 rounded-full  text-base"
								>
									How it works
								</Button>
							</div>

							<div className="flex items-center gap-4 pt-4 font-inter text-sm text-slate-500">
								<div className="flex -space-x-2">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
										/>
									))}
								</div>
								<div>
									<div className="flex text-[#f97607]">
										{[1, 2, 3, 4, 5].map((i) => (
											<Star key={i} className="w-3 h-3 fill-current" />
										))}
									</div>
									<span className="font-semibold text-[#100e5e]">
										1,200+ Reviews
									</span>{" "}
									(48% Happy Students)
								</div>
							</div>
						</div>

						{/* Hero Image / Visual (Placeholder for "Boy holding book") */}
						<div className="lg:w-1/2 relative">
							<div className="relative z-10 bg-linear-to-br from-[#100e5e] to-[#2a2696] rounded-3xl p-1 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
								<div className="bg-white rounded-[20px] overflow-hidden aspect-[4/3] relative flex items-center justify-center group">
									{/* Mockup Image Representation */}
									<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-90 group-hover:scale-105  transition-transform duration-700"></div>
									<div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl max-w-[200px]">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-3 h-3 rounded-full bg-secondary"></div>
											<span className="text-xs font-bold  text-[#100e5e]">
												Quiz Generated!
											</span>
										</div>
										<div className="space-y-2">
											<div className="h-2 bg-slate-200 rounded w-full"></div>
											<div className="h-2 bg-slate-200 rounded w-3/4"></div>
										</div>
									</div>
								</div>
							</div>
							{/* Decorative Circles */}
							<div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
							<div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Features Section --- */}
			<section className="py-20 bg-slate-50">
				<div className="container mx-auto px-6">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl font-bold  text-[#100e5e] mb-4">
							We Share Knowledge With World
						</h2>
						<p className=" text-slate-600">
							หัวใจหลักของ SchoolMate คือการใช้ AI Generate Quiz และ Summary
							จากข้อมูลของคุณเอง โดยข้อมูลแต่ละ User จะถูกเก็บแยกกันเป็นส่วนตัว
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Feature 1: Upload PDF */}
						<div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
							<div className="w-14 h-14 bg-primary/10 text-[#100e5e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
								<Upload className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold  text-[#100e5e] mb-3">
								Upload PDF
							</h3>
							<p className="text-slate-500  text-sm leading-relaxed">
								อัปโหลดไฟล์ PDF โดยตรงเพื่อให้ AI อ่าน สรุปเนื้อหา และสร้าง Quiz
								จากเอกสารการเรียนของคุณ
							</p>
						</div>

						{/* Feature 2: Insert Link */}
						<div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
							<div className="w-14 h-14 bg-secondary/10 text-[#f97607] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
								<LinkIcon className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold  text-[#100e5e] mb-3">
								Insert Link
							</h3>
							<p className="text-slate-500  text-sm leading-relaxed">
								แปะลิงก์บทความหรือเว็บไซต์ที่ต้องการ เพื่อให้ระบบ Scrap
								เนื้อหาออกมาสร้างเป็นแบบฝึกหัดให้อัตโนมัติ
							</p>
						</div>

						{/* Feature 3: Input Text */}
						<div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
							<div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
								<Type className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold  text-[#100e5e] mb-3">
								Custom Text
							</h3>
							<p className="text-slate-500  text-sm leading-relaxed">
								ป้อนหัวข้อหรือเนื้อหาข้อความที่คุณต้องการลงไปโดยตรง เพื่อสร้าง
								Quiz แบบรวดเร็วทันใจ
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* --- Future Features (Day Stack) --- */}
			<section className="py-16 bg-primary text-white overflow-hidden relative">
				<div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
				<div className="container mx-auto px-6 text-center relative z-10">
					<span className="text-[#f97607] font-bold  tracking-wider uppercase text-sm mb-2 block">
						Coming Soon
					</span>
					<h2 className="text-3xl md:text-4xl font-bold  mb-8">
						Future Features: Day Stack
					</h2>
					<div className="flex flex-col md:flex-row justify-center gap-6 text-left max-w-4xl mx-auto">
						<div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
							<CheckCircle2 className="w-6 h-6 text-[#f97607] shrink-0 mt-1" />
							<div>
								<h4 className="font-bold  text-lg mb-1">
									Personalized Progress
								</h4>
								<p className="text-slate-300  text-sm">
									ติดตามความก้าวหน้าในการเรียนรู้ของคุณในแต่ละวัน
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
							<CheckCircle2 className="w-6 h-6 text-[#f97607] shrink-0 mt-1" />
							<div>
								<h4 className="font-bold  text-lg mb-1">Gamification</h4>
								<p className="text-slate-300  text-sm">
									เปลี่ยนการติวให้เป็นเกม สนุกกับการเก็บแต้มและเลื่อนระดับ
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
