"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Upload, MessageSquareText, FileText, Wrench } from "lucide-react";
import { SectionProps } from "@/types/types.global";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const steps = [
	{
		icon: Upload,
		title: "Upload your learning material",
		description:
			"Add a PDF, link, or paste text to begin. The system accepts various formats to suit your needs.",
	},
	{
		icon: MessageSquareText,
		title: "Generate or discuss your content",
		description:
			"Create quizzes automatically or chat with the AI to understand the context deeper.",
	},
	{
		icon: FileText,
		title: "Feed your material",
		description:
			"Drop a PDF, share a link, or type your content directly into the system for instant analysis.",
	},
	{
		icon: Wrench,
		title: "Build and learn",
		description:
			"Generate quizzes instantly or ask the AI anything about your documents to master the subject.",
	},
];

export default function HowItWorksSection({ scrollerId }: SectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const scroller = scrollerId
				? document.getElementById(scrollerId)
				: window;

			// Animate Left Side (Text)
			gsap.from(".how-left-content", {
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 70%",
					scroller,
				},
				x: -30,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
			});

			// Animate Right Side (Grid Items)
			gsap.from(".how-step-card", {
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 65%",
					scroller,
				},
				y: 40,
				opacity: 0,
				stagger: 0.15,
				duration: 0.8,
				ease: "power3.out",
			});
		},
		{ scope: sectionRef, dependencies: [scrollerId] }
	);

	return (
		<section
			id="how-it-works"
			ref={sectionRef}
			className="relative py-20 lg:py-32"
		>
			<div className="container mx-auto px-6 md:px-12">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
					{/* Left Column: Header & Description */}
					<div className="lg:col-span-4 flex flex-col justify-center how-left-content">
						<div className="mb-2 text-sm font-bold font-prompt text-secondary uppercase tracking-wider">
							Process
						</div>
						<h2 className="text-4xl md:text-5xl font-bold font-prompt text-primary mb-6">
							How it works
						</h2>
						<p className="text-lg text-slate-600 mb-10 leading-relaxed">
							Start with what you have. Whether it&apos;s a PDF sitting on your
							desk, a link to an article, or notes you&apos;ve written down,
							SchoolMate accepts it all. The system reads your material,
							understands its meaning, and prepares it for learning.
						</p>
					</div>

					{/* Right Column: 2x2 Grid Steps */}
					<div className="lg:col-span-8">
						<div className="grid md:grid-cols-2 gap-6 md:gap-8">
							{steps.map((step, index) => {
								const Icon = step.icon;
								return (
									<div
										key={index}
										className={cn(
											"how-step-card group relative p-8 rounded-[0.625rem]",
											"glass glass-hover border-white/40", // Base styles
											"hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out" // Hover interactions
										)}
									>
										{/* Icon Area */}
										<div className="mb-6 inline-flex">
											<div className="p-3 rounded-xl bg-slate-50 group-hover:bg-orange-50 transition-colors duration-300">
												<Icon className="w-8 h-8 text-primary group-hover:text-secondary group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
											</div>
										</div>

										{/* Content */}
										<h3 className="text-xl font-bold font-prompt text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
											{step.title}
										</h3>
										<p className="text-slate-600 leading-relaxed text-sm md:text-base">
											{step.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
