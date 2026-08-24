import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const webinarId = searchParams.get("webinarId") ?? undefined;

    const registrations = await prisma.webinarRegistration.findMany({
      where: webinarId ? { webinarId } : undefined,
      orderBy: { registeredAt: "desc" },
      include: { webinar: { select: { title: true, startsAt: true } } },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("[api/admin/registrations GET]", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
