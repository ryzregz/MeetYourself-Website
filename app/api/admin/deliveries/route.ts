import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: { include: { book: { select: { title: true } } } } },
    });
    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("[api/admin/deliveries GET]", error);
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 });
  }
}
