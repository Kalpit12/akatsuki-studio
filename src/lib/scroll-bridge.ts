type ScrollListener = (scrollY: number, delta: number) => void;

type ScrollController = {
  stop: () => void;
  start: () => void;
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

export function resetScrollBridge(scrollY = 0) {
  lastScrollY = scrollY;
}
