"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type VideoBackgroundProps = {
  src: string;
  poster?: string;
  className?: string;
  overlay?: boolean;
  parallax?: number;
};

export function VideoBackground({
  src,
  poster,
  className,
  overlay = true,
  parallax = 0,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !parallax) return;

    const onScroll = () => {
      const y = window.scrollY * parallax;
      video.style.transform = `translate3d(0, ${y}px, 0) scale(1.1)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parallax]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-background", className)}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden
        />
      )}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-background/90" />
      )}
    </div>
  );
}
