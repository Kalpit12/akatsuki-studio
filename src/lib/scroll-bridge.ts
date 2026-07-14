type ScrollListener = (scrollY: number, delta: number) => void;

const listeners = new Set<ScrollListener>();
let lastScrollY = 0;

export function subscribeScroll(listener: ScrollListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyScroll(scrollY: number) {
  const delta = scrollY - lastScrollY;
  lastScrollY = scrollY;
  listeners.forEach((listener) => listener(scrollY, delta));
}

export function resetScrollBridge(scrollY = 0) {
  lastScrollY = scrollY;
}
