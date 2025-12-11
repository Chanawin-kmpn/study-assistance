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

		// ถ้ายังไม่ได้ Login
		if (!userId) {
			// 1. ถ้าเป็น API Route -> ห้าม Redirect! ให้ตอบ JSON 401
			if (isApiRoute(req)) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}

			// 2. ถ้าเป็นหน้าเว็บปกติ -> ให้ Redirect ไปหน้า Login
			auth.protect();
		}
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
