"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Facebook, Mail } from "lucide-react";

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

					{/* Product Links */}
					<div>
						<h4 className="font-bold font-prompt text-primary mb-4">Product</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/features"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="/pricing"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h4 className="font-bold font-prompt text-primary mb-4">Company</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h4 className="font-bold font-prompt text-primary mb-4">Legal</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/privacy"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/cookies"
									className="text-sm text-slate-600 hover:text-primary transition-colors"
								>
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-slate-600">
						© {currentYear} SchoolMate. All rights reserved.
					</p>

					{/* Social Links */}
					<div className="flex gap-4">
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-9 h-9 rounded-full glass glass-hover flex items-center justify-center border-slate-200 text-slate-600 hover:text-primary transition-colors"
						>
							<Github className="w-4 h-4" />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-9 h-9 rounded-full glass glass-hover flex items-center justify-center border-slate-200 text-slate-600 hover:text-primary transition-colors"
						>
							<Twitter className="w-4 h-4" />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-9 h-9 rounded-full glass glass-hover flex items-center justify-center border-slate-200 text-slate-600 hover:text-primary transition-colors"
						>
							<Facebook className="w-4 h-4" />
						</a>
						<a
							href="mailto:contact@schoolmate.com"
							className="w-9 h-9 rounded-full glass glass-hover flex items-center justify-center border-slate-200 text-slate-600 hover:text-primary transition-colors"
						>
							<Mail className="w-4 h-4" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
