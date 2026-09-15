"use client";

import { CSSProperties, ReactNode, TextareaHTMLAttributes, useState } from "react";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  style?: CSSProperties;
}

/**
 * Textarea — multi-line text field. Same label/hint/error/focus treatment as
 * Input, just with a resizable multi-row box instead of a fixed-height row.
 */
export function Textarea({
  label,
  hint,
  error,
  disabled = false,
  required = false,
  rows = 4,
  id,
  style,
  ...rest
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const state = disabled ? "disabled" : error ? "error" : "default";
  const borderColor =
    state === "disabled" ? "var(--border-subtle)" : state === "error" ? "var(--color-error)" : focused ? "var(--border-focus)" : "var(--border-default)";

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
      <textarea
        id={id}
        disabled={disabled}
        required={required}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: "10px 12px",
          background: disabled ? "var(--gray-50)" : "var(--surface-card)",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focused ? "var(--focus-ring)" : "none",
          transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-body-md)",
          color: "var(--text-strong)",
          resize: "vertical",
          cursor: disabled ? "not-allowed" : "text",
          outline: "none",
        }}
        {...rest}
      />
      {(error || hint) && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", color: error ? "var(--color-error)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
