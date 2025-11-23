import { embeddings, getVectorStore } from "@/lib/vector-store";
import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
console.log(
	"GOOGLE_GENERATIVE_AI_API_KEY:",
	process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

		if (!messages || messages.length === 0) {
			return new Response("No messages provided", { status: 400 });
		}

		// ✅ หา last user message แล้วดึง text ออกมาจาก parts
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
			return new Response("No user question found", { status: 400 });
		}

		// 🔍 ทำ RAG จาก question
		const vectorStore = await getVectorStore();
		const queryEmbedding = await embeddings.embedQuery(question);

		const queryResponse = await vectorStore.query({
			vector: queryEmbedding,
			topK: 3,
			includeMetadata: true,
		});

		const context =
			queryResponse.matches
				?.map((match) => match.metadata?.text)
				.filter(Boolean)
				.join("\n\n---\n\n") ?? "";

		const systemPrompt = `
You are a helpful study assistant for students.
Use the following context to answer the user's question.
If the answer is not in the context, say you don't know or that the data does not exist in the uploaded files.

Context:
${context}
    `.trim();

		const model = google("gemini-flash-latest");

		// ✅ รวม system + history แล้ว convertToModelMessages ตามที่วิดีโอบอก
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
		});

		// ✅ ใช้ toUIMessageStreamResponse() ตามคลิป Chat with AI
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
