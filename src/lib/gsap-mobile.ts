/** Matches Tailwind `md` — mobile-only GSAP / layout branches use this. */
export const MOBILE_MQ = "(max-width: 767px)";
export const DESKTOP_MQ = "(min-width: 768px)";
/** Desktop/laptop with real hover — touch devices use tap-toggle instead. */
export const FINE_POINTER_MQ = "(hover: hover) and (pointer: fine)";

export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_MQ).matches;
}
