"use client";

import { CSSProperties, InputHTMLAttributes, ReactNode, useState } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "prefix"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  style?: CSSProperties;
}

const BORDER_BY_STATE = {
  default: "var(--border-default)",
  error: "var(--color-error)",
  success: "var(--color-success)",
  disabled: "var(--border-subtle)",
} as const;

/**
 * Input — single-line text field with label, helper/error text, optional
 * leading/trailing adornments.
 */
export function Input({
  label,
  hint,
  error,
  success,
  type = "text",
  disabled = false,
  readOnly = false,
  required = false,
  prefix = null,
  suffix = null,
  id,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const state = disabled ? "disabled" : error ? "error" : success ? "success" : "default";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)" }}
        >
          {label}
          {required && <span style={{ color: "var(--color-error)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          padding: "0 12px",
          background: disabled ? "var(--gray-50)" : readOnly ? "var(--gray-50)" : "var(--surface-card)",
          border: `1px solid ${focused && state === "default" ? "var(--border-focus)" : BORDER_BY_STATE[state]}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focused ? "var(--focus-ring)" : "none",
          transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
          cursor: disabled ? "not-allowed" : "text",
        }}
      >
        {prefix && <span style={{ display: "inline-flex", color: "var(--text-muted)", fontSize: 14 }}>{prefix}</span>}
        <input
          id={id}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-md)",
            color: "var(--text-strong)",
            cursor: disabled ? "not-allowed" : "text",
          }}
          {...rest}
        />
        {suffix && <span style={{ display: "inline-flex", color: "var(--text-muted)", fontSize: 14 }}>{suffix}</span>}
      </div>
      {(error || success || hint) && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", color: error ? "var(--color-error)" : success ? "var(--color-success)" : "var(--text-muted)" }}>
          {error || success || hint}
        </span>
      )}
    </div>
  );
}
