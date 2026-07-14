"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { killAllScrollTriggers } from "@/lib/gsap-cleanup";

function isInternalNavLink(anchor: HTMLAnchorElement) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname !== window.location.pathname;
  } catch {
    return false;
  }
}

/**
 * Tear down GSAP pins BEFORE App Router commits the next page.
 * Capture-phase click is required — React removes DOM before useEffect cleanups.
 */
export function RouteScrollSync() {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavLink(anchor)) return;
      killAllScrollTriggers();
    };

    const onPopState = () => {
      killAllScrollTriggers();
    };

    document.addEventListener("click", onPointerDown, true);
    document.addEventListener("auxclick", onPointerDown, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onPointerDown, true);
      document.removeEventListener("auxclick", onPointerDown, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useLayoutEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }

    killAllScrollTriggers();
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return null;
}
