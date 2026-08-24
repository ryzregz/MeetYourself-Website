"use client";

import { useState } from "react";
import { Alert, Button, Input } from "@/components/ui";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div style={{ marginTop: 24, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
        <Alert tone="success">You&rsquo;re subscribed. Look out for our next email.</Alert>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Input placeholder="you@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button variant="primary" disabled={submitting || !email.trim()} onClick={handleSubmit}>
          {submitting ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <div style={{ marginTop: 10 }}>
          <Alert tone="error">{error}</Alert>
        </div>
      )}
    </div>
  );
}
