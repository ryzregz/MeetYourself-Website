import { CSSProperties, HTMLAttributes } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "away" | "offline";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  status?: AvatarStatus | null;
  style?: CSSProperties;
}

const SIZES: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
const FONTS: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 14, lg: 16, xl: 22 };
const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "var(--success-500)",
  away: "var(--warning-500)",
  offline: "var(--gray-400)",
};
// Deterministic tint palette, picked from a hash of the name.
const PALETTE: [string, string][] = [
  ["var(--primary-100)", "var(--primary-700)"],
  ["var(--success-50)", "var(--success-600)"],
  ["var(--warning-50)", "var(--warning-600)"],
  ["var(--info-50)", "var(--info-600)"],
  ["var(--error-50)", "var(--error-600)"],
];

/**
 * Avatar — user/entity representation. Renders an image when `src` is given,
 * otherwise initials derived from `name`. Optional presence indicator.
 */
export function Avatar({ name = "", src = null, size = "md", status = null, style, ...rest }: AvatarProps) {
  const dim = SIZES[size];
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const [bg, fg] = PALETTE[hash % PALETTE.length];

  return (
    <span style={{ position: "relative", display: "inline-flex", width: dim, height: dim, ...style }} {...rest}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar source is arbitrary/unknown at build time
        <img src={src} alt={name} style={{ width: dim, height: dim, borderRadius: "50%", objectFit: "cover", display: "block" }} />
      ) : (
        <span
          style={{
            width: dim,
            height: dim,
            borderRadius: "50%",
            background: bg,
            color: fg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-sans)",
            fontWeight: "var(--weight-semibold)",
            fontSize: FONTS[size],
          }}
        >
          {initials || "?"}
        </span>
      )}
      {status && (
        <span
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: Math.max(8, dim * 0.28),
            height: Math.max(8, dim * 0.28),
            borderRadius: "50%",
            background: STATUS_COLORS[status],
            border: "2px solid var(--surface-card)",
          }}
        />
      )}
    </span>
  );
}
