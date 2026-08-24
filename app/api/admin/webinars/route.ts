import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const webinarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  startsAt: z.coerce.date(),
  durationMin: z.coerce.number().int().positive().default(60),
  format: z.string().min(1).default("Live & online"),
  status: z.enum(["upcoming", "past", "cancelled"]).default("upcoming"),
});

export async function GET() {
  try {
    const webinars = await prisma.webinar.findMany({
      orderBy: { startsAt: "asc" },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json(webinars);
  } catch (error) {
    console.error("[api/admin/webinars GET]", error);
    return NextResponse.json({ error: "Failed to fetch webinars" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = webinarSchema.parse(body);
    const webinar = await prisma.webinar.create({ data });
    return NextResponse.json(webinar, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/webinars POST]", error);
    return NextResponse.json({ error: "Failed to create webinar" }, { status: 500 });
  }
}
