"use client";

import { CSSProperties, MouseEvent, ReactNode, useEffect } from "react";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
  style?: CSSProperties;
}

/**
 * Dialog — centered modal with scrim. Renders only when `open`. Provide
 * `title`, body `children`, and a `footer` (usually action buttons). Calls
 * `onClose` on scrim click or Escape.
 */
export function Dialog({ open, onClose, title, children, footer, width = 480, style }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onScrimMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      onMouseDown={onScrimMouseDown}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        style={{
          width,
          maxWidth: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          ...style,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "20px 24px 0" }}>
          {title && (
            <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "var(--text-h3)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
              {title}
            </h2>
          )}
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", padding: 4, lineHeight: 1, marginLeft: "auto" }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div style={{ padding: "12px 24px 20px", overflowY: "auto", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--text-body)", lineHeight: "var(--leading-normal)" }}>
          {children}
        </div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", background: "var(--gray-50)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
