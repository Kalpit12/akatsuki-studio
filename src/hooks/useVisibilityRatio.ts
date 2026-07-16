"use client";

import { useEffect, useState, type RefObject } from "react";

const DEFAULT_THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

/** Tracks intersection ratio for an element (0–1). */
export function useVisibilityRatio(
  ref: RefObject<Element | null>,
  thresholds: number[] = DEFAULT_THRESHOLDS,
) {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry?.intersectionRatio ?? 0);
      },
      { threshold: thresholds },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, thresholds]);

  return ratio;
}
