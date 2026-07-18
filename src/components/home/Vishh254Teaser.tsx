"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { VISHH254, type VishhFilm } from "@/data/vishh254";
import { setReturnScroll, VISHH254_SECTION_ID } from "@/lib/scroll-anchor";
import { isFinePointer } from "@/lib/gsap-mobile";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useInViewport } from "@/hooks/useInViewport";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { cn } from "@/lib/utils";

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
    return (
      <SportBikeIcon className="h-[1.125rem] w-[1.125rem] shrink-0 text-accent sm:h-5 sm:w-5" />
    );
  }
  return null;
}

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
  introReady,
}: {
  film: VishhFilm;
  index: number;
  introReady: boolean;
}) {
  const isFeatured = film.featured === true;
  const [hovered, setHovered] = useState(false);

  const handlePointerEnter = () => {
    if (isFinePointer()) setHovered(true);
  };

  const handlePointerLeave = () => {
    if (isFinePointer()) setHovered(false);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (isFinePointer()) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    setHovered((active) => !active);
  };

  const handleMobilePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handleMobilePause = () => {
    setHovered(false);
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden border bg-black transition duration-500",
        isFeatured
          ? "w-[14rem] shrink-0 border-accent/35 shadow-[0_0_50px_rgba(225,6,0,0.12)] hover:border-accent/55 sm:w-[16rem] md:w-[15.75rem] lg:w-[17rem] xl:w-[18rem] max-md:w-full"
          : "w-[12.75rem] shrink-0 self-end border-white/10 max-md:border-white/20 hover:border-white/25 sm:w-[13.75rem] md:w-[13.5rem] lg:w-[14.5rem] xl:w-[15.25rem] max-md:w-full max-md:self-stretch",
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
    >
      <div className="relative aspect-[9/16]">
        <LazyVideoPlayer
          src={film.video}
          poster={film.poster}
          className="absolute inset-0 h-full w-full"
          playOnHover={introReady}
          hoverActive={hovered}
          mobileTapControls
          onMobilePause={handleMobilePause}
          showMuteOnly
          showControls={false}
          showPlayOverlay={false}
          unloadWhenHidden
        />
        {introReady && !hovered ? (
          <button
            type="button"
            onClick={handleMobilePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition active:bg-black/35 md:hidden"
            aria-label={`Play ${film.title}`}
          >
            <span className="relative inline-flex items-center gap-2.5 overflow-hidden border border-white/20 bg-black/60 px-4 py-2.5 backdrop-blur-md">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />
        <div
          className={cn(
            "pointer-events-none absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent transition-opacity duration-500",
            isFeatured
              ? "opacity-100"
              : "max-md:opacity-70 opacity-0 group-hover:opacity-100",
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
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-[11]">
          <div
            className="mb-2 h-px w-10 origin-left max-md:scale-x-100 scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100"
            aria-hidden
          />
          <Link
            href="/vishh254"
            onClick={markVishh254Return}
            className={cn(
              "pointer-events-auto font-body flex items-center gap-2 font-medium leading-snug tracking-[0.04em] text-white/90 transition duration-500 hover:text-accent",
              isFeatured
                ? "text-base sm:text-lg md:text-xl"
                : "text-sm sm:text-[0.95rem] md:text-base lg:text-[1.05rem]",
            )}
          >
            <TeaserTitleIcon icon={film.icon} />
            <span>{film.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Homepage teaser under Reach — personal cuts + link to Vishh254 page */
export function Vishh254Teaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const introReady = useIntroReady();
  const sectionInView = useInViewport(sectionRef, "200px 0px");
  const films = VISHH254.teaserFilms;
  const displayOrder = buildTeaserDisplayOrder(films);
  const filmIndex = new Map(films.map((film, i) => [film.id, i]));

  useEffect(() => {
    if (!sectionInView) return;
    const featured = films.find((f) => f.featured);
    if (!featured) return;
    const img = new Image();
    img.decoding = "async";
    img.src = featured.poster;
  }, [sectionInView, films]);

  return (
    <section
      id={VISHH254_SECTION_ID}
      ref={sectionRef}
      className="relative isolate z-[2] overflow-hidden border-b border-white/10 bg-background"
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
              {VISHH254.title}{" "}
              <span className="text-accent">{VISHH254.titleAccent}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {VISHH254.lead}
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
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 max-md:hidden">
              Selected personal cuts · hover to preview
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 md:hidden">
              Selected personal cuts · tap Play to preview
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-accent">
              {String(films.length).padStart(2, "0")} cuts
            </p>
          </div>

          <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-5 md:hidden">
            {displayOrder.map((film) => (
              <TeaserFilmCard
                key={film.id}
                film={film}
                index={filmIndex.get(film.id) ?? 0}
                introReady={introReady}
              />
            ))}
          </div>

          <div className="mx-auto hidden w-full max-w-[92rem] flex-nowrap items-end justify-center gap-2 md:flex lg:gap-3 xl:gap-3.5">
            {displayOrder.map((film) => (
              <TeaserFilmCard
                key={film.id}
                film={film}
                index={filmIndex.get(film.id) ?? 0}
                introReady={introReady}
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
