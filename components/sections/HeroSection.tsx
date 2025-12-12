"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RotatingText from "@/components/RotatingText";
import HomeIllustration from "@/components/illustration/HomeIllustration";

export default function HeroSection() {
	const heroSectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: { duration: 1, ease: "power3.out" },
			});

			// Text Animation
			tl.from(".hero-title", { y: 50, opacity: 0 })
				.from(".hero-content", { y: 30, opacity: 0 }, "-=0.6")
				.from(
					".hero-image-1",
					{ y: 60, opacity: 0, scale: 0.9, duration: 1.2 },
					"-=0.8"
				)
				.from(
					".hero-image-2",
					{ y: 60, opacity: 0, scale: 0.9, duration: 1.2 },
					"-=1"
				);

			// Floating Animation (Continuous)
			gsap.to(".hero-image-1", {
				y: -15,
				duration: 3,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 1,
			});
			gsap.to(".hero-image-2", {
				y: -20,
				duration: 4,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 1.5,
			});
		},
		{ scope: heroSectionRef }
	);

	return (
		<section
			ref={heroSectionRef}
			className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 min-h-[90vh] flex items-center"
		>
			<div className="container mx-auto px-6 md:px-12">
				<div className="grid lg:grid-cols-12 gap-12 items-center">
					{/* Left Column: Text */}
					<div className="lg:col-span-5 flex flex-col justify-center h-full">
						{/* Title Area */}
						<div className="mb-12 lg:mb-24">
							<h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold font-prompt text-primary leading-[1.1] tracking-tight">
								Turn your <br />
								documents into <br />
								<RotatingText
									texts={[
										"learning tools",
										"study guides",
										"smart quizzes",
										"AI tutors",
									]}
									mainClassName="text-secondary"
									staggerFrom={"last"}
									initial={{ y: "100%" }}
									animate={{ y: 0 }}
									exit={{ y: "-120%" }}
									staggerDuration={0.025}
									splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
									transition={{ type: "spring", damping: 30, stiffness: 400 }}
									rotationInterval={5000}
								/>
							</h1>
						</div>

						{/* Bottom Content Area */}
						<div className="hero-content space-y-8">
							<p className="text-lg text-slate-600 leading-relaxed max-w-md">
								Generate quizzes from PDFs, web links, and text. Chat with your
								content using AI that understands context.
							</p>

							<div className="flex flex-wrap gap-4">
								<Link href="/chat">
									<Button
										size="lg"
										className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white rounded-[0.625rem] font-prompt shadow-lg hover:shadow-xl transition-all"
									>
										Start now
										<ArrowRight className="w-5 h-5 ml-2" />
									</Button>
								</Link>
								<Link href="#how-it-works">
									<Button
										size="lg"
										variant="outline"
										className="h-12 px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-prompt rounded-[0.625rem] transition-all"
									>
										Learn more
									</Button>
								</Link>
							</div>
						</div>
					</div>

					{/* Right Column: Visuals (Mock Images) */}
					<div className="lg:col-span-7 relative hidden lg:block">
						<div className="flex gap-6 items-start justify-end relative pl-10">
							<HomeIllustration />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
