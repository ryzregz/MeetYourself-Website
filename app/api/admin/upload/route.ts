import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";

const KINDS = {
  image: {
    types: new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]),
    maxBytes: 8 * 1024 * 1024, // 8MB
    error: "Only PNG, JPEG, WebP, or AVIF images are allowed",
    sizeError: "Image must be under 8MB",
  },
  ppt: {
    types: new Set([
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.ms-powerpoint", // legacy .ppt
    ]),
    maxBytes: 40 * 1024 * 1024, // 40MB — presentations run larger than a cover image
    error: "Only .ppt or .pptx files are allowed",
    sizeError: "Presentation must be under 40MB",
  },
} as const;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const pathPrefix = form.get("pathPrefix");
    const kindParam = form.get("kind");
    const kind = KINDS[kindParam === "ppt" ? "ppt" : "image"];

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!kind.types.has(file.type)) {
      return NextResponse.json({ error: kind.error }, { status: 400 });
    }
    if (file.size > kind.maxBytes) {
      return NextResponse.json({ error: kind.sizeError }, { status: 400 });
    }

    const url = await uploadFile(file, typeof pathPrefix === "string" && pathPrefix ? pathPrefix : "uploads");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[api/admin/upload POST]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
