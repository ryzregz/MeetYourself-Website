"use client";

import { CSSProperties, useId, useState } from "react";

export type RadioOption = string | { value: string; label: string };

export interface RadioGroupProps {
  name?: string;
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  style?: CSSProperties;
}

/**
 * RadioGroup — single-choice list. Pass `options` ({value,label}|string) and
 * a controlled `value` + `onChange(value)`.
 */
export function RadioGroup({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  direction = "vertical",
  style,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name || reactId;
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const norm = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

  const pick = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <div
      role="radiogroup"
      style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap: direction === "horizontal" ? 20 : 12, ...style }}
    >
      {norm.map((o) => {
        const checked = current === o.value;
        return (
          <label
            key={o.value}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
          >
            <span style={{ position: "relative", display: "inline-flex", width: 18, height: 18 }}>
              <input
                type="radio"
                name={groupName}
                value={o.value}
                checked={checked}
                disabled={disabled}
                onChange={() => pick(o.value)}
                style={{ position: "absolute", opacity: 0, width: 18, height: 18, margin: 0, cursor: "inherit" }}
              />
              <span
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1.5px solid ${checked ? "var(--color-brand)" : "var(--border-strong)"}`,
                  background: "var(--surface-card)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color var(--duration-fast) var(--ease-standard)",
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "var(--color-brand)",
                    transform: checked ? "scale(1)" : "scale(0)",
                    transition: "transform var(--duration-fast) var(--ease-emphasized)",
                  }}
                />
              </span>
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-md)", color: "var(--text-body)" }}>{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
