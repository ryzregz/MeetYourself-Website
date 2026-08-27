"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

/**
 * Fades + slides children in once they scroll into view. Pure CSS transition
 * driven by inline styles (so it composes fine as a grid/flex item), triggered
 * once via IntersectionObserver — no animation library needed. Global
 * `prefers-reduced-motion` handling in globals.css neutralizes the
 * transition for anyone who's asked for less motion.
 */
export function Reveal({
  children,
  delayMs = 0,
  style,
  className,
}: {
  children: ReactNode;
  delayMs?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity var(--duration-reveal) var(--ease-standard) ${delayMs}ms, transform var(--duration-reveal) var(--ease-standard) ${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
