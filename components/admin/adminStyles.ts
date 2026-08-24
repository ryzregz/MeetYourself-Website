import type { CSSProperties } from "react";

// Shared inline-style building blocks for the admin portal's list pages —
// keeps every entity page's table/header markup visually consistent without
// a fully generic <DataTable> abstraction (each page's columns differ enough
// that a generic table would just be config indirection).
export const adminStyles: Record<string, CSSProperties> = {
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-strong)" },
  tableWrap: {
    background: "var(--surface-card)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--text-muted)",
    borderBottom: "1px solid var(--border-subtle)",
    background: "var(--gray-50)",
  },
  td: { padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-body)", verticalAlign: "middle" },
  emptyState: { padding: "40px 16px", textAlign: "center", color: "var(--text-muted)" },
  actionsRow: { display: "flex", gap: 8 },
};
