"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Book } from "@prisma/client";
import { Alert, Badge, Button, Dialog, Input, Select } from "@/components/ui";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminStyles } from "@/components/admin/adminStyles";
import { formatKes } from "@/lib/format";

const FORMAT_OPTIONS = ["Ebook", "Physical book"];
const TONE_OPTIONS = [
  { value: "brand", label: "Brand (amber badge)" },
  { value: "neutral", label: "Neutral (grey badge)" },
];
const ACTIVE_OPTIONS = [
  { value: "true", label: "Active — visible in shop" },
  { value: "false", label: "Inactive — hidden" },
];

interface FormState {
  title: string;
  format: string;
  tone: string;
  priceKes: string;
  blurb: string;
  coverUrl: string;
  isActive: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  format: "Ebook",
  tone: "brand",
  priceKes: "",
  blurb: "",
  coverUrl: "",
  isActive: "true",
};

export function BooksManager({ books }: { books: Book[] }) {
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

  function openEdit(book: Book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      format: book.format,
      tone: book.tone,
      priceKes: String(book.priceKes),
      blurb: book.blurb,
      coverUrl: book.coverUrl,
      isActive: String(book.isActive),
    });
    setError(null);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.coverUrl) {
      setError("Upload a cover image first");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        format: form.format,
        tone: form.tone,
        priceKes: Number(form.priceKes),
        blurb: form.blurb,
        coverUrl: form.coverUrl,
        isActive: form.isActive === "true",
      };
      const res = await fetch(editingId ? `/api/admin/books/${editingId}` : "/api/admin/books", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save book");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this title? Existing orders that reference it are kept.")) return;
    const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Failed to delete — it may already have orders against it. Try marking it Inactive instead.");
    }
  }

  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Books &amp; Ebooks</h1>
        <Button variant="primary" onClick={openCreate}>
          + New title
        </Button>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th} />
              <th style={adminStyles.th}>Title</th>
              <th style={adminStyles.th}>Format</th>
              <th style={adminStyles.th}>Price</th>
              <th style={adminStyles.th}>Status</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td style={adminStyles.td}>
                  <div style={{ position: "relative", width: 40, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--gray-900)" }}>
                    <Image src={book.coverUrl} alt="" fill style={{ objectFit: "contain" }} />
                  </div>
                </td>
                <td style={adminStyles.td}>{book.title}</td>
                <td style={adminStyles.td}>
                  <Badge tone={book.tone === "neutral" ? "neutral" : "brand"} variant="soft">
                    {book.format}
                  </Badge>
                </td>
                <td style={adminStyles.td}>{formatKes(book.priceKes)}</td>
                <td style={adminStyles.td}>{book.isActive ? "Active" : "Inactive"}</td>
                <td style={adminStyles.td}>
                  <div style={adminStyles.actionsRow}>
                    <Button variant="outline" size="sm" onClick={() => openEdit(book)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(book.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={6}>
                  No titles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? "Edit title" : "New title"}
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
          <Select label="Format" options={FORMAT_OPTIONS} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} />
          <Select label="Badge tone" options={TONE_OPTIONS} value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} />
          <Input
            label="Price (KES)"
            type="number"
            value={form.priceKes}
            onChange={(e) => setForm({ ...form, priceKes: e.target.value })}
            required
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)" }}
            >
              Description
            </label>
            <textarea
              value={form.blurb}
              onChange={(e) => setForm({ ...form, blurb: e.target.value })}
              rows={3}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body-md)",
                color: "var(--text-strong)",
                padding: "10px 12px",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                resize: "vertical",
              }}
            />
          </div>
          <ImageUploadField label="Cover image" value={form.coverUrl} onChange={(url) => setForm({ ...form, coverUrl: url })} pathPrefix="books" />
          <Select label="Status" options={ACTIVE_OPTIONS} value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })} />
          {error && <Alert tone="error">{error}</Alert>}
        </div>
      </Dialog>
    </div>
  );
}
