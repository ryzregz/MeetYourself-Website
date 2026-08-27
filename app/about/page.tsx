import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Card } from "@/components/ui";
import { Reveal } from "@/components/site/Reveal";
import { AnimatedNumber } from "@/components/site/AnimatedNumber";

const approach = [
  { title: "Shift Your Mindset", body: "Discover the power of naming your reality intentionally." },
  { title: "Reclaim Your Power", body: "Change the internal labels that keep you stuck." },
  { title: "Design Your Life", body: "Live with clarity, freedom, and intention." },
];

const credentialsCopy = [
  "Mwenda Itumbiri holds an MBA in Human Resource Management (University of Nairobi), a BSc in Biochemistry (Egerton University), and multiple professional qualifications in HR, insurance, and coaching. He is a full member of IHRM, the Insurance Institute of Kenya (AIIK), and the Institute of Directors Kenya (IOD). His early service as a missionary with YWAM and FOCUS in Kenya and Norway continues to shape his faith-driven leadership today.",
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Bio */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--surface-card)" }}>
        <div style={{ position: "absolute", inset: 0, background: "var(--gradient-hero-glow)", pointerEvents: "none" }} />
        <div
          style={{
            position: "relative",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "64px 28px 72px",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div style={{ position: "relative", maxWidth: 330, justifySelf: "end" }}>
              {/* Layer 1 — soft glow behind the frame */}
              <div
                style={{
                  position: "absolute",
                  inset: -18,
                  background: "var(--gradient-brand)",
                  borderRadius: "var(--radius-xl)",
                  opacity: 0.35,
                  filter: "blur(28px)",
                  zIndex: 0,
                }}
              />
              {/* Layer 2 — the photo itself */}
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
                <Image
                  src="/assets/mwenda-photo1.jpg"
                  alt="Mwenda Itumbiri, The Meet Yourself Coach and Author"
                  width={984}
                  height={1472}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
              {/* Layer 3 — a floating stat card overlapping the frame's corner */}
              <div
                style={{
                  position: "absolute",
                  zIndex: 2,
                  bottom: -22,
                  right: -28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "14px 18px",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary-600)", letterSpacing: "-0.01em" }}>
                  <AnimatedNumber value={10} suffix="+" />
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.3, color: "var(--text-muted)", maxWidth: 76 }}>Years of coaching impact</div>
              </div>
            </div>
          </Reveal>
          <Reveal delayMs={150}>
            <Badge tone="brand" variant="soft">
              THE MEET YOURSELF COACH &amp; AUTHOR
            </Badge>
            <h1 style={{ margin: "16px 0 0", fontSize: 42, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text-strong)" }}>
              Mwenda <span className="gradient-text">Itumbiri</span>
            </h1>
            <p style={{ margin: "18px 0 0", fontSize: 16, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>
              Mwenda Itumbiri is a leader, board advisor, and author with over two decades of People &amp; Culture
              leadership across insurance, development finance, international NGOs, and public service &mdash;
              known for building high-performing teams and unlocking human potential.
            </p>
            <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>
              His life mission is helping people discover their authentic selves and live purposefully. He has
              mentored hundreds of youth across Nairobi&rsquo;s Mathare, Huruma, and Korogocho areas, and remains a
              sought-after speaker on emotional intelligence, HR leadership, and governance.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Link href="/webinars">
                <Button variant="primary" size="lg">
                  Join a webinar
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  Read the books
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 28px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
              The approach
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
              Shift. Reclaim. Design.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {approach.map((a, i) => (
            <Reveal key={a.title} delayMs={i * 90}>
              <Card interactive>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--gradient-brand)",
                    color: "var(--text-on-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 14,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{a.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{a.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section style={{ background: "var(--gray-50)", padding: "64px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
                Credentials
              </div>
              <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
                Background &amp; qualifications
              </h2>
            </div>
          </Reveal>
          <Reveal delayMs={90}>
            <Card style={{ padding: 40 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {credentialsCopy.map((paragraph, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.8, color: "var(--text-body)" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--gray-900)", padding: "64px 28px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 0%, rgba(232, 169, 61, 0.18), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <Reveal>
          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Ready to name your reality?</h2>
            <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--gray-300)" }}>
              Join the next free webinar and see what changes when you call it right.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/webinars">
                <Button variant="primary" size="lg">
                  Reserve a seat
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
