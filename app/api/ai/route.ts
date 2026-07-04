import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ text: "" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await Tesseract.recognize(buffer, "eng+ron", {
      logger: () => {},
    });

    return NextResponse.json({
      text: result.data.text || "",
    });
  } catch (err) {
    return NextResponse.json({ text: "" });
  }
}