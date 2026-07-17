export const RETURN_SCROLL_KEY = "akatsuki-return-scroll";
export const VISHH254_SECTION_ID = "vishh254";
export const WORK_SECTION_ID = "work";

export function setReturnScroll(sectionId: string) {
  try {
    sessionStorage.setItem(RETURN_SCROLL_KEY, sectionId);
  } catch {
    /* ignore */
  }
}

export function consumeReturnScroll(): string | null {
  try {
    const id = sessionStorage.getItem(RETURN_SCROLL_KEY);
    sessionStorage.removeItem(RETURN_SCROLL_KEY);
    return id;
  } catch {
    return null;
  }
}

export function getHashSectionId(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return hash || null;
}
