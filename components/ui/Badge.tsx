import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "info";
export type BadgeVariant = "solid" | "soft";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: CSSProperties;
}

const TONES: Record<BadgeTone, { solid: [string, string]; soft: [string, string]; dot: string }> = {
  neutral: { solid: ["var(--gray-600)", "#fff"], soft: ["var(--gray-100)", "var(--gray-700)"], dot: "var(--gray-500)" },
  brand: { solid: ["var(--primary-500)", "#fff"], soft: ["var(--primary-50)", "var(--primary-700)"], dot: "var(--primary-500)" },
  success: { solid: ["var(--success-500)", "#fff"], soft: ["var(--success-50)", "var(--success-600)"], dot: "var(--success-500)" },
  warning: { solid: ["var(--warning-500)", "#fff"], soft: ["var(--warning-50)", "var(--warning-600)"], dot: "var(--warning-500)" },
  error: { solid: ["var(--error-500)", "#fff"], soft: ["var(--error-50)", "var(--error-600)"], dot: "var(--error-500)" },
  info: { solid: ["var(--info-500)", "#fff"], soft: ["var(--info-50)", "var(--info-600)"], dot: "var(--info-500)" },
};

/** Badge — compact status/label pill. */
export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  dot = false,
  style,
  ...rest
}: BadgeProps) {
  const t = TONES[tone];
  const [bg, fg] = t[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 22,
        padding: "0 8px",
        background: bg,
        color: fg,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-body-sm)",
        fontWeight: "var(--weight-semibold)",
        lineHeight: 1,
        borderRadius: "var(--radius-full)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: variant === "solid" ? "currentColor" : t.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}
