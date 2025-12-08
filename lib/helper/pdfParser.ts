import PDFParser from "pdf2json";

// ฟังก์ชันสำหรับแกะ Text ออกจาก Buffer
export function parsePDF(
	buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
	return new Promise((resolve, reject) => {
		const parser = new PDFParser(null, true); // 1 หมายถึงเอาเฉพาะ Text

		parser.on("pdfParser_dataError", (errData) => reject(errData));

		parser.on("pdfParser_dataReady", (pdfData) => {
			// ดึงข้อความดิบ (Raw Text)
			const text = parser.getRawTextContent();
			// หรือถ้าอยากได้ clean กว่านี้อาจจะต้อง loop pageData แต่ rawText มักเพียงพอสำหรับ Vector Search
			const pageCount = pdfData.Pages.length;
			resolve({ text, pageCount });
		});

		parser.parseBuffer(buffer);
	});
}
