import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Card, Input, Tag } from "@/components/ui";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Reveal } from "@/components/site/Reveal";
import { AnimatedNumber } from "@/components/site/AnimatedNumber";
import { formatKes, formatRecordingDate, formatWebinarSchedule } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredRecordings, featuredBooks, nextWebinar] = await Promise.all([
    prisma.recording.findMany({ where: { isPublished: true }, orderBy: { recordedAt: "desc" }, take: 3 }),
    prisma.book.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.webinar.findFirst({ where: { status: "upcoming" }, orderBy: { startsAt: "asc" } }),
  ]);
  const nextWebinarSchedule = nextWebinar ? formatWebinarSchedule(nextWebinar.startsAt) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--gradient-hero-glow)", pointerEvents: "none" }} />
        {/* Decorative corner sparkles, echoing the reference layout's diamond accents */}
        <div aria-hidden style={{ position: "absolute", top: 28, left: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, opacity: 0.35, pointerEvents: "none" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, background: "var(--primary-400)", transform: "rotate(45deg)" }} />
          ))}
        </div>
        <div aria-hidden style={{ position: "absolute", bottom: 24, right: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, opacity: 0.35, pointerEvents: "none" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 1, background: "var(--primary-400)", transform: "rotate(45deg)" }} />
          ))}
        </div>
        <div
          style={{
            position: "relative",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "56px 28px",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          <Reveal>
            <Badge tone="brand" variant="solid" style={{ height: 32, padding: "0 14px", fontSize: 12 }}>
              LIVE WEBINARS · EBOOKS · BOOKS
            </Badge>
            <h1
              style={{
                margin: "18px 0 0",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: 52,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--text-strong)",
              }}
            >
              Unveil. Unleash.
              <br />
              Greatness in <span className="gradient-text">YOU</span>.
            </h1>
            <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--text-body)", maxWidth: 520 }}>
              Meet Yourself Academy is Mwenda Itumbiri&rsquo;s home for mindset coaching &mdash; live webinars, recorded
              sessions, and books that help you name your reality so it stops running you.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <Link href="/webinars">
                <Button
                  variant="primary"
                  size="lg"
                  style={{ borderRadius: "var(--radius-full)", paddingRight: 10 }}
                  iconRight={
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", color: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                      ↗
                    </span>
                  }
                >
                  Register for this week&rsquo;s webinar
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  style={{ borderRadius: "var(--radius-full)", paddingRight: 10 }}
                  iconRight={
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--gray-900)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                      ↗
                    </span>
                  }
                >
                  Browse the shop
                </Button>
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>
                  <AnimatedNumber value={38} suffix="+" />
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Webinars hosted</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>
                  <AnimatedNumber value={12.4} decimals={1} suffix="k" />
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Community followers</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>
                  <AnimatedNumber value={1200} suffix="+" />
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Books &amp; ebooks sold</div>
              </div>
            </div>
          </Reveal>
          <Reveal delayMs={150}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 480 }}>
              {/* Soft backdrop circle behind the photo, matching the reference's coloured disc */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 30%, var(--primary-100), var(--primary-200) 70%)",
                }}
              />
              {/* Small dashed-trail accent, echoing the reference's paper-plane doodle */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 24,
                  left: "14%",
                  width: 1,
                  height: 90,
                  borderLeft: "2px dashed var(--primary-300)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 8,
                  left: "calc(14% - 11px)",
                  width: 24,
                  height: 24,
                  background: "var(--gray-900)",
                  transform: "rotate(45deg)",
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: 340,
                  height: 340,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "6px solid var(--surface-card)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--surface-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 48,
                }}
              >
                <Image
                  src="/assets/logo-transparent.png"
                  alt="Meet Yourself Academy"
                  width={574}
                  height={370}
                  style={{ display: "block", width: "100%", height: "auto", objectFit: "contain" }}
                />
              </div>
              {/* Floating stat card overlapping the photo's corner */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  right: "8%",
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "2px solid var(--primary-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-strong)",
                  }}
                >
                  <AnimatedNumber value={38} suffix="+" />
                </div>
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Webinars hosted</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Free webinar promo */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--gray-900)", padding: "56px 28px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 80% 20%, rgba(232, 169, 61, 0.16), transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <Reveal>
            {nextWebinar && nextWebinarSchedule ? (
              <>
                <Badge tone="brand" variant="solid" dot pulse>
                  FREE WEBINAR &middot; {nextWebinarSchedule.datePart.toUpperCase()} &middot; {nextWebinarSchedule.timePart}
                </Badge>
                <h2 style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#fff" }}>
                  {nextWebinar.title}
                </h2>
                <p style={{ margin: "14px 0 0", fontSize: 16, color: "var(--gray-300)", maxWidth: 480 }}>
                  {nextWebinar.description ??
                    "How to name your reality so it stops running you — with Mwenda Itumbiri, The Meet Yourself Coach & Author."}
                </p>
              </>
            ) : (
              <>
                <Badge tone="brand" variant="solid">
                  WEBINARS
                </Badge>
                <h2 style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#fff" }}>
                  New webinars are announced regularly
                </h2>
                <p style={{ margin: "14px 0 0", fontSize: 16, color: "var(--gray-300)", maxWidth: 480 }}>
                  Check back soon, or subscribe below to hear about the next one first.
                </p>
              </>
            )}
            <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
              {["Shift Your Mindset", "Reclaim Your Power", "Design Your Life"].map((label) => (
                <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start", maxWidth: 150 }}>
                  <span style={{ fontSize: 13, color: "var(--gray-200)", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Link href="/webinars">
                <Button variant="primary" size="lg">
                  Register now &mdash; it&rsquo;s free
                </Button>
              </Link>
            </div>
          </Reveal>
          <Reveal delayMs={150}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--gray-800)", borderRadius: "var(--radius-xl)", padding: 24 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-400)", fontWeight: 600 }}>Join live</div>
              <p style={{ margin: "8px 0 0", color: "var(--gray-200)", fontSize: 15 }}>
                Walk away with a new perspective that transforms how you live, lead, and relate.
              </p>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <Input label="Full name" placeholder="Your name" />
                <Input label="Email address" type="email" placeholder="you@email.com" />
                <Link href="/webinars" style={{ display: "block" }}>
                  <Button variant="primary" fullWidth>
                    Save my seat
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Recent recordings */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 28px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
                Webinar library
              </div>
              <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
                Recent recordings
              </h2>
            </div>
            <Link href="/webinars" style={{ fontSize: 14, fontWeight: 600 }}>
              View all recordings &rarr;
            </Link>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {featuredRecordings.map((rec, i) => (
            <Reveal key={rec.id} delayMs={i * 90}>
              <Card interactive padding={0}>
                <div className="hover-zoom-frame" style={{ position: "relative", height: 170 }}>
                  <Image src={rec.coverUrl} alt={rec.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: 18 }}>
                  <Tag>{rec.topic}</Tag>
                  <h3 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{rec.title}</h3>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {formatRecordingDate(rec.recordedAt)} &middot; {rec.durationLabel}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Coach bio */}
      <section style={{ background: "var(--gray-50)", padding: "36px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Card padding={0} style={{ position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "var(--gradient-hero-glow)", pointerEvents: "none" }} />
            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 44,
                alignItems: "center",
                padding: "44px 44px",
              }}
            >
              <Reveal>
                <div style={{ position: "relative", maxWidth: 240 }}>
                  {/* Soft glow behind the frame, echoing the About page's photo treatment */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: -14,
                      background: "var(--gradient-brand)",
                      borderRadius: "var(--radius-xl)",
                      opacity: 0.3,
                      filter: "blur(26px)",
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    {/* Pre-cropped variant of mwenda-photo1.jpg — the source photo has a lot
                        of plain studio backdrop above and to the left of him. */}
                    <Image
                      src="/assets/mwenda-photo1-coach.jpg"
                      alt="Mwenda Itumbiri, The Meet Yourself Coach and Author"
                      width={825}
                      height={1302}
                      style={{ display: "block", width: "100%", height: "auto" }}
                    />
                  </div>
                  {/* Floating badge overlapping the frame's corner */}
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      bottom: -16,
                      right: -20,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "var(--surface-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-lg)",
                      padding: "10px 14px",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--primary-50)",
                        color: "var(--primary-600)",
                        flexShrink: 0,
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6.5c-1.5-1-3.8-1.5-6-1.5v13c2.2 0 4.5.5 6 1.5 1.5-1 3.8-1.5 6-1.5v-13c-2.2 0-4.5.5-6 1.5Z" />
                        <path d="M12 6.5v13" />
                      </svg>
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, color: "var(--text-strong)" }}>
                      Author of
                      <br />
                      MEET YOURSELF
                    </span>
                  </div>
                </div>
              </Reveal>
              <Reveal delayMs={150}>
                <Badge tone="brand" variant="solid" style={{ height: 28, padding: "0 12px", fontSize: 11 }}>
                  THE COACH
                </Badge>
                <h2 style={{ margin: "14px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
                  Mwenda <span className="gradient-text">Itumbiri</span>
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>The Meet Yourself Coach &amp; Author</p>
                <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-body)", maxWidth: 520 }}>
                  MEET YOURSELF is an invitation to step away from the noise and reconnect with the most important
                  person in your life &mdash; you. Through honest reflection and practical steps, Mwenda Itumbiri helps
                  you discover your authentic self and unlock the greatness that&rsquo;s always been there.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
                  <Tag>20+ yrs HR leadership</Tag>
                  <Tag>MBA, HRM</Tag>
                </div>
                <Link href="/about" style={{ display: "inline-block", marginTop: 24 }}>
                  <Button
                    variant="outline"
                    iconRight={
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--gray-900)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                        ↗
                      </span>
                    }
                  >
                    Read the full story
                  </Button>
                </Link>
              </Reveal>
            </div>
          </Card>
        </div>
      </section>

      {/* Shop preview */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 28px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>Shop</div>
              <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
                Ebooks &amp; physical books
              </h2>
              <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-body)", maxWidth: 560 }}>
                In a world full of noise, comparison, and pressure to fit in, MEET YOURSELF is a timely invitation to
                step away from the crowd and reconnect with the most important person in your life &mdash; You.
              </p>
            </div>
            <Link href="/shop" style={{ fontSize: 14, fontWeight: 600 }}>
              Visit the shop &rarr;
            </Link>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {featuredBooks.map((book, i) => (
            <Reveal key={book.id} delayMs={i * 90}>
              <Card interactive padding={0}>
                <div className="hover-zoom-frame" style={{ height: 230, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    width={935}
                    height={1386}
                    style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto", display: "block", boxShadow: "var(--shadow-lg)" }}
                  />
                </div>
                <div style={{ padding: 18 }}>
                  <Badge tone={book.tone === "neutral" ? "neutral" : "brand"} variant="soft">
                    {book.format}
                  </Badge>
                  <h3 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{book.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(book.priceKes)}</div>
                    <Link href={`/shop?buy=${book.id}`}>
                      <Button variant="primary" size="sm">
                        Buy now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: "var(--gray-900)", padding: "56px 28px" }}>
        <Reveal>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
              Get new webinars and book releases in your inbox
            </h2>
            <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--gray-300)" }}>One short email a week. No spam, ever.</p>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
