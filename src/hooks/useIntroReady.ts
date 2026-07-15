"use client";

import { useEffect, useState } from "react";
import { INTRO_DONE_EVENT } from "@/components/brand/Logo";

const INTRO_READY_KEY = "akatsuki-intro-ready";

/** True after the homepage intro overlay finishes (or after a safety timeout). */
export function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_READY_KEY) === "1") {
        setReady(true);
        return;
      }
    } catch {
      /* ignore */
    }

    const unlock = () => {
      try {
        sessionStorage.setItem(INTRO_READY_KEY, "1");
      } catch {
        /* ignore */
      }
      setReady(true);
    };

    window.addEventListener(INTRO_DONE_EVENT, unlock);
    const fallback = window.setTimeout(unlock, 5200);

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, unlock);
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}
