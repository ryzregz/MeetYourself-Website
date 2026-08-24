import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const deliveryUpdateSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered"]),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = deliveryUpdateSchema.parse(body);
    const now = new Date();
    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        status,
        shippedAt: status === "shipped" || status === "delivered" ? now : undefined,
        deliveredAt: status === "delivered" ? now : undefined,
      },
    });
    return NextResponse.json(delivery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/deliveries/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update delivery" }, { status: 500 });
  }
}
