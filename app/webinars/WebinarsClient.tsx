"use client";

import Image from "next/image";
import { useState } from "react";
import type { Recording, Webinar } from "@prisma/client";
import { Alert, Badge, Button, Card, Dialog, Input, Tabs, Tag } from "@/components/ui";
import { formatMonthDay, formatRecordingDate, formatWebinarSchedule } from "@/lib/format";
import { getOfficeViewerUrl, getYoutubeEmbedUrl, isPubliclyReachableHost, toAbsoluteUrl } from "@/lib/media";

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

function endTime(startsAt: Date, durationMin: number): string {
  return formatWebinarSchedule(new Date(startsAt.getTime() + durationMin * 60_000)).timePart;
}

export function WebinarsClient({
  upcomingWebinars,
  recordings,
}: {
  upcomingWebinars: Webinar[];
  recordings: Recording[];
}) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(upcomingWebinars[0]?.id ?? null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [activeRec, setActiveRec] = useState<Recording | null>(null);

  const isUpcoming = activeTab === "upcoming";
  const isLibrary = activeTab === "library";
  const selectedWebinar = upcomingWebinars.find((w) => w.id === selectedWebinarId) ?? upcomingWebinars[0] ?? null;
  const schedule = selectedWebinar ? formatWebinarSchedule(selectedWebinar.startsAt) : null;

  function selectAndScrollToRegister(webinarId: string) {
    setSelectedWebinarId(webinarId);
    setRegistered(false);
    setRegisterError(null);
    scrollToRegister();
  }

  async function handleRegister() {
    if (!selectedWebinar) return;
    setRegisterError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/webinars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webinarId: selectedWebinar.id, fullName, email, phone: phone || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Registration failed. Please try again.");
      }
      setRegistered(true);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      {/* Hero + register */}
      <section style={{ background: "var(--gray-900)", padding: "72px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 40, alignItems: "center" }}>
          <div>
            {selectedWebinar && schedule ? (
              <>
                <Badge tone="brand" variant="solid" dot>
                  FREE WEBINAR &middot; {schedule.datePart.toUpperCase()} &middot; {schedule.timePart}&ndash;
                  {endTime(selectedWebinar.startsAt, selectedWebinar.durationMin)} EAT
                </Badge>
                <h1 style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#fff" }}>
                  {selectedWebinar.title}
                </h1>
                <p style={{ margin: "14px 0 0", fontSize: 16, color: "var(--gray-300)", maxWidth: 480 }}>
                  {selectedWebinar.description ??
                    "Join Mwenda Itumbiri, The Meet Yourself Coach & Author, live — bring your questions."}
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Date</div>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{schedule.datePart}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Time</div>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
                      {schedule.timePart} &ndash; {endTime(selectedWebinar.startsAt, selectedWebinar.durationMin)} EAT
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-500)", fontWeight: 600 }}>Format</div>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{selectedWebinar.format}</div>
                  </div>
                </div>
              </>
            ) : (
              <h1 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 32, color: "#fff" }}>
                No upcoming webinars right now — check back soon.
              </h1>
            )}
          </div>
          <div id="register" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--gray-800)", borderRadius: "var(--radius-xl)", padding: 24 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-400)", fontWeight: 600 }}>
              Reserve your seat
            </div>
            <p style={{ margin: "8px 0 0", color: "var(--gray-200)", fontSize: 15 }}>
              Walk away with a new perspective that transforms how you live, lead, and relate.
            </p>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Full name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Email address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone (for reminders)" placeholder="07xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button variant="primary" fullWidth disabled={!selectedWebinar || submitting} onClick={handleRegister}>
                {submitting ? "Saving…" : "Save my seat"}
              </Button>
              {registerError && <Alert tone="error">{registerError}</Alert>}
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
          {upcomingWebinars.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No upcoming webinars scheduled right now.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
              {upcomingWebinars.map((w) => {
                const { month, day } = formatMonthDay(w.startsAt);
                return (
                  <Card key={w.id}>
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
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--primary-700)" }}>{month}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--primary-700)" }}>{day}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{w.title}</h3>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{formatWebinarSchedule(w.startsAt).combined}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => selectAndScrollToRegister(w.id)}>
                        Register
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {isLibrary && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {recordings.map((rec) => (
              <Card key={rec.id} interactive padding={0}>
                <div>
                  <div style={{ position: "relative", height: 170 }}>
                    <Image src={rec.coverUrl} alt={rec.title} fill style={{ objectFit: "cover" }} />
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
                      {rec.durationLabel}
                    </span>
                  </div>
                  <div style={{ padding: 18 }}>
                    <Tag>{rec.topic}</Tag>
                    <h3 style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{rec.title}</h3>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{formatRecordingDate(rec.recordedAt)}</div>
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

      <Dialog
        open={activeRec != null}
        onClose={() => setActiveRec(null)}
        title={activeRec?.title}
        width={activeRec?.sourceType === "ppt" ? 900 : activeRec?.sourceType === "youtube" ? 720 : 640}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {activeRec?.sourceType === "youtube" && activeRec.youtubeUrl && getYoutubeEmbedUrl(activeRec.youtubeUrl) ? (
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <iframe
                src={getYoutubeEmbedUrl(activeRec.youtubeUrl)!}
                title={activeRec.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          ) : activeRec?.sourceType === "ppt" && activeRec.pptUrl ? (
            typeof window !== "undefined" && isPubliclyReachableHost(window.location.hostname) ? (
              <iframe
                src={getOfficeViewerUrl(toAbsoluteUrl(activeRec.pptUrl))}
                title={activeRec.title}
                style={{ width: "100%", height: 520, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  padding: 24,
                  borderRadius: "var(--radius-md)",
                  background: "var(--gray-50)",
                  border: "1px dashed var(--border-default)",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Presentation preview isn&rsquo;t available on {window.location.hostname} — Microsoft&rsquo;s viewer
                can only reach a publicly deployed site. It&rsquo;ll work once this is live.
              </div>
            )
          ) : (
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
          )}

          {activeRec?.sourceType === "youtube" && activeRec.youtubeUrl && (
            <a href={activeRec.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600 }}>
              Watch on YouTube &rarr;
            </a>
          )}

          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>
            {activeRec ? formatRecordingDate(activeRec.recordedAt) : ""}
          </p>
        </div>
      </Dialog>
    </div>
  );
}
