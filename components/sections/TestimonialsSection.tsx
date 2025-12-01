"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SectionProps } from "@/types/types.global";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
	{
		type: "Preview",
		title: "Preview",
		content:
			"Students explored our course. This AI-pilot is unique and offers a better way to read and understand scientific papers.",
		author: "Dr. Emily Johnson",
		role: "University Professor",
		link: "Read case study",
	},
	{
		type: "Retrieve",
		title: "Retrieve",
		content:
			"Our users love the instantaneous answers. This tool saves everyone time and makes materials more accessible than ever before.",
		author: "Michael Chen",
		role: "Corporate Trainer",
		link: "Read case study",
	},
];

export default function TestimonialsSection({ scrollerId }: SectionProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	useGSAP(
		() => {
			const scroller = scrollerId
				? document.getElementById(scrollerId)
				: window;
			gsap.from(".testimonials-title", {
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 70%",
					scroller,
				},
				y: 40,
				opacity: 0,
				duration: 0.8,
			});

			gsap.from(".testimonial-card", {
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 60%",
					scroller,
				},
				scale: 0.95,
				opacity: 0,
				stagger: 0.2,
				duration: 0.6,
			});
		},
		{ scope: sectionRef }
	);

	const nextTestimonial = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
	};

	return (
		<section ref={sectionRef} className="relative py-20 lg:py-28">
			<div className="container mx-auto px-6 md:px-12">
				{/* Section Header */}
				<div className="mb-16">
					<h2 className="testimonials-title text-4xl md:text-5xl font-bold font-prompt text-primary mb-4">
						Real feedback
					</h2>
					<p className="testimonials-title text-lg text-slate-600">
						เสียงจากผู้ใช้งานจริงของเรา
					</p>
				</div>

				{/* Testimonial Cards Grid */}
				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="testimonial-card glass glass-hover rounded-[0.625rem] p-8 border-white/40 shadow-lg"
						>
							<div className="mb-6">
								<div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
									<span className="text-sm font-bold font-prompt text-primary">
										{testimonial.type}
									</span>
								</div>
								<p className="text-slate-700 leading-relaxed mb-6 text-lg">
									{testimonial.content}
								</p>
							</div>

							<div className="flex items-center justify-between pt-6 border-t border-slate-200">
								<div>
									<div className="font-bold text-primary font-prompt">
										{testimonial.author}
									</div>
									<div className="text-sm text-slate-500">
										{testimonial.role}
									</div>
								</div>
								<Button
									variant="ghost"
									className="text-primary hover:text-primary/80 font-prompt p-0 h-auto"
								>
									{testimonial.link} <ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</div>
					))}
				</div>

				{/* Navigation */}
				<div className="flex items-center justify-center gap-4">
					<Button
						variant="outline"
						size="icon"
						onClick={prevTestimonial}
						className="w-10 h-10 rounded-full glass glass-hover border-slate-200"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>

					<div className="flex gap-2">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-2 h-2 rounded-full transition-all ${
									index === currentIndex
										? "bg-primary w-8"
										: "bg-slate-300 hover:bg-slate-400"
								}`}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>

					<Button
						variant="outline"
						size="icon"
						onClick={nextTestimonial}
						className="w-10 h-10 rounded-full glass glass-hover border-slate-200"
					>
						<ChevronRight className="w-5 h-5" />
					</Button>
				</div>
			</div>
		</section>
	);
}
