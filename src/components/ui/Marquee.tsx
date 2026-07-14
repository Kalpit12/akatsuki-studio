"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  speed = 40,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee gap-16"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
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
    <div
      className={cn(
        "flex shrink-0 items-center font-display text-4xl text-white/20 transition-colors duration-500 hover:text-white md:text-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
