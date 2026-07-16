"use client";

import Link from "next/link";
import { setReturnScroll, VISHH254_SECTION_ID } from "@/lib/scroll-anchor";

export function Vishh254BackLink() {
  return (
    <Link
      href={`/#${VISHH254_SECTION_ID}`}
      onClick={() => setReturnScroll(VISHH254_SECTION_ID)}
      className="label mb-8 inline-flex items-center gap-2 text-muted transition hover:text-accent"
    >
      <span aria-hidden>←</span>
      Back to Vishh254
    </Link>
  );
}
