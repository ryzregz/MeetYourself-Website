"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";

export function ImageUploadField({
  label,
  value,
  onChange,
  pathPrefix,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  pathPrefix: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("pathPrefix", pathPrefix);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }
      const body = await res.json();
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body-sm)",
          fontWeight: "var(--weight-medium)",
          color: "var(--text-strong)",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded-image preview, not a next/image-managed asset path
          <img
            src={value}
            alt=""
            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-md)",
              background: "var(--gray-100)",
              border: "1px dashed var(--border-default)",
            }}
          />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </Button>
      </div>
      {error && <span style={{ fontSize: 12, color: "var(--color-error)" }}>{error}</span>}
    </div>
  );
}
