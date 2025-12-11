import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Cookie Policy | SchoolMate",
	description: "How SchoolMate uses cookies",
};

export default function CookiePolicyPage() {
	return (
		<div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-slate-950">
			<div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-gray-800 sm:p-12">
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
				</div>

				<article className="prose prose-slate dark:prose-invert max-w-none">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
							<Cookie size={32} />
						</div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 m-0">
							นโยบายคุกกี้ (Cookie Policy)
						</h1>
					</div>

					<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						อัปเดตล่าสุด: 12 ธันวาคม 2025
					</p>

					<div className="mt-8 space-y-8 text-gray-600 dark:text-gray-300">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								1. คุกกี้คืออะไร?
							</h2>
							<p>
								คุกกี้คือไฟล์ข้อความขนาดเล็กที่ถูกบันทึกลงในคอมพิวเตอร์หรืออุปกรณ์มือถือของคุณเมื่อคุณเข้าชมเว็บไซต์
								ช่วยให้เว็บไซต์จดจำการกระทำและการตั้งค่าของคุณในช่วงเวลาหนึ่ง
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								2. คุกกี้ที่เราใช้
							</h2>
							<div className="space-y-4">
								<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
									<h3 className="font-semibold text-gray-900 dark:text-white">
										คุกกี้ที่จำเป็น (Strictly Necessary Cookies)
									</h3>
									<p className="text-sm mt-1">
										จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น
										การจดจำสถานะการล็อกอิน (Login) ผ่านระบบ Clerk และความปลอดภัย
										หากปิดคุกกี้นี้ คุณจะไม่สามารถเข้าใช้งานระบบสมาชิกได้
									</p>
								</div>

								<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
									<h3 className="font-semibold text-gray-900 dark:text-white">
										คุกกี้เพื่อประสิทธิภาพ (Performance Cookies)
									</h3>
									<p className="text-sm mt-1">
										ช่วยให้เราเข้าใจการใช้งานเว็บไซต์ เช่น
										หน้าใดที่มีคนเข้าชมมากที่สุด
										เพื่อนำไปพัฒนาปรับปรุงระบบให้ดียิ่งขึ้น
									</p>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								3. การจัดการคุกกี้
							</h2>
							<p>
								คุณสามารถเลือกยอมรับหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้ผ่านแบนเนอร์การตั้งค่าที่แสดงขึ้นเมื่อเข้าเว็บไซต์ครั้งแรก
								หรือคุณสามารถลบคุกกี้และตั้งค่าเบราว์เซอร์เพื่อบล็อกคุกกี้ได้
							</p>
						</section>
					</div>
				</article>
			</div>
		</div>
	);
}
