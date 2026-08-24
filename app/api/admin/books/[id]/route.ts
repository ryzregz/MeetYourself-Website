import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mediaUrlSchema } from "@/lib/media";

const bookUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  format: z.enum(["Ebook", "Physical book"]).optional(),
  tone: z.enum(["brand", "neutral"]).optional(),
  priceKes: z.coerce.number().int().positive().optional(),
  blurb: z.string().min(1).optional(),
  coverUrl: mediaUrlSchema("Upload a cover image first").optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = bookUpdateSchema.parse(body);
    const book = await prisma.book.update({
      where: { id },
      data: {
        ...parsed,
        ...(parsed.format ? { physical: parsed.format === "Physical book" } : {}),
      },
    });
    return NextResponse.json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/books/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/books/[id] DELETE]", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
