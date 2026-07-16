type ScrollListener = (scrollY: number, delta: number) => void;

type ScrollController = {
  stop: () => void;
  start: () => void;
  scrollTo: (y: number, options?: { immediate?: boolean }) => void;
};

const listeners = new Set<ScrollListener>();
let lastScrollY = 0;
let controller: ScrollController | null = null;
let locked = false;

export function registerScrollController(next: ScrollController | null) {
  controller = next;
}

/** Freeze Lenis + document scroll (mobile menu, etc.) */
export function setScrollLocked(next: boolean) {
  locked = next;
  if (next) {
    controller?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  } else {
    controller?.start();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }
}

export function isScrollLocked() {
  return locked;
}

export function subscribeScroll(listener: ScrollListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyScroll(scrollY: number) {
  if (locked) return;
  const delta = scrollY - lastScrollY;
  lastScrollY = scrollY;
  listeners.forEach((listener) => listener(scrollY, delta));
}

export function scrollToY(y: number, immediate = true) {
  if (controller?.scrollTo) {
    controller.scrollTo(y, { immediate });
  } else {
    window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  }
  resetScrollBridge(y);
}

export function scrollToSection(id: string, offset = 96) {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  scrollToY(y, true);
  return true;
}

export function resetScrollBridge(scrollY = 0) {
  lastScrollY = scrollY;
}
