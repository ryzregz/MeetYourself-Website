import Image from "next/image";
import Link from "next/link";
import { Avatar, Badge, Button, Card, StatCard } from "@/components/ui";
import { testimonials } from "@/lib/data";

const approach = [
  { title: "Shift Your Mindset", body: "Discover the power of naming your reality intentionally." },
  { title: "Reclaim Your Power", body: "Change the internal labels that keep you stuck." },
  { title: "Design Your Life", body: "Live with clarity, freedom, and intention." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Bio */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px 28px",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div
          style={{
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
            maxWidth: 330,
            justifySelf: "end",
          }}
        >
          <Image
            src="/assets/mwenda-photo.jpg"
            alt="Mwenda Itumbiri, The Meet Yourself Coach and Author"
            width={1066}
            height={1600}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <Badge tone="brand" variant="soft">
            THE MEET YOURSELF COACH &amp; AUTHOR
          </Badge>
          <h1 style={{ margin: "16px 0 0", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
            Mwenda Itumbiri
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 16, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>
            Mwenda Itumbiri is a multi-gifted leader, board advisor, change agent, and prolific author with over two
            decades of People &amp; Culture leadership across the insurance sector, development finance,
            international NGOs, and public service. Known for his strategic vision and emotional intelligence, he
            excels in building high-performing teams, driving inclusive organisational cultures, and unlocking human
            potential.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>
            Mwenda&rsquo;s life mission is to help people discover their authentic selves, live purposefully, and
            make a lasting impact. His transformative approach, mentorship, and motivational voice have empowered
            many to overcome limitations and pursue meaningful lives. He has mentored hundreds of youth across Kenya,
            particularly in Nairobi&rsquo;s Mathare, Huruma, and Korogocho areas.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>
            A sought-after seminar facilitator, leadership trainer, and media contributor, Mwenda regularly speaks on
            emotional intelligence, human resource leadership, and governance matters.
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
        </div>
      </section>

      {/* Track record */}
      <section style={{ background: "var(--gray-50)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
              Track record
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
              A decade of Meeting Yourself
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            <StatCard label="Years coaching" value="10+" tone="brand" />
            <StatCard label="Webinars hosted" value="38+" tone="brand" />
            <StatCard label="Books & ebooks sold" value="1,200+" tone="brand" />
            <StatCard label="Community followers" value="12.4k" tone="brand" />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
            The approach
          </div>
          <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
            Shift. Reclaim. Design.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {approach.map((a) => (
            <Card key={a.title}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{a.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{a.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 28px 72px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>
            Credentials
          </div>
          <h2 style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
            Qualifications &amp; memberships
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Education
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>
              MBA in Human Resource Management, University of Nairobi. BSc in Biochemistry, Egerton University.
              Multiple professional qualifications in HR, insurance, and coaching.
            </p>
          </div>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Professional memberships
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>
              Full member of IHRM, the Insurance Institute of Kenya (AIIK), and the Institute of Directors Kenya
              (IOD).
            </p>
          </div>
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20, gridColumn: "span 2" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
              Early service
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>
              His early service as a missionary with YWAM and FOCUS in Kenya and Norway continues to shape his
              faith-driven leadership today.
            </p>
          </div>
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

      {/* CTA */}
      <section style={{ background: "var(--gray-900)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Ready to name your reality?</h2>
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
      </section>
    </div>
  );
}
