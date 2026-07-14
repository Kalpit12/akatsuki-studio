"use client";

import { cn } from "@/lib/utils";

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function MediaImage({ src, alt, className, priority }: MediaImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
