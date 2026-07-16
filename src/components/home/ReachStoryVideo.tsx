"use client";

import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";

type ReachStoryVideoProps = {
  src: string;
  poster: string;
  index: number;
  active: boolean;
};

export function ReachStoryVideo({
  src,
  poster,
  index,
  active,
}: ReachStoryVideoProps) {
  return (
    <div className="reach-media flex justify-center lg:col-span-5 lg:justify-start">
      <div className="relative w-full max-md:max-w-[min(88vw,22rem)] max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem]">
        <LazyVideoPlayer
          src={src}
          poster={poster}
          className="aspect-[9/16] border border-white/10"
          playInView
          playInViewMinRatio={0.35}
          ambientActive={active}
          showMuteOnly
          showControls={false}
          showPlayOverlay={false}
        />
        <div
          className="pointer-events-none absolute top-0 left-0 z-10 h-full w-px bg-gradient-to-b from-accent via-accent/45 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute top-3 right-3 left-3 z-10 md:top-4 md:right-4 md:left-4">
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
