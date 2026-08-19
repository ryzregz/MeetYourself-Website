"use client";

import { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: CSSProperties;
}

const SIZES: Record<
  ButtonSize,
  { height: number; padding: string; font: string; gap: number; icon: number }
> = {
  sm: { height: 32, padding: "0 12px", font: "var(--text-body-sm)", gap: 6, icon: 14 },
  md: { height: 40, padding: "0 16px", font: "var(--text-body-md)", gap: 8, icon: 16 },
  lg: { height: 48, padding: "0 20px", font: "var(--text-body-lg)", gap: 8, icon: 18 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--color-brand)",
    color: "var(--text-on-brand)",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--gray-100)",
    color: "var(--text-strong)",
    border: "1px solid transparent",
  },
  outline: {
    background: "var(--surface-card)",
    color: "var(--text-body)",
    border: "1px solid var(--border-default)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-body)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--color-error)",
    color: "#fff",
    border: "1px solid transparent",
  },
};

const HOVER_BG: Record<ButtonVariant, string> = {
  primary: "var(--color-brand-hover)",
  secondary: "var(--gray-200)",
  outline: "var(--gray-50)",
  ghost: "var(--surface-hover)",
  danger: "var(--error-600)",
};

/**
 * Button — primary interactive action.
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes: sm (32) | md (40) | lg (48)
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  type = "button",
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const s = SIZES[size];
  const v = VARIANTS[variant];

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: s.font,
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1,
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition:
      "background var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)",
    whiteSpace: "nowrap",
    userSelect: "none",
    ...v,
    background: hover && !disabled ? HOVER_BG[variant] : v.background,
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={base}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {iconLeft && (
        <span style={{ display: "inline-flex", width: s.icon, height: s.icon }}>
          {iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span style={{ display: "inline-flex", width: s.icon, height: s.icon }}>
          {iconRight}
        </span>
      )}
    </button>
  );
}
