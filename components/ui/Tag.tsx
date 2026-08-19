import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  children: ReactNode;
  onRemove?: () => void;
  style?: CSSProperties;
}

/** Tag — removable label/chip, typically for filters or multi-select values. */
export function Tag({ children, onRemove, style, ...rest }: TagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 26,
        padding: onRemove ? "0 4px 0 10px" : "0 10px",
        background: "var(--gray-100)",
        color: "var(--text-body)",
        border: "1px solid var(--border-subtle)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-body-sm)",
        fontWeight: "var(--weight-medium)",
        lineHeight: 1,
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            padding: 0,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "var(--text-muted)",
            borderRadius: "var(--radius-sm)",
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
