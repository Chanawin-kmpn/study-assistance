"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionProps } from "@/types/types.global";
import { cn } from "@/lib/utils";
import QuizIllustration from "@/components/illustration/QuizIllustration";
import QuestionIllustration from "@/components/illustration/QuestionIllustration";
import ExploreIllustration from "@/components/illustration/ExploreIllustration";

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
	{
		id: 0,
		title: "Create quizzes from any source material",
		description:
			"Upload PDFs, paste web links, or input text directly into the platform. Our AI analyzes the content structure to generate relevant questions.",
		illustration: QuizIllustration,
	},
	{
		id: 1,
		title: "Ask questions about your documents",
		description:
			"Chat with your content using AI that understands context. Get answers grounded in the actual content without hallucination.",
		illustration: QuestionIllustration,
	},
	{
		id: 2,
		title: "Explore and Summarize",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
		illustration: ExploreIllustration,
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
					<div className="relative aspect-square w-full order-2 lg:order-1">
						<div className="w-full h-full relative">
							{featuresData.map((feature, index) => {
								const isActive = activeIndex === index;
								return (
									<div
										key={feature.id}
										className={cn(
											"absolute inset-0 w-full h-fit glass rounded-[0.625rem] border-white/40 shadow-2xl transition-all duration-500 ease-in-out flex items-center justify-center",
											isActive
												? "opacity-100 scale-100 z-10"
												: "opacity-0 scale-95 z-0"
										)}
									>
										<div className="text-center space-y-4 p-8 size-full">
											<div className="size-full">
												<feature.illustration isActive={isActive} />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Right Column: Interactive List */}
					<div className="flex flex-col order-1 lg:order-2 h-full">
						{featuresData.map((feature, index) => {
							const isActive = activeIndex === index;
							return (
								<div
									key={feature.id}
									onMouseEnter={() => setActiveIndex(index)}
									className="group relative pl-8 py-6 cursor-pointer transition-colors duration-300 flex-1"
								>
									{/* Animated Left Bar */}
									<div
										className={cn(
											"absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 rounded-full",
											isActive
												? "bg-secondary scale-y-100 opacity-100"
												: "bg-slate-200 scale-y-50 opacity-0 group-hover:opacity-50"
										)}
									/>

									<h3
										className={cn(
											"text-2xl md:text-3xl font-bold font-prompt mb-3 transition-colors duration-300",
											isActive
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
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
