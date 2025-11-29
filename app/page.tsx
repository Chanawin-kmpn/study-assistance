// app/home/page.tsx
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Upload,
	Link as LinkIcon,
	Type,
	Sparkles,
	FileDigit,
	BrainCircuit,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { cn } from "@/lib/utils";
import RotatingText from "@/components/RotatingText";

const features = [
	{
		title: "From Documents",
		description:
			"อัปโหลดไฟล์ PDF, Slides หรือ E-Book ระบบจะสแกนเนื้อหาทั้งหมดเพื่อสร้างเป็นคลังความรู้ส่วนตัว",
		icon: <Upload />,
		color: "red",
		spotlight: "rgba(231, 0, 11, 0.2)",
	},
	{
		title: "From The Web",
		description:
			"วางลิงก์บทความที่น่าสนใจ ระบบจะดึงเนื้อหา (Scraping) มาวิเคราะห์และสร้างแบบทดสอบให้อัตโนมัติ",
		icon: <LinkIcon />,
		color: "yellow",
		spotlight: "rgba(21, 93, 252, 0.2)",
	},
	{
		title: "From Your Text",
		description:
			"คัดลอกและวางเนื้อหาของคุณโดยตรงเหมาะสำหรับการสรุปใจความสำคัญหรือโน้ตย่อแบบเร่งด่วน",
		icon: <Type />,
		color: "emerald",
		spotlight: "rgba(94, 233, 181, 0.2)",
	},
];

const GlassBackground = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
			{/* Grid Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]"></div>

			{/* Blobs */}
			<div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
			<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
		</div>
	);
};

// --- Main Page ---

export default function HomePage() {
	const containerRef = useRef(null);
	const featuresRef = useRef(null);
	const heroVisualRef = useRef(null);

	// GSAP Animations
	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: {
					duration: 0.8,
					ease: "power2.out",
				},
			});

			tl.from(".hero-content > *", {
				y: 30,
				opacity: 0,
				stagger: 0.12,
			});

			tl.from(
				[".glass-layer-1", ".glass-layer-2", ".glass-layer-3"],
				{
					y: 40,
					opacity: 0,
					stagger: 0.1,
				},
				"-=0.4"
			);

			gsap.to([".glass-layer-1", ".glass-layer-2", ".glass-layer-3"], {
				y: 8,
				duration: 4,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});

			tl.from(".feature-content > *", {
				y: 30,
				opacity: 0,
				stagger: 0.12,
			});

			tl.from(
				".feature-card",
				{
					y: 30,
					autoAlpha: 0,
					stagger: 0.15,
					duration: 0.3,
					ease: "power2.out",
					// clear: "transform",
				},
				"-=0.5"
			);
		},
		{ scope: containerRef }
	);

	return (
		<div
			ref={containerRef}
			className="min-h-full font-sarabun relative selection:bg-secondary/20"
		>
			<GlassBackground />

			{/* --- Hero Section --- */}
			<section className="relative pt-24 pb-32 overflow-visible">
				<div className="container mx-auto px-6 md:px-12 relative z-10">
					<div className="flex flex-col lg:flex-row items-center gap-20">
						{/* Text Content */}
						<div className="lg:w-1/2 space-y-8 z-10 hero-content">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-primary text-xs font-bold font-prompt shadow-sm">
								<Sparkles className="w-3 h-3 text-secondary" />
								<span>AI-POWERED TUTOR</span>
							</div>

							<h1 className="hero-title text-5xl md:text-7xl font-bold text-primary font-prompt leading-[1.1]">
								<span className="block">Master Your</span>
								<span className="block text-secondary">Study Material</span>
							</h1>

							<p className="text-slate-600 text-lg font-sarabun leading-relaxed max-w-lg">
								SchoolMate เปลี่ยนเอกสารที่ซับซ้อน
								ให้กลายเป็นบทเรียนที่เข้าใจง่าย ด้วยพลังของ AI
								ที่จะช่วยสรุปและสร้างแบบฝึกหัดให้คุณในพริบตา
							</p>

							<div className="flex flex-wrap gap-4 pt-2">
								<Link href="/chat">
									<Button className="h-14 px-10 bg-primary hover:bg-[#2a2696] text-white rounded-full font-prompt text-lg shadow-xl shadow-indigo-900/20 transition-transform hover:scale-105 w-[190px]">
										Start
										<RotatingText
											texts={["Learning", "Growing", "Exploring", "Mastering"]}
											mainClassName=""
											staggerFrom={"last"}
											initial={{ y: "100%" }}
											animate={{ y: 0 }}
											exit={{ y: "-120%" }}
											staggerDuration={0.025}
											splitLevelClassName="overflow-hidden"
											transition={{
												type: "spring",
												damping: 30,
												stiffness: 400,
											}}
											rotationInterval={5000}
										/>
										<ArrowRight className="w-5 h-5" />
									</Button>
								</Link>
							</div>
						</div>

						{/* Hero Visual (Glass Stack Composition) */}
						<div
							ref={heroVisualRef}
							className="lg:w-1/2 w-full relative flex justify-center items-center h-[450px]"
						>
							{/* Layer 1: Input Doc (Back) */}
							<div className="glass-layer-1 absolute top-0 left-10 w-64 h-80 glass rounded-3xl -rotate-6 flex flex-col p-6 z-0 opacity-80">
								<div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
									<FileDigit className="text-slate-400" />
								</div>
								<div className="space-y-3 opacity-50">
									<div className="h-2 w-3/4 bg-slate-200 rounded-full" />
									<div className="h-2 w-full bg-slate-200 rounded-full" />
									<div className="h-2 w-full bg-slate-200 rounded-full" />
								</div>
							</div>

							{/* Layer 2: Processing (Middle) */}
							<div className="glass-layer-2 absolute top-20 right-8 w-60 h-60 bg-linear-to-br from-primary/90 to-[#2a2696]/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 flex items-center justify-center z-10 rotate-3 border border-white/20">
								<BrainCircuit className="w-24 h-24 text-white/90 drop-shadow-lg" />
							</div>

							{/* Layer 3: Result Quiz (Front) */}
							<div className="glass-layer-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-48 glass rounded-3xl flex flex-col p-6 z-20 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-green-50 rounded-lg text-green-600 border border-green-100">
										<Sparkles size={18} />
									</div>
									<span className="text-sm font-bold text-slate-700">
										Quiz Generated
									</span>
								</div>
								<div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-white/50">
									<div className="w-8 h-8 rounded-full bg-slate-200/50" />
									<div className="h-2 w-32 bg-slate-400/20 rounded-full" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Features Section --- */}
			<section ref={featuresRef} className="py-24 relative z-10">
				<div className="container mx-auto px-6">
					<div className="feature-content text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold font-prompt text-primary mb-4">
							Flexible Inputs,{" "}
							<span className="text-secondary">Powerful Results</span>
						</h2>
						<p className="font-sarabun text-slate-600 text-lg">
							อิสระในการเรียนรู้จากทุกแหล่งข้อมูล
							ผ่านดีไซน์ที่เรียบง่ายและสะอาดตา
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature) => (
							<SpotlightCard
								key={feature.title}
								className="feature-card glass glass-hover rounded-3xl relative overflow-hidden p-8"
								spotlightColor={feature.spotlight}
							>
								<div className="relative z-10 h-full">
									<div className="flex items-center justify-between">
										<h3
											className={cn(
												"text-xl font-bold font-prompt text-primary mb-3",
												{
													"text-red-600": feature.color === "red",
													"text-blue-600": feature.color === "blue",
													"text-emerald-600": feature.color === "emerald",
												}
											)}
										>
											{feature.title}
										</h3>
										<div
											className={cn(
												"w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors shadow-inner",

												{
													"bg-red-50 text-red-600": feature.color === "red",
													"bg-blue-50 text-blue-600": feature.color === "blue",
													"bg-emerald-50 text-emerald-600":
														feature.color === "emerald",
												}
											)}
										>
											{feature.icon}
										</div>
									</div>
									<p className="text-slate-600 text-sm leading-relaxed">
										{feature.description}
									</p>
								</div>
							</SpotlightCard>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
