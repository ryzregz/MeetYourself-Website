"use client";

import { CSSProperties, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "underline" | "pill";
  style?: CSSProperties;
}

/**
 * Tabs — segmented navigation. Pass `tabs` ({id,label,badge?}) and control via
 * `value` + `onChange(id)`, or use uncontrolled with `defaultValue`.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, variant = "underline", style }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.id);
  const active = value !== undefined ? value : internal;

  const pick = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  if (variant === "pill") {
    return (
      <div
        role="tablist"
        style={{ display: "inline-flex", gap: 4, padding: 4, background: "var(--gray-100)", borderRadius: "var(--radius-md)", ...style }}
      >
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => pick(t.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 32,
                padding: "0 14px",
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-sm)",
                background: on ? "var(--surface-card)" : "transparent",
                boxShadow: on ? "var(--shadow-sm)" : "none",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-body-md)",
                fontWeight: "var(--weight-medium)",
                color: on ? "var(--text-strong)" : "var(--text-muted)",
                transition: "all var(--duration-fast) var(--ease-standard)",
              }}
            >
              {t.label}
              {t.badge != null && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: on ? "var(--primary-100)" : "var(--gray-200)",
                    color: on ? "var(--primary-700)" : "var(--text-muted)",
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-subtle)", ...style }}>
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => pick(t.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 40,
              padding: "0 14px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              borderBottom: `2px solid ${on ? "var(--color-brand)" : "transparent"}`,
              marginBottom: -1,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-body-md)",
              fontWeight: "var(--weight-medium)",
              color: on ? "var(--text-link)" : "var(--text-muted)",
              transition: "color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)",
            }}
          >
            {t.label}
            {t.badge != null && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  background: on ? "var(--primary-100)" : "var(--gray-200)",
                  color: on ? "var(--primary-700)" : "var(--text-muted)",
                }}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
