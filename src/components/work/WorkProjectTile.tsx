"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { useWorkMorph } from "@/components/work/WorkMorphProvider";
import { MOBILE_MQ } from "@/lib/gsap-mobile";
import { cn } from "@/lib/utils";

const CROSSFADE =
  "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function WorkTileMobileCover({
  coverVideo,
  coverImage,
  morphingAway,
}: {
  coverVideo: string;
  coverImage: string;
  morphingAway: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [srcAttached, setSrcAttached] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const shouldPlay = inView && !morphingAway;
  const showVideo = shouldPlay && videoReady && srcAttached;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) >= 0.45;
        setInView(visible);
        if (visible) setSrcAttached(true);
      },
      {
        threshold: [0, 0.35, 0.45, 0.6],
        rootMargin: "80px 0px",
      },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldPlay) {
      video.pause();
      if (!inView) {
        setVideoReady(false);
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (!video.currentSrc && srcAttached) {
      video.src = coverVideo;
      video.load();
    }

    const play = () => {
      video.muted = true;
      void video.play().catch(() => {});
    };
    const onReady = () => setVideoReady(true);

    if (video.readyState >= 2) {
      onReady();
      play();
    } else {
      video.addEventListener("canplay", play, { once: true });
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [shouldPlay, inView, srcAttached, coverVideo]);

  return (
    <div ref={rootRef} className="absolute inset-0 md:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverImage}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          CROSSFADE,
          showVideo ? "scale-[1.02] opacity-0" : "scale-100 opacity-100",
        )}
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      {srcAttached ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            CROSSFADE,
            showVideo ? "scale-[1.02] opacity-100" : "scale-100 opacity-0",
          )}
          poster={coverImage}
          muted
          loop
          playsInline
          preload={shouldPlay ? "auto" : "metadata"}
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function WorkProjectTile({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLAnchorElement>(null);
  const { startMorph, activeSlug, lockHero } = useWorkMorph();
  const [isMobile, setIsMobile] = useState(false);

  const morphingAway = activeSlug === project.slug && lockHero;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isMobile) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    const media = mediaRef.current;
    if (!media) return;

    e.preventDefault();
    const rect = media.getBoundingClientRect();
    startMorph({
      slug: project.slug,
      coverImage: project.coverImage,
      from: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });
  }

  return (
    <Link
      ref={rootRef}
      href={`/work/${project.slug}`}
      data-work-tile
      data-cursor-label="View"
      onClick={handleClick}
      className="group block"
    >
      <div
        ref={mediaRef}
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.03] md:rounded-3xl",
          morphingAway && "opacity-0",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.client}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] max-md:hidden"
          loading="lazy"
          decoding="async"
        />

        <WorkTileMobileCover
          coverVideo={project.coverVideo}
          coverImage={project.coverImage}
          morphingAway={morphingAway}
        />

        <span
          className="pointer-events-none absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-accent/55 group-hover:shadow-[inset_0_0_28px_rgba(225,6,0,0.1)]"
          aria-hidden
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 md:mt-6">
        <div className="min-w-0">
          <p className="label mb-2 text-white/40">
            {project.category}
            <span className="mx-2 text-white/20">·</span>
            {project.year}
          </p>
          <h2 className="font-display text-xl leading-tight text-white transition-colors duration-300 group-hover:text-accent md:text-2xl">
            {project.client}
          </h2>
          <p className="mt-1.5 truncate text-sm text-muted md:text-[15px]">
            {project.title}
          </p>
        </div>

        <span className="label shrink-0 pt-1 text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 translate-x-2">
          View project →
        </span>
      </div>

      <span className="sr-only">
        Project {String(index + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}
