import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type StatTone = "brand" | "success" | "warning" | "error" | "info";

export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaDirection?: "up" | "down";
  icon?: ReactNode;
  tone?: StatTone;
  style?: CSSProperties;
}

const TONES: Record<StatTone, [string, string]> = {
  brand: ["var(--primary-50)", "var(--primary-600)"],
  success: ["var(--success-50)", "var(--success-600)"],
  warning: ["var(--warning-50)", "var(--warning-600)"],
  error: ["var(--error-50)", "var(--error-600)"],
  info: ["var(--info-50)", "var(--info-600)"],
};

/** StatCard — KPI tile: label, large value, optional delta with direction. */
export function StatCard({
  label,
  value,
  delta,
  deltaDirection = "up",
  icon,
  tone = "brand",
  style,
  ...rest
}: StatCardProps) {
  const [iconBg, iconFg] = TONES[tone];
  const up = deltaDirection === "up";
  const deltaColor = up ? "var(--color-success)" : "var(--color-error)";

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-sm)",
            fontWeight: "var(--weight-medium)",
            color: "var(--text-muted)",
          }}
        >
          {label}
        </span>
        {icon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: iconBg,
              color: iconFg,
            }}
          >
            <span style={{ width: 18, height: 18, display: "inline-flex" }}>{icon}</span>
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-display-sm)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-strong)",
            letterSpacing: "var(--tracking-snug)",
          }}
        >
          {value}
        </span>
        {delta != null && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-sm)",
              fontWeight: "var(--weight-semibold)",
              color: deltaColor,
            }}
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: up ? "none" : "rotate(180deg)" }}
            >
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
