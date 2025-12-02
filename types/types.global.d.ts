import { Quiz, QuizAttempt } from "@/generated/prisma/client";

interface SectionProps {
	scrollerId?: string; // รับ ID เป็น string (optional)
}

type Attempt = {
	id: string;
	score: number; // คะแนนดิบ (เช่น 8)
	total: number; // คะแนนเต็ม (เช่น 10)
	percentage: number; // เปอร์เซ็นต์ (เช่น 80)
	duration: number; // เวลาที่ใช้ (วินาที)
	createdAt: Date;
};

interface AttemptsListProps {
	attempts: Attempt[];
	quizId: string;
}

type QuizWithAttempts = Quiz & { attempts: QuizAttempt[] };

interface QuizCardProps {
	quiz: QuizWithAttempts;
}

type DocumentItem = {
	id: string;
	name: string;
	url: string;
	createdAt: string;
	pageCount?: number | null;
};

type ChatSession = { id: string; title: string; createdAt: Date };

type ChatMode = "tutor" | "summary";
