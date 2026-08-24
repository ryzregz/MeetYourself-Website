import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { delivery: true, book: { select: { title: true, coverUrl: true } } },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[api/admin/orders GET]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
