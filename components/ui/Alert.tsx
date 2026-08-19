import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type AlertTone = "success" | "warning" | "error" | "info";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
  style?: CSSProperties;
}

const TONE_MAP: Record<AlertTone, { fg: string; bg: string; bd: string; icon: string }> = {
  success: { fg: "var(--success-600)", bg: "var(--color-success-bg)", bd: "var(--color-success-border)", icon: "M20 6L9 17l-5-5" },
  warning: {
    fg: "var(--warning-600)",
    bg: "var(--color-warning-bg)",
    bd: "var(--color-warning-border)",
    icon: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  },
  error: {
    fg: "var(--error-600)",
    bg: "var(--color-error-bg)",
    bd: "var(--color-error-border)",
    icon: "M12 8v4M12 16h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
  },
  info: {
    fg: "var(--info-600)",
    bg: "var(--color-info-bg)",
    bd: "var(--color-info-border)",
    icon: "M12 16v-4M12 8h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
  },
};

/**
 * Alert — inline contextual message. `tone` sets color + default icon; pass
 * `title`, body `children`, optional `onClose` and `action`.
 */
export function Alert({ tone = "info", title, children, onClose, action, style, ...rest }: AlertProps) {
  const t = TONE_MAP[tone];
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: t.bg,
        border: `1px solid ${t.bd}`,
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke={t.fg}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <path d={t.icon} />
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {title && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-md)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--text-strong)",
            }}
          >
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--text-body)" }}>
            {children}
          </div>
        )}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 2,
            lineHeight: 1,
            height: "fit-content",
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
