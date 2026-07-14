import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Kill every ScrollTrigger and restore pin-mutated DOM before React unmounts.
 * GSAP pin wraps sections in `.pin-spacer`; if React removes a section while pinned,
 * you get: Failed to execute 'removeChild' on 'Node'.
 */
export function killAllScrollTriggers() {
  if (typeof window === "undefined") return;

  const triggers = ScrollTrigger.getAll();
  for (let i = triggers.length - 1; i >= 0; i--) {
    triggers[i].kill(true);
  }

  // Orphan pin spacers (belt-and-suspenders)
  document.querySelectorAll(".pin-spacer").forEach((spacer) => {
    const parent = spacer.parentNode;
    if (!parent) return;
    while (spacer.firstChild) {
      parent.insertBefore(spacer.firstChild, spacer);
    }
    if (spacer.parentNode === parent) {
      parent.removeChild(spacer);
    }
  });

  ScrollTrigger.clearScrollMemory?.();
}
