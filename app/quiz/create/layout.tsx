import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="max-w-5xl mx-auto py-10 px-6">
			<Link href="/quiz">
				<Button variant="ghost" className="text-slate-500 hover:text-primary">
					<ChevronLeft className="w-4 h-4 mr-2" /> Back
				</Button>
			</Link>
			{children}
		</div>
	);
};

export default Layout;
