/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { embeddings, getVectorStore } from "@/lib/vector-store";
import { ChatMode } from "@/types/types.global";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { streamText, type UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

type ChatRequestBody = {
	messages: UIMessage[];
	documentId?: string;
	chatId?: string;
	mode?: ChatMode;
};

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) return new Response("Unauthorized", { status: 401 });

		const body = (await req.json()) as ChatRequestBody;

		const { messages, documentId, chatId, mode } = body;

		if (!messages || messages.length === 0) {
			return new Response("No messages provided", { status: 400 });
		}

		// หา last user message แล้วดึง text ออกมาจาก parts
		const lastUserMessage = [...messages]
			.reverse()
			.find((m) => m.role === "user");

		const question =
			lastUserMessage?.parts
				?.filter((part) => part.type === "text")
				.map((part) => part.text)
				.join(" ")
				.trim() ?? "";

		if (!question) {
			console.warn("[/api/chat] No user question found");
			return new Response("No user question found", { status: 400 });
		}

		// 🔍 ทำ RAG จาก question
		const vectorStore = await getVectorStore();
		const queryEmbedding = await embeddings.embedQuery(question);

		const queryResponse = await vectorStore.query({
			vector: queryEmbedding,
			topK: 3,
			includeMetadata: true,
			filter: documentId ? { documentId } : undefined,
		});

		const context =
			queryResponse.matches
				?.map((match: any) => match.metadata?.text)
				.filter(Boolean)
				.join("\n\n---\n\n") ?? "";

		let systemPrompt = "";

		if (mode === "summary") {
			// 📝 Summary Mode Prompt: ตรงไปตรงมา กระชับ ช่วยสรุป
			systemPrompt = `
You are an expert academic summarizer.
Your goal is to explain the content from the provided Context clearly, concisely, and accurately.

Context:
${context}

Instructions:
1. Answer the user's question directly using the Context.
2. Use bullet points for lists to make it easy to read.
3. Highlight key terms or important definitions.
4. Do NOT ask follow-up questions unless necessary for clarification.
5. If the context doesn't contain the answer, state that clearly.
`.trim();
		} else {
			// 🎓 Tutor Mode Prompt: โหมดเถียง สอนแบบ Socratic (ตามที่ Skooldio ต้องการ)
			systemPrompt = `
You are an AI Socratic Tutor and Debater designed to foster Critical Thinking.
Your goal is NOT to give direct answers, but to guide the student to discover them through questioning and debate.

Context:
${context}

Instructions:
1. **Role:** Act as a challenging but supportive tutor.
2. **Method:**
   - If the user asks for a fact, don't just give it. Ask: "Based on the text, why do you think that is?"
   - If the user states an opinion, play Devil's Advocate. Ask for evidence from the text.
   - Encourage the user to connect concepts.
3. **Tone:** Intellectual, encouraging, slightly provocative (to spark debate).
4. **Grounding:** Always base your arguments on the provided Context.
5. **Response:** Keep responses short and conversational to encourage back-and-forth interaction.
`.trim();
		}

		const model = google("gemini-flash-latest");

		const result = streamText({
			model,
			messages: convertToModelMessages([
				{
					id: "system-ctx",
					role: "system",
					parts: [{ type: "text", text: systemPrompt }],
				},
				...messages,
			]),
			onFinish: async ({ text }) => {
				if (!chatId) {
					console.warn("[/api/chat] No chatId, skip saving to DB");
					return;
				}

				try {
					// 1) upsert Chat
					const chat = await prisma.chat.upsert({
						where: { id: chatId },
						create: {
							id: chatId,
							userId,
							documentId: documentId ?? null, // ถ้า field เป็น optional
							title: (question || "New Chat").slice(0, 80),
						},
						update: {}, // ตอนนี้ยังไม่อัปเดตอะไรเพิ่ม
					});

					// 2) บันทึก message user + assistant
					await prisma.message.createMany({
						data: [
							{
								chatId: chat.id,
								role: "user",
								content: question,
							},
							{
								chatId: chat.id,
								role: "assistant",
								content: text,
							},
						],
					});
				} catch (dbError) {
					console.error("[/api/chat] DB save error:", dbError);
				}
			},
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error streaming text:", error);

		if (error instanceof Error) {
			return new Response(
				JSON.stringify(
					{
						message: error.message,
						stack: error.stack,
						name: error.name,
					},
					null,
					2
				),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new Response(
			JSON.stringify(
				{
					message: "Unknown error",
					error,
				},
				null,
				2
			),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
