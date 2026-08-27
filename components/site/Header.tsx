"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/webinars", label: "Webinars" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        transition: "background var(--duration-slow) var(--ease-standard), box-shadow var(--duration-slow) var(--ease-standard), border-color var(--duration-slow) var(--ease-standard)",
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
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "6px 12px", display: "flex", alignItems: "center", boxShadow: "var(--shadow-sm)" }}>
            <Image src="/assets/logo-transparent.png" alt="Meet Yourself Academy" height={48} width={74} style={{ height: 48, width: "auto", display: "block" }} />
          </div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flex: "1 1 auto" }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  padding: "4px 0",
                  color: active ? "var(--primary-600)" : "var(--text-body)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  transition: "color var(--duration-base) var(--ease-standard)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--text-strong)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--text-body)";
                }}
              >
                {link.label}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -6,
                    height: 2,
                    borderRadius: "var(--radius-full)",
                    background: "var(--gradient-brand)",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform var(--duration-base) var(--ease-emphasized)",
                  }}
                />
              </Link>
            );
          })}
        </nav>
        <Link href="/webinars" style={{ flex: "0 0 auto" }}>
          <Button variant="primary" style={{ height: 40, borderRadius: "var(--radius-full)" }}>
            Join free webinar
          </Button>
        </Link>
      </div>
    </header>
  );
}
