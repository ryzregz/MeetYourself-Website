"use client";

import { CSSProperties, HTMLAttributes, ReactNode, useState } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  padding?: number;
  interactive?: boolean;
  style?: CSSProperties;
}

/**
 * Card — surface container. Optional header (title/subtitle/actions) and
 * footer. `padding` controls body inset; `interactive` adds hover elevation.
 */
export function Card({
  children,
  title,
  subtitle,
  actions,
  footer,
  padding = 20,
  interactive = false,
  style,
  ...rest
}: CardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-card)",
        transition:
          "box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)",
        transform: hover ? "translateY(-1px)" : "none",
        cursor: interactive ? "pointer" : "default",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {(title || actions) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: `16px ${padding}px`,
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {title && (
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-h4)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--text-strong)",
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--text-muted)",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: `14px ${padding}px`,
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--gray-50)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
