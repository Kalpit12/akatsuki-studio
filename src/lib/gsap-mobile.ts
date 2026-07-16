/** Matches Tailwind `md` — mobile-only GSAP / layout branches use this. */
export const MOBILE_MQ = "(max-width: 767px)";
export const DESKTOP_MQ = "(min-width: 768px)";

export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}
