"use client";

import Image from "next/image";
import { useState } from "react";
import { Alert, Badge, Button, Card, Dialog, Input, Tabs, Tag } from "@/components/ui";
import { recordings, upcomingWebinars } from "@/lib/data";
import type { Recording } from "@/lib/types";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "library", label: "Recordings library" },
];

function scrollToRegister() {
  const el = document.getElementById("register");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function WebinarsClient() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [registered, setRegistered] = useState(false);
  const [activeRec, setActiveRec] = useState<Recording | null>(null);

  const isUpcoming = activeTab === "upcoming";
  const isLibrary = activeTab === "library";

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Hero + register */}
      <section style={{ background: "var(--gray-900)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 40, alignItems: "center" }}>
          <div>
            <Badge tone="brand" variant="solid" dot>
              FREE WEBINAR &middot; TUE AUG 4, 2026 &middot; 7:00&ndash;8:00 PM EAT
            </Badge>
            <h1 style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#fff" }}>
              Whatever You Call It,
              <br />
              That Is <span style={{ color: "var(--primary-400)" }}>What It Is</span>
            </h1>
            <p style={{ margin: "14px 0 0", fontSize: 16, color: "var(--gray-300)", maxWidth: 480 }}>
              How to name your reality so it stops running you &mdash; with Mwenda Itumbiri, The Meet Yourself Coach
              &amp; Author.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Date</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>Tue, Aug 4 2026</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Time</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>7:00 &ndash; 8:00 PM EAT</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Format</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>Live &amp; online</div>
              </div>
            </div>
          </div>
          <div id="register" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--gray-800)", borderRadius: "var(--radius-xl)", padding: 24 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-400)", fontWeight: 600 }}>
              Reserve your seat
            </div>
            <p style={{ margin: "8px 0 0", color: "var(--gray-200)", fontSize: 15 }}>
              Walk away with a new perspective that transforms how you live, lead, and relate.
            </p>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Full name" placeholder="Your name" />
              <Input label="Email address" type="email" placeholder="you@email.com" />
              <Input label="Phone (for reminders)" placeholder="07xx xxx xxx" />
              <Button variant="primary" fullWidth onClick={() => setRegistered(true)}>
                Save my seat
              </Button>
              {registered && (
                <Alert tone="success">You&rsquo;re registered. A calendar invite and join link will follow by email.</Alert>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 28px 32px" }}>
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />
      </section>

      {isUpcoming && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {upcomingWebinars.map((w) => (
              <Card key={w.title}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-md)",
                      background: "var(--primary-50)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--primary-700)" }}>{w.month}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--primary-700)" }}>{w.day}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{w.title}</h3>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{w.time}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={scrollToRegister}>
                    Register
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {isLibrary && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {recordings.map((rec) => (
              <Card key={rec.id} interactive padding={0}>
                <div>
                  <div style={{ position: "relative", height: 170 }}>
                    <Image src={rec.cover} alt={rec.title} fill style={{ objectFit: "cover" }} />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        background: "rgba(15,23,42,0.75)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      {rec.duration}
                    </span>
                  </div>
                  <div style={{ padding: 18 }}>
                    <Tag>{rec.topic}</Tag>
                    <h3 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{rec.title}</h3>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{rec.date}</div>
                    <Button variant="secondary" size="sm" fullWidth onClick={() => setActiveRec(rec)}>
                      Watch recording
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Dialog open={activeRec != null} onClose={() => setActiveRec(null)} title={activeRec?.title} width={640}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              width: "100%",
              height: 320,
              borderRadius: "var(--radius-md)",
              background: "var(--gray-100)",
              border: "1px dashed var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Recording plays here
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{activeRec?.date}</p>
        </div>
      </Dialog>
    </div>
  );
}
