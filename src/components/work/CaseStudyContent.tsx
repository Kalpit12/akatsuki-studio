"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectFilm } from "@/data/projects";
import { getFilmOrientation } from "@/data/projects";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { useWorkMorph } from "@/components/work/WorkMorphProvider";
import { WorkGallery } from "@/components/work/WorkGallery";
import { cn } from "@/lib/utils";

const workFilmPlayerChrome =
  "border border-white/10 transition-all duration-500 hover:border-accent/55 hover:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)] max-md:active:border-accent/55 max-md:active:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)] max-md:focus-within:border-accent/55 max-md:focus-within:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)]";

type WorkFilmLayout = "desktop" | "mobile-landscape" | "mobile-portrait-grid" | "mobile-portrait-stack";

function splitFilmsByOrientation(films: ProjectFilm[]) {
  return {
    landscape: films.filter((film) => getFilmOrientation(film) === "horizontal"),
    portrait: films.filter((film) => getFilmOrientation(film) === "vertical"),
  };
}

function usesCuratedMobileLayout(project: Project, films: ProjectFilm[]) {
  const { landscape, portrait } = splitFilmsByOrientation(films);
  return (
    project.slug === "kyra-platinum-imports" ||
    project.slug === "tvs-energy" ||
    films.length > 4 ||
    (landscape.length > 0 && portrait.length > 0)
  );
}

function getFilmPlayerClass(film: ProjectFilm, layout: WorkFilmLayout) {
  const orientation = getFilmOrientation(film);

  if (layout === "desktop") {
    return cn(
      orientation === "horizontal" ? "aspect-video w-full" : "aspect-[9/16] w-full",
      workFilmPlayerChrome,
    );
  }

  if (layout === "mobile-landscape") {
    return cn("aspect-video w-full", workFilmPlayerChrome);
  }

  if (layout === "mobile-portrait-grid") {
    return cn("aspect-[9/16] w-full", workFilmPlayerChrome);
  }

  return cn("mx-auto aspect-[9/16] w-full max-w-[18rem]", workFilmPlayerChrome);
}

function getFilmFigureClass(
  film: ProjectFilm,
  layout: WorkFilmLayout,
  className?: string,
) {
  if (layout === "desktop") {
    const orientation = getFilmOrientation(film);
    return cn(
      "mx-auto w-full shrink-0",
      orientation === "horizontal"
        ? "md:max-w-[min(100%,32rem)] lg:max-w-[34rem]"
        : "md:max-w-[18rem] lg:max-w-[20rem]",
      className,
    );
  }

  if (layout === "mobile-landscape") {
    return cn("w-full", className);
  }

  if (layout === "mobile-portrait-grid") {
    return cn("w-full min-w-0", className);
  }

  return cn("mx-auto w-full max-w-[18rem]", className);
}

function WorkFilmFigure({
  film,
  layout,
  className,
  soloPlaybackKey,
  onSoloPlaybackClaim,
}: {
  film: ProjectFilm;
  layout: WorkFilmLayout;
  className?: string;
  soloPlaybackKey?: string | null;
  onSoloPlaybackClaim?: (src: string) => void;
}) {
  const isMobileLayout = layout !== "desktop";

  return (
    <figure className={getFilmFigureClass(film, layout, className)}>
      <LazyVideoPlayer
        src={film.video}
        poster={film.poster}
        className={getFilmPlayerClass(film, layout)}
        showControls={false}
        showPlayOverlay
        soloPlaybackKey={isMobileLayout ? soloPlaybackKey : undefined}
        onSoloPlaybackClaim={isMobileLayout ? onSoloPlaybackClaim : undefined}
      />
      <figcaption
        className={cn(
          "font-mono tracking-[0.2em]",
          layout === "mobile-portrait-grid"
            ? "mt-2 text-[9px] leading-snug"
            : "mt-3 text-[10px]",
          film.featured ? "text-accent" : "text-white/45",
        )}
      >
        {film.label}
      </figcaption>
    </figure>
  );
}

function WorkFilmsMobile({
  project,
  films,
}: {
  project: Project;
  films: ProjectFilm[];
}) {
  const [soloPlaybackKey, setSoloPlaybackKey] = useState<string | null>(null);
  const onSoloPlaybackClaim = useCallback((src: string) => {
    setSoloPlaybackKey(src);
  }, []);

  const { landscape, portrait } = splitFilmsByOrientation(films);
  const curated = usesCuratedMobileLayout(project, films);

  if (curated) {
    return (
      <div className="flex flex-col gap-5 md:hidden">
        {landscape.length > 0 ? (
          <div className="flex flex-col gap-5">
            {landscape.map((film) => (
              <WorkFilmFigure
                key={film.video}
                film={film}
                layout="mobile-landscape"
                soloPlaybackKey={soloPlaybackKey}
                onSoloPlaybackClaim={onSoloPlaybackClaim}
              />
            ))}
          </div>
        ) : null}

        {portrait.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {portrait.map((film) => (
              <WorkFilmFigure
                key={film.video}
                film={film}
                layout="mobile-portrait-grid"
                soloPlaybackKey={soloPlaybackKey}
                onSoloPlaybackClaim={onSoloPlaybackClaim}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (films.length > 2) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 md:hidden">
        {films.map((film) => (
          <WorkFilmFigure
            key={film.video}
            film={film}
            layout="mobile-portrait-grid"
            soloPlaybackKey={soloPlaybackKey}
            onSoloPlaybackClaim={onSoloPlaybackClaim}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:hidden">
      {films.map((film) => (
        <WorkFilmFigure
          key={film.video}
          film={film}
          layout="mobile-portrait-stack"
          soloPlaybackKey={soloPlaybackKey}
          onSoloPlaybackClaim={onSoloPlaybackClaim}
        />
      ))}
    </div>
  );
}

function WorkFilmsDesktop({
  project,
  films,
}: {
  project: Project;
  films: ProjectFilm[];
}) {
  if (project.slug === "macaash-investments") {
    return (
      <div className="hidden flex-col gap-10 md:flex">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-center gap-8">
          {films.slice(0, 3).map((film) => (
            <WorkFilmFigure key={film.video} film={film} layout="desktop" />
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-end justify-center gap-8">
          {films.slice(3).map((film) => (
            <WorkFilmFigure key={film.video} film={film} layout="desktop" />
          ))}
        </div>
      </div>
    );
  }

  if (project.slug === "tvs-energy" || project.slug === "kyra-platinum-imports") {
    const { landscape, portrait } = splitFilmsByOrientation(films);

    return (
      <div className="hidden flex-col gap-10 md:flex">
        {landscape.length > 0 ? (
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-center gap-6 lg:gap-8">
            {landscape.map((film) => (
              <WorkFilmFigure
                key={film.video}
                film={film}
                layout="desktop"
                className="md:max-w-[min(100%,28rem)] lg:max-w-[30rem]"
              />
            ))}
          </div>
        ) : null}
        {portrait.length > 0 ? (
          <div
            className={cn(
              "mx-auto w-full max-w-6xl items-end",
              portrait.length > 3
                ? "grid grid-cols-2 justify-items-center gap-6 lg:grid-cols-3 lg:gap-8"
                : "flex flex-wrap justify-center gap-6 lg:gap-8",
            )}
          >
            {portrait.map((film) => (
              <WorkFilmFigure key={film.video} film={film} layout="desktop" />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const allPortrait = films.every((film) => getFilmOrientation(film) === "vertical");

  if (allPortrait && films.length === 2) {
    return (
      <div className="mx-auto hidden max-w-4xl items-end justify-center gap-8 md:flex">
        {films.map((film) => (
          <WorkFilmFigure key={film.video} film={film} layout="desktop" />
        ))}
      </div>
    );
  }

  return (
    <div className="hidden justify-items-center gap-8 md:grid md:grid-cols-2">
      {films.map((film) => (
        <WorkFilmFigure
          key={film.video}
          film={film}
          layout="desktop"
          className={cn(film.featured && "md:col-span-2 md:max-w-[26rem]")}
        />
      ))}
    </div>
  );
}

export function CaseStudyContent({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  const { activeSlug, lockHero } = useWorkMorph();
  const arrivingViaMorph = activeSlug === project.slug;
  const hideHeroMedia = arrivingViaMorph && lockHero;
  const [contentIn, setContentIn] = useState(!arrivingViaMorph);

  useEffect(() => {
    if (!arrivingViaMorph) {
      setContentIn(true);
      return;
    }
    if (!lockHero) {
      const id = window.setTimeout(() => setContentIn(true), 80);
      return () => window.clearTimeout(id);
    }
    setContentIn(false);
  }, [arrivingViaMorph, lockHero]);

  return (
    <article>
      <section className="relative max-md:h-[72vh] max-md:min-h-0 h-[85vh] min-h-[500px]">
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            hideHeroMedia ? "opacity-0" : "opacity-100",
          )}
        >
          <LazyVideoPlayer
            src={project.heroVideo}
            poster={project.coverImage}
            className="absolute inset-0 h-full w-full"
            alwaysPlay
            showControls={false}
            showPlayOverlay={false}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <motion.div
          className="section-padding pointer-events-none relative flex h-full flex-col justify-end max-md:pb-12 max-md:pt-24 pb-16 pt-32"
          initial={arrivingViaMorph ? { opacity: 0, y: 28 } : false}
          animate={
            contentIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <p className="label mb-4">{project.category}</p>
          <h1 className="heading-xl">{project.title}</h1>
          <p className="mt-4 text-xl text-muted">{project.client}</p>
        </motion.div>
      </section>

      <motion.div
        initial={arrivingViaMorph ? { opacity: 0, y: 36 } : false}
        animate={contentIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <section className="section-padding grid gap-16 max-md:gap-10 max-md:py-12 py-24 md:grid-cols-2">
          <div>
            <p className="label mb-4">Challenge</p>
            <p className="text-lg leading-relaxed text-white/80">{project.challenge}</p>
          </div>
          <div>
            <p className="label mb-4">Creative Direction</p>
            <p className="text-lg leading-relaxed text-white/80">{project.direction}</p>
          </div>
        </section>

        {project.films && project.films.length > 0 ? (
          <section className="section-padding max-md:py-10 py-16">
            <div className="mb-6 flex items-end justify-between gap-4 max-md:mb-5 md:mb-8">
              <p className="label">Films</p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-accent md:hidden">
                {String(project.films.length).padStart(2, "0")} cuts
              </p>
            </div>
            <WorkFilmsMobile project={project} films={project.films} />
            <WorkFilmsDesktop project={project} films={project.films} />
          </section>
        ) : null}

        {project.gallery.length > 0 ? (
          <WorkGallery
            title={project.title}
            images={project.gallery}
            layout={
              project.slug === "kyra-platinum-imports" ? "landscape" : "standard"
            }
          />
        ) : null}

        <section className="section-padding py-20">
          <p className="label mb-8">Credits</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {project.credits.map((c) => (
              <li key={c.role}>
                <p className="text-sm text-muted">{c.role}</p>
                <p className="font-medium">{c.name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section-padding pb-32">
          <p className="label mb-8">Related Projects</p>
          <div className="grid gap-8 md:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden border border-transparent transition-all duration-500 group-hover:border-accent/55 group-hover:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)] max-md:active:border-accent/55 max-md:active:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="text-muted">{p.client}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-16 text-center">
            <MagneticButton href="/contact">Start the Project</MagneticButton>
          </div>
        </section>
      </motion.div>
    </article>
  );
}
