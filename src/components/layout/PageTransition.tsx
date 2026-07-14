"use client";

export function PageTransition({ children }: { children: React.ReactNode }) {
  // Plain wrapper — Framer Motion around App Router children caused DOM removeChild races
  return <div className="min-h-full">{children}</div>;
}
