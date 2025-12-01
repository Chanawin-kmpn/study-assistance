"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

gsap.registerPlugin(ScrollTrigger);

const GlassBackground = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50">
			{/* 1. Noise Texture Overlay (ทำให้ดูมี Texture เหมือนกระดาษ) */}
			<div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

			{/* 2. Grid Pattern (ปรับให้จางลงและดูเนียนขึ้น) */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size:[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

			{/* 3. Animated Blobs */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden z-10">
				{/* Primary Blob (Blue) - Top Left */}
				<div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob opacity-70" />

				{/* Secondary Blob (Orange) - Top Right */}
				<div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-secondary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 opacity-60" />

				{/* Accent Blob (Purple/Blue mix) - Bottom Center */}
				<div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 opacity-50" />
			</div>

			{/* 4. Vignette Effect (เงาขอบจอเล็กน้อยเพื่อให้ตรงกลางเด่น) */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(255,255,255,0.8)_100%)] z-10"></div>
		</div>
	);
};

export default function HomePage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const scroller = "main-scroll-container";

	useGSAP(
		() => {
			gsap.from(".page-section", {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.1,
				ease: "power2.out",
			});
		},
		{ scope: containerRef }
	);

	return (
		<div
			ref={containerRef}
			className="min-h-screen font-sarabun relative selection:bg-secondary/20"
		>
			<GlassBackground />

			<div className="page-section">
				<HeroSection />
			</div>

			<div className="page-section">
				<FeaturesSection scrollerId={scroller} />
			</div>

			<div className="page-section">
				<HowItWorksSection scrollerId={scroller} />
			</div>

			<div className="page-section">
				<TestimonialsSection scrollerId={scroller} />
			</div>

			<div className="page-section">
				<CTASection scrollerId={scroller} />
			</div>

			<div className="page-section">
				<FAQSection scrollerId={scroller} />
			</div>

			<Footer />
		</div>
	);
}
