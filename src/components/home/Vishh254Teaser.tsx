"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { VISHH254, type VishhFilm } from "@/data/vishh254";
import { setReturnScroll, VISHH254_SECTION_ID } from "@/lib/scroll-anchor";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useInViewport } from "@/hooks/useInViewport";
import { cn } from "@/lib/utils";

const CROSSFADE =
  "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

const controlBase =
  "group relative inline-flex items-center gap-2 overflow-hidden border bg-black/60 px-2.5 py-1.5 backdrop-blur-md transition duration-300";

const controlIdle =
  "border-white/20 text-white/75 hover:border-accent/70 hover:bg-black/75 hover:text-accent";

const controlActive =
  "border-accent/55 bg-accent/10 text-accent hover:border-accent hover:bg-accent/15";

function VolumeIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m16 9 5 5M21 9l-5 5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18.2 5.8a8 8 0 0 1 0 12.4" />
    </svg>
  );
}

function SportBikeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <circle cx="12" cy="11.5" r="2" />
      <path d="M7 5.5 9 7.5" />
      <path d="M16 6.5 19 8.5" />
      <path d="M12 8.5v3" />
      <path d="M5 17 6 12" />
      <path d="M19 17 18 12" />
    </svg>
  );
}

function markVishh254Return() {
  setReturnScroll(VISHH254_SECTION_ID);
}

function TeaserTitleIcon({ icon }: { icon: VishhFilm["icon"] }) {
  if (icon === "sport-bike") {
    return <SportBikeIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-accent sm:h-5 sm:w-5" />;
  }
  return null;
}

/** Featured film in the physical center; same order for desktop row and mobile stack. */
function buildTeaserDisplayOrder(films: VishhFilm[]) {
  const featured = films.find((film) => film.featured);
  const others = films.filter((film) => !film.featured);

  if (!featured) return films;

  const beforeCount = Math.floor(others.length / 2);
  return [...others.slice(0, beforeCount), featured, ...others.slice(beforeCount)];
}

function TeaserFilmCard({
  film,
  index,
  allowLoad,
}: {
  film: VishhFilm;
  index: number;
  allowLoad: boolean;
}) {
  const isFeatured = film.featured === true;

  return (
    <div
      className={cn(
        "group relative overflow-hidden border bg-black transition duration-500",
        isFeatured
          ? "w-[13.5rem] shrink-0 border-accent/35 shadow-[0_0_50px_rgba(225,6,0,0.12)] hover:border-accent/55 sm:w-[15.5rem] md:w-[15rem] lg:w-[16.5rem] xl:w-[17rem] max-md:w-full"
          : "w-[9.75rem] shrink-0 self-end border-white/10 max-md:border-white/20 hover:border-white/25 sm:w-[10.75rem] md:w-[10.25rem] lg:w-[11rem] xl:w-[11.5rem] max-md:w-full max-md:self-stretch",
      )}
    >
      <div className="relative aspect-[9/16]">
        <TeaserVideo film={film} allowLoad={allowLoad} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent transition-opacity duration-500",
            isFeatured ? "opacity-100" : "max-md:opacity-70 opacity-0 group-hover:opacity-100",
          )}
          aria-hidden
        />
        <div className="pointer-events-none absolute top-3 left-3 z-[11]">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-white/55">
            {film.tag}
          </span>
        </div>
        <div className="pointer-events-none absolute right-4 bottom-4 left-4">
          <div
            className="mb-2 h-px w-10 origin-left max-md:scale-x-100 scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100"
            aria-hidden
          />
          <p
            className={cn(
              "font-body flex items-center gap-2 font-medium leading-snug tracking-[0.04em] text-white/90 transition duration-500 group-hover:text-white",
              isFeatured
                ? "text-base sm:text-lg md:text-xl"
                : "text-[0.85rem] sm:text-[0.9rem]",
            )}
          >
            <TeaserTitleIcon icon={film.icon} />
            <span>{film.title}</span>
          </p>
        </div>
        <Link
          href="/vishh254"
          onClick={markVishh254Return}
          className="absolute inset-0 z-10"
          aria-label={`View ${film.title} on Vishh254`}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

function TeaserVideo({
  film,
  allowLoad,
}: {
  film: VishhFilm;
  allowLoad: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const mutedRef = useRef(true);
  const [srcAttached, setSrcAttached] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const shouldPlay = allowLoad && srcAttached && !videoFailed;
  const showVideo = shouldPlay && videoReady;

  useEffect(() => {
    setSrcAttached(false);
    setVideoReady(false);
    setVideoFailed(false);
  }, [film.video]);

  useEffect(() => {
    if (!allowLoad) return;
    setSrcAttached(true);
  }, [allowLoad]);

  useEffect(() => {
    mutedRef.current = muted;
    const video = ref.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) video.volume = 1;
  }, [muted]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!shouldPlay) {
      video.pause();
      if (!allowLoad) {
        setSrcAttached(false);
        setVideoReady(false);
      }
      return;
    }

    if (!video.currentSrc) {
      video.src = film.video;
      video.load();
    }

    const play = () => {
      video.muted = mutedRef.current;
      if (!mutedRef.current) video.volume = 1;
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
  }, [shouldPlay, allowLoad, film.video, srcAttached]);

  function handleToggleMute(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const video = ref.current;
    const next = !muted;
    mutedRef.current = next;
    setMuted(next);
    if (video) {
      video.muted = next;
      if (!next) video.volume = 1;
      if (shouldPlay) void video.play().catch(() => {});
    }
  }

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={film.poster}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          CROSSFADE,
          showVideo ? "scale-[1.02] opacity-0" : "scale-100 opacity-100",
        )}
        loading={allowLoad ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={allowLoad ? "high" : "auto"}
        aria-hidden
      />
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          CROSSFADE,
          showVideo ? "scale-[1.02] opacity-100" : "scale-100 opacity-0",
          videoFailed && "pointer-events-none",
        )}
        src={srcAttached && !videoFailed ? film.video : undefined}
        poster={film.poster}
        muted={muted}
        loop
        playsInline
        preload={srcAttached ? "metadata" : "none"}
        onError={() => setVideoFailed(true)}
      />
      {showVideo ? (
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className={cn(
              controlBase,
              muted ? controlIdle : controlActive,
              muted && "studio-control-muted",
              "active:scale-[0.97]",
            )}
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-px transition-colors duration-300",
                muted ? "bg-white/25 group-hover:bg-accent" : "bg-accent shadow-[0_0_8px_rgba(225,6,0,0.65)]",
              )}
              aria-hidden
            />
            <VolumeIcon muted={muted} />
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase">
              {muted ? "Sound" : "Mute"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Homepage teaser under Reach — personal cuts + link to Vishh254 page */
export function Vishh254Teaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const introReady = useIntroReady();
  const sectionInView = useInViewport(sectionRef, "150px 0px");
  const allowLoad = introReady && sectionInView;
  const films = VISHH254.teaserFilms;
  const displayOrder = buildTeaserDisplayOrder(films);
  const filmIndex = new Map(films.map((film, i) => [film.id, i]));

  useEffect(() => {
    if (!sectionInView) return;

    const posters = films.map((f) => f.poster);
    const run = () => {
      for (const href of posters) {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      }
    };

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle.call(window, run, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 300);
    return () => window.clearTimeout(t);
  }, [sectionInView, films]);

  return (
    <section
      id={VISHH254_SECTION_ID}
      ref={sectionRef}
      className="relative overflow-hidden border-b border-white/10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(225,6,0,0.14)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="section-padding relative max-md:py-16 md:py-28">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="label mb-4 text-accent">vishh254</p>
            <h2 className="heading-lg max-w-3xl text-balance">
              Creating Stories.{" "}
              <span className="text-accent">Chasing Bigger Dreams.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Every project is another step toward building something bigger
              than myself. Vishh254 is a collection of the films, experiences,
              and moments that continue to shape that journey.
            </p>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end lg:pb-1">
            <Link
              href="/vishh254"
              onClick={markVishh254Return}
              data-magnetic
              className="group inline-flex items-center gap-3 border border-accent/40 bg-accent/10 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-white"
            >
              View My Work
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/45">
              Selected personal cuts
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-accent">
              {String(films.length).padStart(2, "0")} cuts
            </p>
          </div>

          {/* Mobile: featured in the middle of the stack */}
          <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-5 md:hidden">
            {displayOrder.map((film) => (
              <TeaserFilmCard
                key={film.id}
                film={film}
                index={filmIndex.get(film.id) ?? 0}
                allowLoad={allowLoad}
              />
            ))}
          </div>

          {/* Desktop: all cuts in one row, hero centered */}
          <div className="mx-auto hidden max-w-[76rem] flex-nowrap items-end justify-center gap-3 md:flex lg:gap-4 xl:gap-5">
            {displayOrder.map((film) => (
              <TeaserFilmCard
                key={film.id}
                film={film}
                index={filmIndex.get(film.id) ?? 0}
                allowLoad={allowLoad}
              />
            ))}
          </div>
        </div>

        <div
          className="mt-10 h-px w-full bg-gradient-to-r from-accent/70 via-white/10 to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
