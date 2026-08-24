"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() || url);
  } catch {
    return url;
  }
}

export function PptUploadField({
  value,
  onChange,
  pathPrefix,
}: {
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
      form.append("kind", "ppt");
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
        Presentation file (.ppt / .pptx)
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: "var(--text-link)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}
          >
            {fileNameFromUrl(value)}
          </a>
        ) : (
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>No file uploaded</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </Button>
      </div>
      {error && <span style={{ fontSize: 12, color: "var(--color-error)" }}>{error}</span>}
    </div>
  );
}
