"use client";

import { useEffect, useState, type RefObject } from "react";

/** True when `ref` is within `rootMargin` of the viewport. */
export function useNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = "250px 0px",
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return near;
}
