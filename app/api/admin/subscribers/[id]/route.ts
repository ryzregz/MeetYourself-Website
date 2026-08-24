import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const subscriberUpdateSchema = z.object({
  status: z.enum(["subscribed", "unsubscribed"]),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = subscriberUpdateSchema.parse(body);
    const subscriber = await prisma.newsletterSubscriber.update({ where: { id }, data });
    return NextResponse.json(subscriber);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/subscribers/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/subscribers/[id] DELETE]", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
