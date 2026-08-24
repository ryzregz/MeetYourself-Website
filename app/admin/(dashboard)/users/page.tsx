import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { UsersManager } from "./UsersManager";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, isActive: true, createdAt: true },
  });
  return <UsersManager users={users} currentUserId={session?.sub ?? ""} />;
}
