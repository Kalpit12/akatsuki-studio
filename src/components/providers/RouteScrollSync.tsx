"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { killAllScrollTriggers } from "@/lib/gsap-cleanup";
import {
  consumeReturnScroll,
  getHashSectionId,
} from "@/lib/scroll-anchor";
import { scrollToSection, scrollToY } from "@/lib/scroll-bridge";

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

function restoreHomeSection() {
  const returnId = consumeReturnScroll();
  const hashId = getHashSectionId();
  const sectionId = returnId ?? hashId;

  if (!sectionId) return false;

  const attempt = (tries = 0) => {
    if (scrollToSection(sectionId)) {
      ScrollTrigger.refresh();
      return;
    }
    if (tries < 16) {
      window.setTimeout(() => attempt(tries + 1), 50);
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => attempt());
  });

  return true;
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
    killAllScrollTriggers();

    if (pathname === "/") {
      if (isFirstPath.current) {
        isFirstPath.current = false;
        if (restoreHomeSection()) return;
      } else if (restoreHomeSection()) {
        return;
      }
    } else {
      isFirstPath.current = false;
    }

    scrollToY(0, true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return null;
}
