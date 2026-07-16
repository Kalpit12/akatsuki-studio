"use client";

import { useEffect, useRef, type RefObject } from "react";
import { MOBILE_MQ } from "@/lib/gsap-mobile";
import { subscribeScroll } from "@/lib/scroll-bridge";

type Options = {
  /** How long to ignore scroll updates after a manual tap (ms) */
  manualLockMs?: number;
};

/**
 * On mobile, pick the list item whose center is closest to the viewport anchor.
 * Avoids per-item ScrollTriggers that all fire when multiple rows are on screen.
 */
export function useMobileCenterActive(
  rootRef: RefObject<HTMLElement | null>,
  itemSelector: string,
  setActive: (index: number) => void,
  options: Options = {},
) {
  const setActiveRef = useRef(setActive);
  const lockUntilRef = useRef(0);
  const manualLockMs = options.manualLockMs ?? 1400;

  setActiveRef.current = setActive;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia(MOBILE_MQ);
    let rafId = 0;
    let unsubScroll: (() => void) | undefined;

    const pickCentered = () => {
      if (Date.now() < lockUntilRef.current) return;

      const items = root.querySelectorAll<HTMLElement>(itemSelector);
      if (!items.length) return;

      const anchor = window.innerHeight * 0.46;
      let bestIndex = 0;
      let bestDistance = Infinity;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const visible =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        if (visible < rect.height * 0.25) return;

        const center = rect.top + rect.height * 0.5;
        const distance = Math.abs(center - anchor);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveRef.current(bestIndex);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        pickCentered();
      });
    };

    const enable = () => {
      schedule();
      unsubScroll = subscribeScroll(() => schedule());
    };

    const disable = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      unsubScroll?.();
      unsubScroll = undefined;
    };

    if (mq.matches) enable();

    const onMqChange = () => {
      if (mq.matches) enable();
      else disable();
    };

    mq.addEventListener("change", onMqChange);

    return () => {
      mq.removeEventListener("change", onMqChange);
      disable();
    };
  }, [rootRef, itemSelector, manualLockMs]);

  const lockScrollSelection = () => {
    lockUntilRef.current = Date.now() + manualLockMs;
  };

  return { lockScrollSelection };
}
