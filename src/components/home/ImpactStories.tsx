"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { REACH_STORIES, REACH_TOTAL } from "@/data/reachStories";
import { cn } from "@/lib/utils";

function formatViews(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded =
      millions >= 10
        ? Math.round(millions).toString()
        : millions.toFixed(1).replace(/\.0$/, "");
    return `${rounded}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    const rounded =
      thousands >= 10
        ? Math.round(thousands).toString()
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `${rounded}K`;
  }
  return `${Math.round(value)}`;
}

function VolumeIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m16 9 5 5M21 9l-5 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18.2 5.8a8 8 0 0 1 0 12.4" />
    </svg>
  );
}

function StoryVideo({
  src,
  poster,
  muted,
  volume,
  videoRef,
}: {
  src: string;
  poster: string;
  muted: boolean;
  volume: number;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });

    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      video.pause();
    };
  }, [src, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = Math.min(1, Math.max(0, volume));
  }, [muted, volume, videoRef]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    </>
  );
}

function StoryRow({
  story,
  index,
  active,
  isMuted,
  onActivate,
  onToggleMute,
}: {
  story: (typeof REACH_STORIES)[number];
  index: number;
  active: boolean;
  isMuted: boolean;
  onActivate: () => void;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10 lg:gap-14"
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
    >
      {/* Square idle → 9:16 portrait on hover */}
      <div
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        }}
        aria-pressed={active}
        aria-label={story.title}
        className={cn(
          "relative shrink-0 cursor-pointer overflow-hidden border outline-none",
          "transition-[width,height,border-color,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus-visible:border-accent/60",
          active
            ? "z-20 h-[26.67rem] w-[15rem] border-accent/55 opacity-100 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:h-[28.44rem] sm:w-[16rem] md:h-[30.22rem] md:w-[17rem]"
            : "z-10 h-[8.5rem] w-[8.5rem] border-white/10 opacity-80 hover:opacity-100 sm:h-[9.5rem] sm:w-[9.5rem] md:h-[10.5rem] md:w-[10.5rem]",
        )}
      >
        <StoryVideo
          src={story.video}
          poster={story.poster}
          muted={isMuted}
          volume={0.85}
          videoRef={videoRef}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 h-full w-px transition-colors duration-500",
            active
              ? "bg-gradient-to-b from-accent via-accent/45 to-transparent"
              : "bg-white/15",
          )}
          aria-hidden
        />

        <div className="pointer-events-none absolute top-2.5 right-2.5 left-2.5 flex items-start justify-between">
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/80 sm:text-[10px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "truncate text-right text-[8px] uppercase tracking-[0.12em] text-white/55 transition-opacity duration-400",
              active ? "opacity-0" : "max-w-[3.5rem] opacity-100 sm:max-w-[4.5rem]",
            )}
          >
            {story.title}
          </span>
        </div>

        <button
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className={cn(
            "absolute right-2.5 bottom-2.5 z-20 flex h-8 w-8 items-center justify-center border border-white/20 bg-black/70 text-white transition hover:border-accent hover:text-accent",
            active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          <VolumeIcon muted={isMuted} />
        </button>
      </div>

      {/* Per-story description — only takes space when that row is hovered */}
      <div
        className={cn(
          "min-w-0 overflow-hidden transition-[opacity,max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active
            ? "max-h-[28rem] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
        aria-hidden={!active}
      >
        <p className="font-mono text-xs tracking-[0.2em] text-accent">
          {String(index + 1).padStart(2, "0")} — FILM
        </p>
        <p className="mt-2 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none tracking-tight text-white">
          {formatViews(story.views)}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
          {story.viewsLabel}
        </p>

        <h3 className="mt-6 font-display text-xl tracking-tight text-white md:text-2xl">
          {story.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
          {story.description}
        </p>
        {story.about ? (
          <div className="mt-4 flex max-w-md items-stretch gap-4">
            <span
              className="w-px shrink-0 self-stretch bg-accent"
              aria-hidden
            />
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-white/55">
              {story.about}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ImpactStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  useEffect(() => {
    if (unmutedId && activeId !== unmutedId) {
      setUnmutedId(null);
    }
  }, [activeId, unmutedId]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const collapse = () => {
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      setActiveId(null);
      setUnmutedId(null);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) collapse();
      },
      { threshold: 0.12 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  function activate(id: string) {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveId(id);
  }

  function scheduleCollapse() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setActiveId(null);
      leaveTimer.current = null;
    }, 120);
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/10 py-28 md:py-36"
    >
      <div className="section-padding relative z-10">
        <div className="mb-14 grid gap-10 border-b border-white/10 pb-12 md:mb-16 md:grid-cols-12 md:items-end md:gap-12 md:pb-14">
          <div className="md:col-span-7">
            <p className="label mb-4 text-accent">Reach</p>
            <h2 className="heading-lg max-w-3xl text-balance">
              Three stories.{" "}
              <span className="text-accent">2.6 million</span> reasons to keep
              creating.
            </h2>
            <span
              className="mt-5 block h-px w-16 bg-accent/70 shadow-[0_0_10px_rgba(225,6,0,0.45)]"
              aria-hidden
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Some projects do more than look good. They connect, get shared,
              and reach millions.
            </p>
          </div>

          <div className="md:col-span-5 md:justify-self-end md:text-right">
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
              COMBINED
            </p>
            <p className="mt-2 font-display text-[clamp(3.5rem,8vw,6rem)] leading-none tracking-tight text-white">
              {formatViews(REACH_TOTAL.value)}
            </p>
            <p className="mt-3 text-sm text-muted">{REACH_TOTAL.label}</p>
          </div>
        </div>

        <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-white/35 md:mb-10">
          Hover a film to expand
        </p>

        <div
          className="flex flex-col gap-8 md:gap-10"
          onMouseLeave={scheduleCollapse}
        >
          {REACH_STORIES.map((story, i) => (
            <StoryRow
              key={story.id}
              story={story}
              index={i}
              active={activeId === story.id}
              isMuted={unmutedId !== story.id}
              onActivate={() => activate(story.id)}
              onToggleMute={() =>
                setUnmutedId((prev) => (prev === story.id ? null : story.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
