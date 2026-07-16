"use client";

import { useEffect, useRef } from "react";
import { MEDIA } from "@/lib/cloudinary";
import { useIntroReady } from "@/hooks/useIntroReady";

/** Warm studio reel poster stills once the reel section is near the viewport. */
export function PrefetchReelPosters() {
  const introReady = useIntroReady();
  const warmed = useRef(false);

  useEffect(() => {
    if (!introReady || warmed.current) return;

    const posters = [
      MEDIA.reel[0].poster,
      MEDIA.reel[2].poster,
      MEDIA.reel[3].poster,
      MEDIA.reel[4].poster,
    ];

    const run = () => {
      warmed.current = true;
      for (const href of posters) {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      }
    };

    const section = document.querySelector("[data-reel-section]");
    if (!section) {
      const t = window.setTimeout(run, 2500);
      return () => window.clearTimeout(t);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0 },
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, [introReady]);

  return null;
}
