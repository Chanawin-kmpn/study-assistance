import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";

const quizSchema = z.object({
	topic: z.string(),
	question: z.array(
		z.object({
			question: z.string(),
			options: z.array(z.string()),
			correctAnswer: z.string(),
			explanation: z.string(),
		})
	),
});

export async function POST(req: Request) {
	try {
		const { context } = await req.json();

		const result = await generateObject({
			model: google("gemini-flash-latest"),
			schema: quizSchema,
			prompt: `Create a 5-question multiple choice quiz based on this content: ${context}. The language should be Thai.`,
		});

		return result.toJsonResponse();
	} catch (error) {
		console.error("Error creating quiz...");
		return new Response("Failed to create quiz", { status: 500 });
	}
}
