import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/admin-auth";

const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SAFE_SELECT = { id: true, email: true, name: true, isActive: true, createdAt: true } as const;

export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" }, select: SAFE_SELECT });
    return NextResponse.json(users);
  } catch (error) {
    console.error("[api/admin/users GET]", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = createAdminSchema.parse(body);

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, name, passwordHash },
      select: SAFE_SELECT,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/admin/users POST]", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}
