"use client";

import { useEffect } from "react";
import { SERVICE_IMAGES } from "@/data/services";
import { useIntroReady } from "@/hooks/useIntroReady";

/**
 * After the intro, quietly warm all What-we-create service stills
 * so hover swaps are instant when the section is reached.
 */
export function PrefetchServiceImages() {
  const introReady = useIntroReady();

  useEffect(() => {
    if (!introReady) return;

    const run = () => {
      for (const href of SERVICE_IMAGES) {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      }
    };

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle.call(window, run, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 400);
    return () => window.clearTimeout(t);
  }, [introReady]);

  return null;
}
