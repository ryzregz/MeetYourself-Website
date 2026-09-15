"use client";

import { useState } from "react";
import type { SiteSettings } from "@prisma/client";
import { Alert, Button, Card, Input, Textarea } from "@/components/ui";

interface StatForm {
  value: string;
  decimals: string;
  suffix: string;
  label: string;
}

interface FormState {
  heroBadge: string;
  heroHeadline: string;
  heroSubtext: string;
  heroStats: StatForm[];
  aboutAuthorBio: string[];
  aboutUsText: string[];
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  socialFacebook: string;
  googleAnalyticsId: string;
}

// The settings row's Json columns are only ever written by this form's own
// PATCH request, so we trust the shape here rather than re-validating it —
// zod on the API route is the actual guard.
function toFormState(settings: SiteSettings): FormState {
  const stats = (Array.isArray(settings.heroStats) ? settings.heroStats : []) as Array<{
    value: number;
    decimals?: number;
    suffix?: string;
    label: string;
  }>;
  const authorBio = (Array.isArray(settings.aboutAuthorBio) ? settings.aboutAuthorBio : []) as string[];
  const aboutUs = (Array.isArray(settings.aboutUsText) ? settings.aboutUsText : []) as string[];

  return {
    heroBadge: settings.heroBadge,
    heroHeadline: settings.heroHeadline,
    heroSubtext: settings.heroSubtext,
    heroStats: stats.map((s) => ({
      value: String(s.value),
      decimals: s.decimals != null ? String(s.decimals) : "",
      suffix: s.suffix ?? "",
      label: s.label,
    })),
    aboutAuthorBio: authorBio.length ? authorBio : [""],
    aboutUsText: aboutUs.length ? aboutUs : [""],
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactLocation: settings.contactLocation,
    socialInstagram: settings.socialInstagram ?? "",
    socialYoutube: settings.socialYoutube ?? "",
    socialLinkedin: settings.socialLinkedin ?? "",
    socialFacebook: settings.socialFacebook ?? "",
    googleAnalyticsId: settings.googleAnalyticsId ?? "",
  };
}

const sectionStyle = { display: "flex", flexDirection: "column" as const, gap: 16 };
const rowStyle = { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 };

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)" }}>{title}</div>
      {hint && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function ParagraphListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>{label}</div>
      {values.map((paragraph, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Textarea
            style={{ flex: 1 }}
            rows={3}
            value={paragraph}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={values.length <= 1}
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" style={{ alignSelf: "flex-start" }} onClick={() => onChange([...values, ""])}>
        + Add paragraph
      </Button>
    </div>
  );
}

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState<FormState>(() => toFormState(settings));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function updateStat(i: number, patch: Partial<StatForm>) {
    const next = [...form.heroStats];
    next[i] = { ...next[i], ...patch };
    update("heroStats", next);
  }

  async function handleSave() {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const payload = {
        heroBadge: form.heroBadge,
        heroHeadline: form.heroHeadline,
        heroSubtext: form.heroSubtext,
        heroStats: form.heroStats.map((s) => ({
          value: Number(s.value),
          decimals: s.decimals ? Number(s.decimals) : undefined,
          suffix: s.suffix || undefined,
          label: s.label,
        })),
        aboutAuthorBio: form.aboutAuthorBio.filter((p) => p.trim().length > 0),
        aboutUsText: form.aboutUsText.filter((p) => p.trim().length > 0),
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        contactLocation: form.contactLocation,
        socialInstagram: form.socialInstagram,
        socialYoutube: form.socialYoutube,
        socialLinkedin: form.socialLinkedin,
        socialFacebook: form.socialFacebook,
        googleAnalyticsId: form.googleAnalyticsId,
      };
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save settings");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text-strong)" }}>General Information</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>
            Content shown across the public site — saved here, read live on the site.
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="error">{error}</Alert>
        </div>
      )}
      {saved && !error && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="success">Saved — the public site now reflects these changes.</Alert>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Hero content */}
        <Card>
          <div style={sectionStyle}>
            <SectionHeading title="Hero content" hint="The top banner on the Home page." />
            <Input label="Badge text" value={form.heroBadge} onChange={(e) => update("heroBadge", e.target.value)} />
            <Input label="Headline" value={form.heroHeadline} onChange={(e) => update("heroHeadline", e.target.value)} />
            <Textarea
              label="Subtext"
              rows={3}
              value={form.heroSubtext}
              onChange={(e) => update("heroSubtext", e.target.value)}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 10 }}>Stats row</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {form.heroStats.map((stat, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr 0.7fr 1.6fr auto", gap: 8, alignItems: "flex-end" }}>
                    <Input label={i === 0 ? "Value" : undefined} value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} />
                    <Input label={i === 0 ? "Suffix" : undefined} placeholder="+" value={stat.suffix} onChange={(e) => updateStat(i, { suffix: e.target.value })} />
                    <Input
                      label={i === 0 ? "Decimals" : undefined}
                      placeholder="0"
                      value={stat.decimals}
                      onChange={(e) => updateStat(i, { decimals: e.target.value })}
                    />
                    <Input label={i === 0 ? "Label" : undefined} value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} />
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={form.heroStats.length <= 1}
                      onClick={() => update("heroStats", form.heroStats.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => update("heroStats", [...form.heroStats, { value: "", decimals: "", suffix: "", label: "" }])}
                >
                  + Add stat
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* About the author */}
        <Card>
          <div style={sectionStyle}>
            <SectionHeading title="About the author" hint="The bio shown at the top of the About page." />
            <ParagraphListEditor
              label="Bio paragraphs"
              values={form.aboutAuthorBio}
              onChange={(next) => update("aboutAuthorBio", next)}
            />
          </div>
        </Card>

        {/* About us */}
        <Card>
          <div style={sectionStyle}>
            <SectionHeading title="About us" hint="Credentials & background, shown further down the About page." />
            <ParagraphListEditor label="Paragraphs" values={form.aboutUsText} onChange={(next) => update("aboutUsText", next)} />
          </div>
        </Card>

        {/* Contact details */}
        <Card>
          <div style={sectionStyle}>
            <SectionHeading title="Contact details" hint="Shown in the site footer." />
            <div style={rowStyle}>
              <Input label="Email" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
              <Input label="Phone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
            </div>
            <Input label="Location" value={form.contactLocation} onChange={(e) => update("contactLocation", e.target.value)} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginTop: 4 }}>Social links</div>
            <div style={rowStyle}>
              <Input
                label="Instagram"
                placeholder="https://instagram.com/..."
                value={form.socialInstagram}
                onChange={(e) => update("socialInstagram", e.target.value)}
              />
              <Input
                label="YouTube"
                placeholder="https://youtube.com/..."
                value={form.socialYoutube}
                onChange={(e) => update("socialYoutube", e.target.value)}
              />
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/..."
                value={form.socialLinkedin}
                onChange={(e) => update("socialLinkedin", e.target.value)}
              />
              <Input
                label="Facebook"
                placeholder="https://facebook.com/..."
                value={form.socialFacebook}
                onChange={(e) => update("socialFacebook", e.target.value)}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Leave a social link blank to hide its icon in the footer.</div>
          </div>
        </Card>

        {/* Analytics */}
        <Card>
          <div style={sectionStyle}>
            <SectionHeading title="Analytics" hint="Optional — leave blank to skip tracking entirely." />
            <Input
              label="Google Analytics measurement ID"
              placeholder="G-XXXXXXXXXX"
              value={form.googleAnalyticsId}
              onChange={(e) => update("googleAnalyticsId", e.target.value)}
              hint="From your GA4 property's Data Streams settings."
            />
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
