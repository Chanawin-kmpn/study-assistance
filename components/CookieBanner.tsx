"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const CookieBanner = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// เช็คว่าเคยตอบรับไปหรือยัง
		const consent = localStorage.getItem("schoolmate-cookie-consent");
		if (!consent) {
			const timer = setTimeout(() => setIsVisible(true), 1000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem("schoolmate-cookie-consent", "true");
		setIsVisible(false);
	};

	const handleDecline = () => {
		// บันทึกว่าปฏิเสธ (แต่ระบบ Login Clerk ยังคงทำงานผ่าน Essential Cookies)
		localStorage.setItem("schoolmate-cookie-consent", "false");
		setIsVisible(false);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-4"
				>
					<div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-gray-800 dark:bg-slate-900/95">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
							{/* Icon & Text */}
							<div className="flex flex-1 items-start gap-4">
								<div className="hidden rounded-full bg-secondary/20 p-3 text-secondary dark:bg-secondary dark:text-secondary/40 sm:block">
									<Cookie size={24} />
								</div>
								<div className="space-y-1">
									<h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
										We value your privacy
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										We use cookies to ensure you get the best experience on
										SchoolMate. By clicking &quot;Accept&quot;, you agree to our
										use of cookies as described in our{" "}
										<Link
											href="/cookie-policy"
											className="font-medium text-secondary hover:underline dark:text-secondary/40"
										>
											Cookie Policy
										</Link>
										. Read our{" "}
										<Link
											href="/privacy-policy"
											className="font-medium text-secondary hover:underline dark:text-secondary/40"
										>
											Privacy Policy
										</Link>{" "}
										and{" "}
										<Link
											href="/terms"
											className="font-medium text-secondary hover:underline dark:text-secondary/40"
										>
											Terms
										</Link>
										.
									</p>
								</div>
							</div>

							{/* Buttons */}
							<div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
								<button
									onClick={handleDecline}
									className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									Essential Only
								</button>
								<button
									onClick={handleAccept}
									className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-white transition hover:bg-secondary/90 shadow-sm"
								>
									Accept All
								</button>
							</div>
						</div>

						{/* Mobile Close Icon (Optional) */}
						<button
							onClick={() => setIsVisible(false)}
							className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 md:hidden"
						>
							<X size={18} />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CookieBanner;
