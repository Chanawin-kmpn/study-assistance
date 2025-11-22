import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen space-y-6">
			<h1 className="text-5xl font-bold text-primary font-heading">
				SkoolMate
			</h1>
			<p className="text-xl text-slate-600 font-body">
				AI Assistant for Skooldio Students
			</p>

			<SignedOut>
				{/* ปุ่ม Login ของ Clerk สวยและใช้ง่าย */}
				<SignInButton mode="modal">
					<button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 font-bold shadow-lg transition-all">
						Get Started with AI
					</button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				<div className="flex flex-col items-center gap-4">
					<div className="p-2 border rounded-full">
						<UserButton afterSignOutUrl="/" />
					</div>
					<Link href="/dashboard">
						<button className="px-6 py-3 bg-primary text-white rounded-lg">
							Go to Dashboard
						</button>
					</Link>
				</div>
			</SignedIn>
		</div>
	);
}
