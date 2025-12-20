import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const safetySchema = z.object({
	isSafe: z
		.boolean()
		.describe(
			"True if the content is safe, False if it violates safety policies."
		),
	reason: z
		.string()
		.optional()
		.describe(
			"Short reason if unsafe (e.g. 'Harassment', 'Sexual Content', 'Hate Speech')."
		),
});

export async function checkContentSafety(
	text: string
): Promise<{ isSafe: boolean; reason?: string }> {
	try {
		if (!text || typeof text !== "string" || text.trim().length === 0) {
			return { isSafe: false, reason: "Empty or invalid input" };
		}
		// ตัด Text ยาวๆ ออกบ้างเพื่อความเร็ว (Gemini รับได้เยอะมาก แต่ส่งไปเยอะก็รอนาน)
		const sampleText = text.slice(0, 5000);

		const result = await generateObject({
			model: google("gemini-2.0-flash"),
			schema: safetySchema,
			abortSignal: AbortSignal.timeout(10000),
			prompt: `
        You are a strict AI Content Moderator for an education platform in Thailand.
        
        Analyze the following text (which may be in Thai or English) for inappropriate content:
        1. Harassment / Bullying (การคุกคาม, การกลั่นแกล้ง)
        2. Hate Speech / Discrimination (วาจาเกลียดชัง)
        3. Sexual Content / Nudity (เนื้อหาทางเพศ)
        4. Violence / Self-Harm (ความรุนแรง, การทำร้ายร่างกาย)
        5. Severe Profanity (คำหยาบคายรุนแรงที่ไม่เหมาะสมในบริบทการศึกษา)

        **Context:** This is for creating educational quizzes. 
        - General academic topics (biology, history, wars) are ALLOWED.
        - Mild negative words in a storytelling context are ALLOWED.
        - Direct insults to users or hate speech are PROHIBITED.

        Text to analyze:
        "${sampleText}"
      `,
			temperature: 0, // ตั้งเป็น 0 เพื่อความแม่นยำสูงสุด
		});

		return result.object;
	} catch (error) {
		console.error("Gemini Safety Check Error:", error);
		return { isSafe: false, reason: "Safety check unavailable" };
	}
}
