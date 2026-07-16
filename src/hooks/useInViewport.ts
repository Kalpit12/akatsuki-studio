"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while `ref` intersects the viewport (± rootMargin). Toggles on enter/leave. */
export function useInViewport(
  ref: RefObject<Element | null>,
  rootMargin = "250px 0px",
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
