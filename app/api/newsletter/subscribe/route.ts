import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const subscribeSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { status: "subscribed" },
      create: { email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/newsletter/subscribe POST]", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
