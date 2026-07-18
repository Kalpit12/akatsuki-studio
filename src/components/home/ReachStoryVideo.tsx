"use client";

import { useCallback, useState } from "react";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { isFinePointer } from "@/lib/gsap-mobile";

type ReachStoryVideoProps = {
  src: string;
  poster: string;
  index: number;
  mediaReady: boolean;
};

export function ReachStoryVideo({
  src,
  poster,
  index,
  mediaReady,
}: ReachStoryVideoProps) {
  const [hovered, setHovered] = useState(false);

  const handlePointerEnter = useCallback(() => {
    if (isFinePointer()) setHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (isFinePointer()) setHovered(false);
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (isFinePointer()) return;
    if ((event.target as HTMLElement).closest("button")) return;
    setHovered((active) => !active);
  }, []);

  const handleMobilePlay = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setHovered(true);
  }, []);

  const handleMobilePause = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <div className="reach-media flex justify-center lg:col-span-5 lg:justify-start">
      <div
        className="relative w-full max-md:max-w-[min(88vw,22rem)] max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem]"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
      >
        <LazyVideoPlayer
          src={src}
          poster={poster}
          className="aspect-[9/16] border border-white/10"
          playOnHover={mediaReady}
          hoverActive={hovered && mediaReady}
          mobileTapControls
          onMobilePause={handleMobilePause}
          showMuteOnly
          showControls={false}
          showPlayOverlay={false}
          unloadWhenHidden
        />
        {mediaReady && !hovered ? (
          <button
            type="button"
            onClick={handleMobilePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition active:bg-black/40 md:hidden"
            aria-label="Play video"
          >
            <span className="group relative inline-flex items-center gap-2.5 overflow-hidden border border-white/20 bg-black/60 px-5 py-3 backdrop-blur-md transition duration-300">
              <span
                className="absolute inset-y-0 left-0 w-px bg-accent"
                aria-hidden
              />
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0 fill-current text-white/75"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.22em] text-white/75 uppercase">
                Play
              </span>
            </span>
          </button>
        ) : null}
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
