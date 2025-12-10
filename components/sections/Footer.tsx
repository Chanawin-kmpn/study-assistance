"use client";

import React from "react";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/constants";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative py-12 border-t border-slate-200">
			<div className="container mx-auto px-6 md:px-12">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					{/* Brand */}
					<div className="md:col-span-1">
						<h3 className="text-xl font-bold font-prompt text-primary mb-2">
							SchoolMate
						</h3>
						<p className="text-sm text-slate-600">
							AI-powered learning platform for students and educators
						</p>
					</div>

					{/* Navigation Links - Map Rendered */}
					{FOOTER_LINKS.map((section) => (
						<div key={section.title}>
							<h4 className="font-bold font-prompt text-primary mb-4">
								{section.title}
							</h4>
							<ul className="space-y-2">
								{section.items.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-slate-600 hover:text-primary transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-slate-600">
						© {currentYear} SchoolMate. All rights reserved.
					</p>

					{/* Social Links - Map Rendered */}
					<div className="flex gap-4">
						{SOCIAL_LINKS.map((social) => (
							<a
								key={social.ariaLabel}
								href={social.href}
								target={
									social.href.startsWith("mailto:") ? undefined : "_blank"
								}
								rel={
									social.href.startsWith("mailto:")
										? undefined
										: "noopener noreferrer"
								}
								aria-label={social.ariaLabel}
								className="w-9 h-9 rounded-full glass glass-hover flex items-center justify-center border-slate-200 text-slate-600 hover:text-primary transition-colors"
							>
								<social.icon className="w-4 h-4" />
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
