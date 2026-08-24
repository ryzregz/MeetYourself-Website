import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Belt-and-suspenders — `proxy.ts` already redirects unauthenticated requests
  // before they reach here, but a layout that assumes a valid session without
  // checking is one refactor away from being wrong.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-page)" }}>
      <AdminNav name={session.name} email={session.email} />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1240 }}>{children}</main>
    </div>
  );
}
