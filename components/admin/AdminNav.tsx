"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/webinars", label: "Webinars" },
  { href: "/admin/recordings", label: "Recordings" },
  { href: "/admin/books", label: "Books & Ebooks" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/users", label: "Admin Users" },
];

export function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--gray-900)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        gap: 4,
      }}
    >
      <div style={{ padding: "0 8px 20px", fontSize: 15, fontWeight: 700 }}>Meet Yourself Admin</div>
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "9px 12px",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              color: active ? "#fff" : "var(--gray-300)",
              background: active ? "var(--gray-800)" : "transparent",
            }}
          >
            {item.label}
          </Link>
        );
      })}
      <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--gray-800)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{name}</div>
        <div style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 12 }}>{email}</div>
        <Button variant="outline" size="sm" fullWidth onClick={handleLogout} style={{ borderColor: "var(--gray-700)", color: "#fff" }}>
          Log out
        </Button>
      </div>
    </nav>
  );
}
