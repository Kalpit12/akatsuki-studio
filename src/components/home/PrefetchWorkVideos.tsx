"use client";

import { useEffect, useRef } from "react";
import { getHomeWorkCards } from "@/data/homeWork";
import { useIntroReady } from "@/hooks/useIntroReady";

/**
 * Prefetch compact Work hover previews once the Work section is near the viewport.
 * Keeps first hover near-instant without downloading full 20MB cover films.
 */
export function PrefetchWorkVideos() {
  const introReady = useIntroReady();
  const warmed = useRef(false);

  useEffect(() => {
    if (!introReady || warmed.current) return;

    const run = () => {
      if (warmed.current) return;
      warmed.current = true;

      const cards = getHomeWorkCards().slice(0, 8);
      for (const card of cards) {
        const href = card.hoverVideo ?? card.video;
        if (!href) continue;
        // Hint the browser cache; video element warm happens in LazyVideoPlayer.
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "video";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    const section = document.querySelector("[data-featured-section]");
    if (!section) {
      const t = window.setTimeout(run, 1800);
      return () => window.clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { rootMargin: "480px 0px", threshold: 0 },
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, [introReady]);

  return null;
}
