"use client";

import { CSSProperties, SelectHTMLAttributes, useState } from "react";

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "style"> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  style?: CSSProperties;
}

/** Select — native dropdown styled to match Input. */
export function Select({
  label,
  hint,
  error,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled = false,
  required = false,
  id,
  style,
  ...rest
}: SelectProps) {
  const [focused, setFocused] = useState(false);
  const border = error ? "var(--color-error)" : focused ? "var(--border-focus)" : "var(--border-default)";
  const norm = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

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
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={id}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: "100%",
            height: 40,
            padding: "0 36px 0 12px",
            background: disabled ? "var(--gray-50)" : "var(--surface-card)",
            border: `1px solid ${border}`,
            borderRadius: "var(--radius-md)",
            boxShadow: focused ? "var(--focus-ring)" : "none",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-body-md)",
            color: value || defaultValue ? "var(--text-strong)" : "var(--text-muted)",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
            transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)",
          }}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {norm.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: "absolute", right: 12, pointerEvents: "none" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {(error || hint) && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", color: error ? "var(--color-error)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
