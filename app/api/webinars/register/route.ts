import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  webinarId: z.string().min(1),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const webinar = await prisma.webinar.findUnique({ where: { id: data.webinarId } });
    if (!webinar || webinar.status !== "upcoming") {
      return NextResponse.json({ error: "This webinar is no longer open for registration" }, { status: 400 });
    }

    const registration = await prisma.webinarRegistration.create({ data });
    return NextResponse.json({ id: registration.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/webinars/register POST]", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
