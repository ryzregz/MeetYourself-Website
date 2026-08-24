import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const webinarUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  startsAt: z.coerce.date().optional(),
  durationMin: z.coerce.number().int().positive().optional(),
  format: z.string().min(1).optional(),
  status: z.enum(["upcoming", "past", "cancelled"]).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = webinarUpdateSchema.parse(body);
    const webinar = await prisma.webinar.update({ where: { id }, data });
    return NextResponse.json(webinar);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/webinars/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update webinar" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.webinar.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/webinars/[id] DELETE]", error);
    return NextResponse.json({ error: "Failed to delete webinar" }, { status: 500 });
  }
}
