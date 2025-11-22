import { prisma } from "./lib/prisma";

async function main() {
	// Create a new user with a post
	const user = await prisma.user.upsert({
		where: { id: "user_2bN_demo" },
		update: {},
		create: {
			id: "user_2bN_demo",
			email: "demo@example.com",
		},
	});

	console.log("Created/Found user:", user);

	const doc1 = await prisma.document.create({
		data: {
			userId: user.id,
			name: "คู่มือการใช้งานระบบ.pdf",
			url: "https://example.com/docs/manual.pdf",
		},
	});

	const doc2 = await prisma.document.create({
		data: {
			userId: user.id,
			name: "ใบเสนอราคา-ลูกค้าA.pdf",
			url: "https://example.com/docs/quote-customer-a.pdf",
		},
	});

	console.log("Created documents:", doc1.id, doc2.id);

	// 3) สร้าง Chat ที่ผูกกับ Document (คุยเฉพาะเรื่องไฟล์)
	const chatForDoc1 = await prisma.chat.create({
		data: {
			userId: user.id,
			documentId: doc1.id,
			title: "ถามเรื่องคู่มือการใช้งาน",
		},
	});

	// 4) สร้าง Chat ที่ไม่ได้ผูกกับ Document (คุยรวม ๆ)
	const generalChat = await prisma.chat.create({
		data: {
			userId: user.id,
			// documentId: null  // ไม่ต้องใส่ก็ได้ เพราะเป็น optional
			title: "แชททั่วไป",
		},
	});

	console.log("Created chats:", chatForDoc1.id, generalChat.id);

	// 5) สร้าง Message ตัวอย่างในแต่ละ Chat
	await prisma.message.createMany({
		data: [
			{
				chatId: chatForDoc1.id,
				role: "user",
				content: "ช่วยสรุปหัวข้อสำคัญในคู่มือให้หน่อย",
			},
			{
				chatId: chatForDoc1.id,
				role: "assistant",
				content:
					"คู่มือแบ่งออกเป็น 3 ส่วนหลัก คือ การเริ่มต้นใช้งาน, ฟีเจอร์หลัก, และการแก้ไขปัญหาเบื้องต้น...",
			},
			{
				chatId: generalChat.id,
				role: "user",
				content: "สวัสดี ระบบนี้ทำอะไรได้บ้าง?",
			},
			{
				chatId: generalChat.id,
				role: "assistant",
				content:
					"ระบบนี้สามารถอัปโหลดไฟล์ PDF แล้วให้ AI ช่วยตอบคำถามจากเนื้อหาในไฟล์ได้ครับ",
			},
		],
	});

	console.log("Seed messages created");
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log("Seeding completed ✅");
	})
	.catch(async (e) => {
		console.error("Seeding error ❌", e);
		await prisma.$disconnect();
		process.exit(1);
	});
