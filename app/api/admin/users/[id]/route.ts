import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const updateAdminSchema = z.object({
  isActive: z.coerce.boolean().optional(),
  name: z.string().min(1).optional(),
});

const SAFE_SELECT = { id: true, email: true, name: true, isActive: true, createdAt: true } as const;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const session = await getAdminSession();
    if (session?.sub === id) {
      return NextResponse.json({ error: "You can't deactivate your own account" }, { status: 400 });
    }

    const body = await request.json();
    const data = updateAdminSchema.parse(body);
    const user = await prisma.adminUser.update({ where: { id }, data, select: SAFE_SELECT });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/users/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 });
  }
}
