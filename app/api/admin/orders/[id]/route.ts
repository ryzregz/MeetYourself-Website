import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderUpdateSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "cancelled"]).optional(),
  fulfillmentStatus: z.enum(["pending", "fulfilled"]).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = orderUpdateSchema.parse(body);
    const order = await prisma.order.update({ where: { id }, data, include: { delivery: true } });
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/orders/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
