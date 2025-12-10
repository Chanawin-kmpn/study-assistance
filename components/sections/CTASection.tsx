"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionProps } from "@/types/types.global";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection({ scrollerId }: SectionProps) {
	const ctaSectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const scroller = scrollerId
				? document.getElementById(scrollerId)
				: window;
			gsap.from(".cta-content", {
				scrollTrigger: {
					trigger: ctaSectionRef.current,
					start: "top 75%",
					scroller,
				},
				y: 50,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
			});
		},
		{ scope: ctaSectionRef }
	);

	return (
		<section ref={ctaSectionRef} className="relative py-20 lg:py-28">
			<div className="container mx-auto px-6 md:px-12">
				<div className="cta-content glass rounded-[0.625rem] p-12 md:p-16 text-center max-w-4xl mx-auto border-white/40 shadow-2xl">
					<h2 className="text-4xl md:text-5xl font-bold font-prompt text-primary mb-6 leading-tight">
						Ready to transform your learning
					</h2>
					<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
						Start your free trial today. No credit card needed. Get AI tools to
						boost your learning efficiency.
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<Link href="/quiz">
							<Button
								size="lg"
								className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white rounded-[0.625rem] font-prompt shadow-lg hover:shadow-xl transition-all"
							>
								Get started
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
						</Link>
						<Link href="#faq">
							<Button
								size="lg"
								variant="outline"
								className="h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-prompt rounded-[0.625rem] transition-all"
							>
								View pricing
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
