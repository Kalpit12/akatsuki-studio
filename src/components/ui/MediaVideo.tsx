"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MediaVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  hoverPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
};

export function MediaVideo({
  src,
  poster,
  className,
  autoPlay = false,
  hoverPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
}: MediaVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-white/5", className)}>
      {poster && !ready && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      )}
      <video
        ref={ref}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0",
        )}
        src={src}
        poster={poster}
        autoPlay={autoPlay && !hoverPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={autoPlay || hoverPlay ? "metadata" : "none"}
        onLoadedData={() => setReady(true)}
        onMouseEnter={() => {
          if (hoverPlay) void ref.current?.play();
        }}
        onMouseLeave={() => {
          if (hoverPlay && ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
          }
        }}
      />
    </div>
  );
}
