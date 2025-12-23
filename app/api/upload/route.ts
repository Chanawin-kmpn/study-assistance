import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request): Promise<NextResponse> {
	const body = (await req.json()) as HandleUploadBody;
	try {
		const response = await handleUpload({
			body,
			request: req,
			onBeforeGenerateToken: async () => {
				const { userId } = await auth();

				if (!userId) {
					throw new Error("Unauthorized");
				}

				return {
					allowedContentTypes: ["application/pdf"],
					tokenPayload: JSON.stringify({ userId }),
					addRandomSuffix: true,
				};
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				const { userId } = JSON.parse(tokenPayload!);
				console.log(`Upload completed by user ${userId}:`, blob.url);
			},
		});

		return NextResponse.json(response);
	} catch (error) {
		console.error("Blob Upload Handler Error:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 401 }
		);
	}
}
