import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

type Metadata = {
	text: string;
	source: string;
	userId: string;
	documentId: string;
	url: string;
};

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

const embeddings = new OpenAIEmbeddings({
	model: "text-embedding-3-small",
	apiKey: process.env.OPENAI_API_KEY,
});

export async function getVectorStore() {
	const index = pinecone.Index(process.env.PINECONE_INDEX!);
	return index;
}

export { embeddings };

export async function deleteVectorsByDocumentId(
	documentId: string,
	userId?: string
) {
	const index = await getVectorStore();

	await index.deleteMany(
		userId
			? { documentId: { $eq: documentId }, userId: { $eq: userId } }
			: { documentId: { $eq: documentId } }
	);
}

export async function getContextForQuiz(
	documentId: string,
	requirement?: string
) {
	try {
		const index = await getVectorStore();
		const queryText =
			requirement || "Summarize key concepts, definitions, and important facts";

		const queryVector = await embeddings.embedQuery(queryText);

		const queryResponse = await index.query({
			vector: queryVector,
			topK: 10,
			includeMetadata: true,
			filter: {
				documentId: { $eq: documentId },
			},
		});

		const context = queryResponse.matches
			.map((match) => {
				const metaData = match.metadata as Metadata;
				return metaData?.text || "";
			})
			.filter((text) => text.length > 0)
			.join("\n\n---\n\n");

		return context;
	} catch (error) {
		console.error("Error retrieving context from Pinecone:", error);
		return "";
	}
}
