"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionProps } from "@/types/types.global"; // หรือ path ที่คุณเก็บ type นี้ไว้
import { FileText, MessageSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils"; // สมมติว่าใช้ cn utility ของ shadcn

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
	{
		id: 0,
		title: "Create quizzes from any source material",
		description:
			"Upload PDFs, paste web links, or input text directly into the platform. Our AI analyzes the content structure to generate relevant questions.",
		icon: FileText,
		color: "bg-blue-100",
	},
	{
		id: 1,
		title: "Ask questions about your documents",
		description:
			"Chat with your content using AI that understands context. Get answers grounded in the actual content without hallucination.",
		icon: MessageSquare,
		color: "bg-orange-100",
	},
	{
		id: 2,
		title: "Explore and Summarize",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
		icon: Search,
		color: "bg-purple-100",
	},
];

export default function FeaturesSection({ scrollerId }: SectionProps) {
	const featureSectionRef = useRef<HTMLElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	useGSAP(
		() => {
			const scroller = scrollerId
				? document.getElementById(scrollerId)
				: window;

			// Animate Entry
			gsap.from(".feature-content", {
				scrollTrigger: {
					trigger: featureSectionRef.current,
					scroller,
					start: "top 70%",
				},
				y: 40,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
			});
		},
		{ scope: featureSectionRef, dependencies: [scrollerId] }
	);

	return (
		<section ref={featureSectionRef} className="relative py-20 lg:py-28">
			<div className="container mx-auto px-6 md:px-12">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start feature-content">
					{/* Left Column: Dynamic Image Area */}
					<div className="relative aspect-square lg:aspect-4/3 w-full order-2 lg:order-1">
						<div className="w-full h-full relative">
							{featuresData.map((feature, index) => (
								<div
									key={feature.id}
									className={cn(
										"absolute inset-0 w-full h-full glass rounded-[0.625rem] border-white/40 shadow-2xl transition-all duration-500 ease-in-out flex items-center justify-center",
										activeIndex === index
											? "opacity-100 scale-100 z-10"
											: "opacity-0 scale-95 z-0"
									)}
								>
									{/* Placeholder for Image - Replace with <Image /> */}
									<div className="text-center space-y-4 p-8">
										<div
											className={`w-32 h-32 mx-auto ${
												feature.color
											} rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${
												activeIndex === index ? "scale-100" : "scale-75"
											}`}
										>
											<feature.icon className="w-16 h-16 text-primary/80" />
										</div>
										<p className="text-slate-400 font-prompt text-sm">
											Image Preview for: <br />
											<span className="text-primary font-bold text-lg">
												{feature.title}
											</span>
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Right Column: Interactive List */}
					<div className="flex flex-col order-1 lg:order-2 h-full">
						{featuresData.map((feature, index) => (
							<div
								key={feature.id}
								onMouseEnter={() => setActiveIndex(index)}
								className="group relative pl-8 py-6 cursor-pointer transition-colors duration-300 flex-1"
							>
								{/* Animated Left Bar */}
								<div
									className={cn(
										"absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 rounded-full",
										activeIndex === index
											? "bg-secondary scale-y-100 opacity-100"
											: "bg-slate-200 scale-y-50 opacity-0 group-hover:opacity-50"
									)}
								/>

								<h3
									className={cn(
										"text-2xl md:text-3xl font-bold font-prompt mb-3 transition-colors duration-300",
										activeIndex === index
											? "text-primary"
											: "text-slate-400 group-hover:text-primary/70"
									)}
								>
									{feature.title}
								</h3>

								<div
									className={cn(
										"overflow-hidden transition-all duration-500 ease-out"
									)}
								>
									<p className="text-slate-600 text-lg leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
