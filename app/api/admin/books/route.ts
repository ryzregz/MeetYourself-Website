import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mediaUrlSchema } from "@/lib/media";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  format: z.enum(["Ebook", "Physical book"]),
  tone: z.enum(["brand", "neutral"]).default("brand"),
  priceKes: z.coerce.number().int().positive("Price must be a positive number"),
  blurb: z.string().min(1, "Description is required"),
  coverUrl: mediaUrlSchema("Upload a cover image first"),
  isActive: z.coerce.boolean().default(true),
});

export async function GET() {
  try {
    const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(books);
  } catch (error) {
    console.error("[api/admin/books GET]", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookSchema.parse(body);
    const book = await prisma.book.create({
      data: { ...parsed, physical: parsed.format === "Physical book" },
    });
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/books POST]", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
