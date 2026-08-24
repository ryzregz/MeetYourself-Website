"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Webinar } from "@prisma/client";
import { Alert, Button, Dialog, Input, Select } from "@/components/ui";
import { adminStyles } from "@/components/admin/adminStyles";
import { formatWebinarSchedule, fromNairobiDatetimeLocal, toNairobiDatetimeLocal } from "@/lib/format";

type WebinarWithCount = Webinar & { _count: { registrations: number } };

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

const FORMAT_OPTIONS = ["Live & online", "In-person", "Live & online + recording"];

interface FormState {
  title: string;
  description: string;
  startsAtLocal: string;
  durationMin: string;
  format: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  startsAtLocal: "",
  durationMin: "60",
  format: "Live & online",
  status: "upcoming",
};

export function WebinarsManager({ webinars }: { webinars: WebinarWithCount[] }) {
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

  function openEdit(w: WebinarWithCount) {
    setEditingId(w.id);
    setForm({
      title: w.title,
      description: w.description ?? "",
      startsAtLocal: toNairobiDatetimeLocal(w.startsAt),
      durationMin: String(w.durationMin),
      format: w.format,
      status: w.status,
    });
    setError(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        startsAt: fromNairobiDatetimeLocal(form.startsAtLocal).toISOString(),
        durationMin: Number(form.durationMin),
        format: form.format,
        status: form.status,
      };
      const res = await fetch(editingId ? `/api/admin/webinars/${editingId}` : "/api/admin/webinars", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save webinar");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save webinar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this webinar? Its registrations will be deleted too.")) return;
    const res = await fetch(`/api/admin/webinars/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Webinars</h1>
        <Button variant="primary" onClick={openCreate}>
          + New webinar
        </Button>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th}>Title</th>
              <th style={adminStyles.th}>When (EAT)</th>
              <th style={adminStyles.th}>Status</th>
              <th style={adminStyles.th}>Registrations</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {webinars.map((w) => (
              <tr key={w.id}>
                <td style={adminStyles.td}>{w.title}</td>
                <td style={adminStyles.td}>{formatWebinarSchedule(w.startsAt).combined}</td>
                <td style={adminStyles.td}>{w.status}</td>
                <td style={adminStyles.td}>
                  <Link href={`/admin/webinars/${w.id}`} style={{ color: "var(--text-link)", fontWeight: 600 }}>
                    {w._count.registrations}
                  </Link>
                </td>
                <td style={adminStyles.td}>
                  <div style={adminStyles.actionsRow}>
                    <Link href={`/admin/webinars/${w.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => openEdit(w)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(w.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {webinars.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={5}>
                  No webinars yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? "Edit webinar" : "New webinar"}
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
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Starts at (East Africa Time)"
            type="datetime-local"
            value={form.startsAtLocal}
            onChange={(e) => setForm({ ...form, startsAtLocal: e.target.value })}
            required
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
          />
          <Select label="Format" options={FORMAT_OPTIONS} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} />
          <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          {error && <Alert tone="error">{error}</Alert>}
        </div>
      </Dialog>
    </div>
  );
}
