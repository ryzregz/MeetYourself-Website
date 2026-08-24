"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Recording } from "@prisma/client";
import { Alert, Badge, Button, Dialog, Input, Select } from "@/components/ui";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PptUploadField } from "@/components/admin/PptUploadField";
import { adminStyles } from "@/components/admin/adminStyles";
import { formatRecordingDate, fromDateInputValue, toDateInputValue } from "@/lib/format";

const PUBLISH_OPTIONS = [
  { value: "true", label: "Published" },
  { value: "false", label: "Hidden" },
];

const SOURCE_TYPE_OPTIONS = [
  { value: "none", label: "None — cover image only" },
  { value: "youtube", label: "YouTube video" },
  { value: "ppt", label: "PowerPoint presentation" },
];

const SOURCE_TYPE_LABEL: Record<string, string> = { youtube: "Video", ppt: "Slides", none: "—" };

interface FormState {
  title: string;
  topic: string;
  recordedAtLocal: string;
  durationLabel: string;
  coverUrl: string;
  isPublished: string;
  sourceType: string;
  youtubeUrl: string;
  pptUrl: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  topic: "Coaching Session",
  recordedAtLocal: "",
  durationLabel: "",
  coverUrl: "",
  isPublished: "true",
  sourceType: "none",
  youtubeUrl: "",
  pptUrl: "",
};

export function RecordingsManager({ recordings }: { recordings: Recording[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(rec: Recording) {
    setEditingId(rec.id);
    setForm({
      title: rec.title,
      topic: rec.topic,
      recordedAtLocal: toDateInputValue(rec.recordedAt),
      durationLabel: rec.durationLabel,
      coverUrl: rec.coverUrl,
      isPublished: String(rec.isPublished),
      sourceType: rec.sourceType,
      youtubeUrl: rec.youtubeUrl ?? "",
      pptUrl: rec.pptUrl ?? "",
    });
    setError(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.coverUrl) {
      setError("Upload a cover image first");
      return;
    }
    if (form.sourceType === "youtube" && !form.youtubeUrl.trim()) {
      setError("Enter a YouTube URL");
      return;
    }
    if (form.sourceType === "ppt" && !form.pptUrl) {
      setError("Upload a presentation file first");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        topic: form.topic,
        recordedAt: fromDateInputValue(form.recordedAtLocal).toISOString(),
        durationLabel: form.durationLabel,
        coverUrl: form.coverUrl,
        isPublished: form.isPublished === "true",
        sourceType: form.sourceType,
        youtubeUrl: form.sourceType === "youtube" ? form.youtubeUrl.trim() : null,
        pptUrl: form.sourceType === "ppt" ? form.pptUrl : null,
      };
      const res = await fetch(editingId ? `/api/admin/recordings/${editingId}` : "/api/admin/recordings", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save recording");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save recording");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recording?")) return;
    const res = await fetch(`/api/admin/recordings/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Recordings</h1>
        <Button variant="primary" onClick={openCreate}>
          + New recording
        </Button>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th} />
              <th style={adminStyles.th}>Title</th>
              <th style={adminStyles.th}>Recorded</th>
              <th style={adminStyles.th}>Duration</th>
              <th style={adminStyles.th}>Media</th>
              <th style={adminStyles.th}>Status</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {recordings.map((rec) => (
              <tr key={rec.id}>
                <td style={adminStyles.td}>
                  <div style={{ position: "relative", width: 56, height: 40, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                    <Image src={rec.coverUrl} alt="" fill style={{ objectFit: "cover" }} />
                  </div>
                </td>
                <td style={adminStyles.td}>{rec.title}</td>
                <td style={adminStyles.td}>{formatRecordingDate(rec.recordedAt)}</td>
                <td style={adminStyles.td}>{rec.durationLabel}</td>
                <td style={adminStyles.td}>
                  {rec.sourceType === "none" ? (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  ) : (
                    <Badge tone={rec.sourceType === "youtube" ? "error" : "brand"} variant="soft">
                      {SOURCE_TYPE_LABEL[rec.sourceType]}
                    </Badge>
                  )}
                </td>
                <td style={adminStyles.td}>{rec.isPublished ? "Published" : "Hidden"}</td>
                <td style={adminStyles.td}>
                  <div style={adminStyles.actionsRow}>
                    <Button variant="outline" size="sm" onClick={() => openEdit(rec)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rec.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {recordings.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={7}>
                  No recordings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? "Edit recording" : "New recording"}
        width={480}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={submitting} onClick={handleSave}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          <Input
            label="Recorded on"
            type="date"
            value={form.recordedAtLocal}
            onChange={(e) => setForm({ ...form, recordedAtLocal: e.target.value })}
            required
          />
          <Input
            label="Duration"
            placeholder="e.g. 52 min"
            value={form.durationLabel}
            onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
            required
          />
          <ImageUploadField label="Cover image" value={form.coverUrl} onChange={(url) => setForm({ ...form, coverUrl: url })} pathPrefix="recordings" />
          <Select label="Visibility" options={PUBLISH_OPTIONS} value={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.value })} />

          <Select
            label="Inline playback"
            options={SOURCE_TYPE_OPTIONS}
            value={form.sourceType}
            onChange={(e) => setForm({ ...form, sourceType: e.target.value })}
          />
          {form.sourceType === "youtube" && (
            <Input
              label="YouTube URL"
              placeholder="https://www.youtube.com/watch?v=…"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              required
            />
          )}
          {form.sourceType === "ppt" && (
            <PptUploadField value={form.pptUrl} onChange={(url) => setForm({ ...form, pptUrl: url })} pathPrefix="recordings" />
          )}

          {error && <Alert tone="error">{error}</Alert>}
        </div>
      </Dialog>
    </div>
  );
}
