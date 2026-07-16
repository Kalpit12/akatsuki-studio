"use client";

import { useEffect } from "react";
import { setReturnScroll, VISHH254_SECTION_ID } from "@/lib/scroll-anchor";

/** Remember homepage return target when arriving from the home page (browser back support). */
export function Vishh254ScrollMark() {
  useEffect(() => {
    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin === window.location.origin && url.pathname === "/") {
        setReturnScroll(VISHH254_SECTION_ID);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
