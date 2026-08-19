"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/webinars", label: "Webinars" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--gray-900)",
        borderBottom: "1px solid var(--gray-800)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 28px",
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "6px 12px", display: "flex", alignItems: "center" }}>
            <Image src="/assets/logo-transparent.png" alt="Meet Yourself Academy" height={48} width={74} style={{ height: 48, width: "auto", display: "block" }} />
          </div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: active ? "var(--primary-400)" : "var(--gray-300)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/webinars">
          <Button variant="primary" style={{ height: 40 }}>
            Join free webinar
          </Button>
        </Link>
      </div>
    </header>
  );
}
