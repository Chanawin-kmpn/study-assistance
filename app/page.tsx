import Image from "next/image";

export default function Home() {
	return (
		<div className="space-y-4">
			{/* Header: ใช้ Prompt (ดู Modern) */}
			<h1 className="text-3xl font-bold text-primary">
				บทที่ 1: Introduction to React
			</h1>

			{/* Body: Eng ใช้ Inter, Thai ใช้ Sarabun (อ่านลื่นไหล) */}
			<p className="text-slate-700 leading-relaxed">
				React is a JavaScript library for building user interfaces. (รีแอค คือ
				ไลบรารีจาวาสคริปต์สำหรับสร้างส่วนต่อประสานผู้ใช้) ช่วยให้เราสร้างเว็บแบบ
				SPA ได้ง่ายขึ้น
			</p>

			{/* Code: ใช้ JetBrains Mono (ดู Pro) */}
			<pre className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
				const [count, setCount] = useState(0);
			</pre>
		</div>
	);
}
