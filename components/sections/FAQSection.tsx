"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { SectionProps } from "@/types/types.global";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
	{
		question: "What file types are supported?",
		answer:
			"We support PDF documents, direct text input, and web links. The AI processes the content and generates quizzes or enables contextual chat based on what you provide.",
	},
	{
		question: "How accurate is the AI chat?",
		answer:
			"The AI stays within the scope of your uploaded content. It draws answers directly from the material you provide, ensuring accuracy and relevance to your specific documents.",
	},
	{
		question: "Can I customize quiz difficulty?",
		answer:
			"Yes. You can adjust question types, difficulty levels, and focus areas to match your learning goals. The platform adapts to your preferences.",
	},
	{
		question: "Is my data private and secure?",
		answer:
			"Your documents and data are encrypted and never shared. We follow strict privacy standards to protect your information and learning materials.",
	},
	{
		question: "How do I get started?",
		answer:
			"Sign up for an account, upload your first document, and choose whether to generate a quiz or start a chat. It takes less than a minute to begin.",
	},
];

export default function FAQSection({ scrollerId }: SectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const scroller = scrollerId
				? document.getElementById(scrollerId)
				: window;

			// Animate Left Header
			gsap.from(".faq-header", {
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

			// Animate Right Items
			gsap.from(".faq-item", {
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 65%",
					scroller,
				},
				y: 30,
				opacity: 0,
				stagger: 0.1,
				duration: 0.6,
				ease: "power3.out",
			});
		},
		{ scope: sectionRef, dependencies: [scrollerId] }
	);

	return (
		<section id="faq" ref={sectionRef} className="relative py-20 lg:py-32">
			<div className="container mx-auto px-6 md:px-12">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
					{/* Left Column: Sticky Header */}
					<div className="lg:col-span-4 faq-header">
						<div className="lg:sticky lg:top-32">
							<h2 className="text-5xl font-bold font-prompt text-primary mb-6">
								FAQ
							</h2>
							<p className="text-lg text-slate-600 mb-8 font-medium">
								Common questions about SchoolMate AI
							</p>
							<Button
								variant="outline"
								size="lg"
								className="h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-prompt rounded-[0.625rem] transition-all"
							>
								Contact
							</Button>
						</div>
					</div>

					{/* Right Column: Question List (Always Visible) */}
					<div className="lg:col-span-8 space-y-10">
						{faqs.map((faq, index) => (
							<div key={index} className="faq-item group">
								<h3 className="text-xl md:text-2xl font-bold font-prompt text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
									{faq.question}
								</h3>
								<p className="text-slate-600 leading-relaxed text-base md:text-lg">
									{faq.answer}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
