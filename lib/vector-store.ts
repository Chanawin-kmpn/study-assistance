import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

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
