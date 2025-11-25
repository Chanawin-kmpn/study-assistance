import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function getCurrentUser() {
	try {
		const { userId, sessionId } = await auth();

		if (!userId || !sessionId) throw new Error("Unauthorized");
		const email = `${userId}@placeholder.com`;

		const user = await prisma.user.upsert({
			where: { id: userId! },
			update: {},
			create: {
				id: userId!,
				email,
			},
		});

		return user;
	} catch (error) {
		console.error("Failed to get user", error);
	}
}
