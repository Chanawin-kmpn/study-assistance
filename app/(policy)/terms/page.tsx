import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service | SchoolMate",
	description: "Terms and conditions for using SchoolMate",
};

export default function TermsPage() {
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
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
						ข้อกำหนดการใช้งาน (Terms of Service)
					</h1>
					<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						อัปเดตล่าสุด: 12 ธันวาคม 2025
					</p>

					<div className="mt-8 space-y-8 text-gray-600 dark:text-gray-300">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								1. การยอมรับข้อตกลง
							</h2>
							<p>
								เมื่อคุณเข้าใช้งาน <strong>SchoolMate</strong>{" "}
								ถือว่าคุณยอมรับข้อกำหนดเหล่านี้
								หากคุณไม่เห็นด้วยกับส่วนใดส่วนหนึ่งของข้อตกลง
								โปรดระงับการใช้งานทันที
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								2. การใช้งานที่เหมาะสม
							</h2>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									คุณต้องไม่ใช้อัปโหลดเอกสารที่มีเนื้อหาผิดกฎหมาย
									ละเมิดลิขสิทธิ์ อนาจาร หรือสร้างความเกลียดชัง
								</li>
								<li>คุณรับผิดชอบต่อความปลอดภัยของรหัสผ่านและบัญชีของคุณเอง</li>
								<li>ห้ามพยายามเจาะระบบ หรือรบกวนการทำงานของ Server</li>
							</ul>
						</section>

						{/* Highlight AI Disclaimer */}
						<section className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/10">
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500" />
								<div>
									<h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
										3. ข้อจำกัดความรับผิดชอบเกี่ยวกับ AI (Disclaimer)
									</h2>
									<ul className="list-disc pl-4 text-sm text-amber-800 dark:text-amber-200 space-y-1">
										<li>
											บริการของเราใช้เทคโนโลยีปัญญาประดิษฐ์ (AI)
											ในการสรุปและตอบคำถาม
										</li>
										<li>
											<strong>ความถูกต้อง:</strong> AI อาจมีความผิดพลาด
											(Hallucination) หรือให้ข้อมูลที่ไม่ครบถ้วน
											เราไม่รับประกันความถูกต้อง 100% ของคำตอบที่ได้
										</li>
										<li>
											<strong>การตัดสินใจ:</strong> ไม่ควรใช้ข้อมูลจาก
											SchoolMate เป็นข้อยุติในการตัดสินใจเรื่องสำคัญ เช่น
											ทางการแพทย์ กฎหมาย หรือการเงิน
										</li>
									</ul>
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								4. ทรัพย์สินทางปัญญา
							</h2>
							<p>
								<strong>ข้อมูลของคุณ:</strong>{" "}
								เอกสารที่คุณอัปโหลดเป็นลิขสิทธิ์ของคุณ
								เราไม่ถือสิทธิ์ความเป็นเจ้าของใดๆ
								<br />
								<strong>บริการของเรา:</strong> โค้ด, โลโก้, การออกแบบ และระบบของ
								SchoolMate เป็นลิขสิทธิ์ของเรา
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								5. การยกเลิกบริการ
							</h2>
							<p>
								เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของคุณหากพบการละเมิดข้อตกลง
								โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
							</p>
						</section>
					</div>
				</article>
			</div>
		</div>
	);
}
