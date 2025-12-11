import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | SchoolMate",
	description: "Privacy Policy for SchoolMate application",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-slate-950">
			<div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-gray-800 sm:p-12">
				{/* Navigation */}
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
				</div>

				{/* Content */}
				<article className="prose prose-slate dark:prose-invert max-w-none">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
						นโยบายความเป็นส่วนตัว (Privacy Policy)
					</h1>
					<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						อัปเดตล่าสุด: 12 ธันวาคม 2025
					</p>

					<div className="mt-8 space-y-8 text-gray-600 dark:text-gray-300">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								1. บทนำ
							</h2>
							<p>
								<strong>SchoolMate</strong> (&quot;เรา&quot;)
								ให้ความสำคัญกับความเป็นส่วนตัวของคุณอย่างยิ่ง
								นโยบายนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้
								และเปิดเผยข้อมูลของคุณเมื่อคุณใช้งานบริการ AI Chat
								และระบบจัดการเอกสารของเรา
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								2. ข้อมูลที่เราเก็บรวบรวม
							</h2>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									<strong>ข้อมูลบัญชี:</strong> ชื่อ, อีเมล, และรูปโปรไฟล์
									(ผ่านบริการ Clerk Authentication)
								</li>
								<li>
									<strong>ข้อมูลเนื้อหา:</strong> ไฟล์เอกสาร (PDF) ที่คุณอัปโหลด
									และข้อความแชทที่คุณสนทนากับ AI
								</li>
								<li>
									<strong>ข้อมูลการใช้งาน:</strong> ข้อมูลทางเทคนิค เช่น IP
									Address, ประเภท Browser และ Cookies เพื่อการทำงานของระบบ
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								3. วิธีที่เราใช้ข้อมูลของคุณ
							</h2>
							<p>เราใช้ข้อมูลของคุณเพื่อวัตถุประสงค์ต่อไปนี้:</p>
							<ul className="list-disc pl-5 space-y-2 mt-2">
								<li>เพื่อสร้างระบบตอบคำถามอัตโนมัติ (RAG) จากเอกสารของคุณ</li>
								<li>
									ประมวลผล AI: เนื้อหาในเอกสารของคุณจะถูกแปลงเป็นข้อมูลดิจิทัล
									(Vector) และอาจถูกส่งไปยังผู้ให้บริการ AI (เช่น OpenAI หรือ
									Google Gemini) เพื่อทำการประมวลผลคำตอบ{" "}
									<span className="font-semibold text-blue-600 dark:text-blue-400">
										โดยจะไม่ถูกนำไปใช้ฝึกสอนโมเดลสาธารณะ
									</span>
								</li>
								<li>
									เพื่อยืนยันตัวตนและป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								4. การแชร์ข้อมูลกับบุคคลที่สาม
							</h2>
							<p>
								เราใช้บริการ Infrastructure จากบุคคลที่สามเพื่อขับเคลื่อนระบบ
								ดังนี้:
							</p>
							<ul className="list-disc pl-5 space-y-2 mt-2">
								<li>
									<strong>Clerk:</strong> สำหรับระบบสมาชิกและยืนยันตัวตน
								</li>
								<li>
									<strong>Pinecone / Vector DB:</strong>{" "}
									สำหรับจัดเก็บข้อมูลเนื้อหาเอกสาร (เข้ารหัสและแยกสิทธิ์)
								</li>
								<li>
									<strong>AI Providers:</strong> สำหรับประมวลผลคำตอบในหน้า Chat
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
								5. การจัดการข้อมูลของคุณ
							</h2>
							<p>
								คุณเป็นเจ้าของข้อมูล 100%
								คุณสามารถลบไฟล์เอกสารหรือบัญชีผู้ใช้ได้ตลอดเวลา เมื่อคุณทำการลบ
								ข้อมูลที่เกี่ยวข้องในฐานข้อมูลและ Vector Database
								ของเราจะถูกลบออกอย่างถาวรทันที
							</p>
						</section>

						<section className="border-t border-gray-200 pt-6 dark:border-gray-800">
							<p className="text-sm">
								หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว ติดต่อเราได้ที่:{" "}
								<a
									href="mailto:support@schoolmate.app"
									className="text-blue-600 hover:underline"
								>
									support@schoolmate.app
								</a>
							</p>
						</section>
					</div>
				</article>
			</div>
		</div>
	);
}
