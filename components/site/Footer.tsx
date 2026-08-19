import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS: { label: string; path: React.ReactNode }[] = [
  {
    label: "Instagram",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    label: "YouTube",
    path: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5 15 12l-5 2.5Z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 10v7M7 7v.01M11 17v-4.5a2 2 0 0 1 4 0V17M11 10v7" />
      </>
    ),
  },
  {
    label: "Facebook",
    path: <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3Z" />,
  },
];

const EXPLORE_LINKS = [
  { href: "/webinars", label: "Webinars" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Mwenda" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--gray-900)", borderTop: "1px solid var(--gray-800)", color: "var(--gray-400)", padding: "72px 28px 28px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "6px 12px", display: "flex", alignItems: "center" }}>
              <Image src="/assets/logo-transparent.png" alt="Meet Yourself Academy" height={40} width={62} style={{ height: 40, width: "auto", display: "block" }} />
            </div>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
            Unveil. Unleash. Greatness in you. Coaching webinars, ebooks and books by Mwenda Itumbiri.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} style={{ color: "var(--gray-400)" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75">
                  {s.path}
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Explore</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            {EXPLORE_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: "var(--gray-400)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <span style={{ color: "var(--gray-400)" }}>hello@meetyourselfacademy.com</span>
            <span style={{ color: "var(--gray-400)" }}>+254 700 000 000</span>
            <span style={{ color: "var(--gray-400)" }}>Nairobi, Kenya</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 12 }}>@meetyourselfcoach</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--gray-500)" }}>www.meetyourselfacademy.com</p>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1240,
          margin: "40px auto 0",
          paddingTop: 20,
          borderTop: "1px solid var(--gray-800)",
          fontSize: 12,
          color: "var(--gray-500)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>&copy; 2026 Meet Yourself Academy. All rights reserved.</span>
        <span style={{ fontStyle: "italic" }}>Name it right. Live it right.</span>
      </div>
    </footer>
  );
}
