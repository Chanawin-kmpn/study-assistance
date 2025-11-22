import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Prompt, Sarabun } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
	weight: ["400", "500", "600", "700"],
	subsets: ["thai", "latin"],
	variable: "--font-heading", // ชื่อตัวแปร CSS
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const sarabun = Sarabun({
	weight: ["300", "400", "500", "600"],
	subsets: ["thai", "latin"],
	variable: "--font-sarabun",
	display: "swap",
});

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "SchoolMate | AI-Powered Study Assistance",
	description:
		"Transform your lecture slides into interactive summaries, quizzes, and instant Q&A.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`
        ${prompt.variable} 
        ${inter.variable} 
        ${sarabun.variable} 
        ${jetbrains.variable} 
        font-body  
        antialiased
      `}
			>
				{children}
			</body>
		</html>
	);
}
