// providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// สำคัญ: กำหนดว่าข้อมูลจะ "สดใหม่" นานแค่ไหน (เช่น 5 นาที)
						// ภายใน 5 นาทีนี้ ถ้า user กลับมาหน้าเดิม จะไม่ยิง API เลย ใช้ cache ล้วนๆ
						staleTime: 1000 * 60 * 5,

						// เก็บข้อมูลในหน่วยความจำนานแค่ไหนก่อนลบทิ้ง (เช่น 30 นาที)
						gcTime: 1000 * 60 * 30,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
