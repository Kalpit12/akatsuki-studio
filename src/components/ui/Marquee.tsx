"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  trackClassName,
  speed = 40,
}: {
  children: React.ReactNode;
  className?: string;
  /** Gap / alignment on each half of the seamless track */
  trackClassName?: string;
  speed?: number;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
        <div
          className={cn("flex shrink-0 items-center", trackClassName)}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function MarqueeItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center", className)}>{children}</div>
  );
}
