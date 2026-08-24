import Image from "next/image";
import Link from "next/link";
import { Avatar, Badge, Button, Card, Input, Tag } from "@/components/ui";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { testimonials } from "@/lib/data";
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
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px 28px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <Badge tone="brand" variant="soft">
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
            Greatness in <span style={{ color: "var(--primary-600)" }}>YOU</span>.
          </h1>
          <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--text-body)", maxWidth: 520 }}>
            Meet Yourself Academy is Mwenda Itumbiri&rsquo;s home for mindset coaching &mdash; live webinars, recorded
            sessions, and books that help you name your reality so it stops running you.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <Link href="/webinars">
              <Button variant="primary" size="lg">
                Register for this week&rsquo;s webinar
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Browse the shop
              </Button>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>38+</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Webinars hosted</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>12.4k</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Community followers</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}>1,200+</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Books &amp; ebooks sold</div>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 480 }}>
          <Image
            src="/assets/logo-transparent.png"
            alt="Meet Yourself Academy"
            width={574}
            height={370}
            style={{ display: "block", width: "100%", maxWidth: 420, height: "auto", objectFit: "contain" }}
          />
        </div>
      </section>

      {/* Free webinar promo */}
      <section style={{ background: "var(--gray-900)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            {nextWebinar && nextWebinarSchedule ? (
              <>
                <Badge tone="brand" variant="solid" dot>
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
          </div>
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
        </div>
      </section>

      {/* Recent recordings */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {featuredRecordings.map((rec) => (
            <Card key={rec.id} interactive padding={0}>
              <div style={{ position: "relative", height: 170 }}>
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
          ))}
        </div>
      </section>

      {/* Coach bio */}
      <section style={{ background: "var(--gray-50)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)", maxWidth: 300 }}>
              <Image
                src="/assets/mwenda-photo.jpg"
                alt="Mwenda Itumbiri, The Meet Yourself Coach and Author"
                width={1066}
                height={1600}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
              The coach
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
              Mwenda Itumbiri
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>The Meet Yourself Coach &amp; Author</p>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-body)", maxWidth: 560 }}>
              Mwenda has spent over a decade helping people name the stories they tell themselves, so those stories
              stop running their lives. Through weekly webinars, published books, and one-on-one coaching, he guides
              students toward clarity, freedom, and intention.
            </p>
            <Link href="/about" style={{ display: "inline-block", marginTop: 20, fontSize: 14, fontWeight: 600 }}>
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Shop preview */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {featuredBooks.map((book) => (
            <Card key={book.id} interactive padding={0}>
              <div style={{ height: 230, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
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
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "var(--gray-50)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
              What students say
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>Testimonials</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {testimonials.map((t) => (
              <Card key={t.name}>
                <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.7, color: "var(--text-body)" }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={t.name} size="md" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: "var(--gray-900)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            Get new webinars and book releases in your inbox
          </h2>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--gray-300)" }}>One short email a week. No spam, ever.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
