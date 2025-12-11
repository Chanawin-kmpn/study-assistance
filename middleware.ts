import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
	"/chat(.*)",
	"/api/chat(.*)",
	"/api/documents(.*)",
	"/api/upload(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware((auth, req) => {
	// เช็คว่าเป็น Route ที่ต้องป้องกันหรือไม่
	if (isProtectedRoute(req)) {
		const userId = auth();

		if (!userId) {
			if (isApiRoute(req)) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}

			auth.protect();
		}
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
