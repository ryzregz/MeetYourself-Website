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

    // Belt-and-suspenders: if IntersectionObserver isn't available, or the
    // element is already in the viewport on first paint (the observer's own
    // callback fires a beat late for that case), reveal on the next frame
    // instead of leaving content stuck at opacity 0.
    const alreadyInView =
      typeof IntersectionObserver === "undefined" ||
      (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0);
    if (alreadyInView) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

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
