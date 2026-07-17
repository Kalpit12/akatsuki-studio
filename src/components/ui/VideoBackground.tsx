"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type VideoBackgroundProps = {
  src: string;
  poster?: string;
  className?: string;
  overlay?: boolean;
  parallax?: number;
  /** When true (default for hero), load and play immediately — no deferred src */
  eager?: boolean;
  /** Never pause — for homepage hero and other always-on backgrounds */
  alwaysPlay?: boolean;
};

export function VideoBackground({
  src,
  poster,
  className,
  overlay = true,
  parallax = 0,
  eager = true,
  alwaysPlay = false,
}: VideoBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [srcLoaded, setSrcLoaded] = useState(eager);

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

  // Play once the video has a real src and can start
  useEffect(() => {
    if (!srcLoaded) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) play();
    else {
      video.addEventListener("canplay", play, { once: true });
      video.addEventListener("loadeddata", play, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", play);
    };
  }, [src, srcLoaded]);

  // Optional: defer load until near viewport (non-eager backgrounds)
  useEffect(() => {
    if (eager) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrcLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "200px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [eager, src]);

  // Pause off-screen backgrounds (skip always-on hero — dismissed via HeroSection ScrollTrigger)
  useEffect(() => {
    if (alwaysPlay) return;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause();
          return;
        }

        if (!srcLoaded) {
          if (eager) setSrcLoaded(true);
          return;
        }

        video.muted = true;
        void video.play().catch(() => {});
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [srcLoaded, eager, alwaysPlay]);

  return (
    <div
      ref={rootRef}
      className={cn("absolute inset-0 overflow-hidden bg-background", className)}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
          aria-hidden
        />
      )}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={srcLoaded ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={eager}
        preload={eager ? "auto" : "none"}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-background/90" />
      )}
    </div>
  );
}
