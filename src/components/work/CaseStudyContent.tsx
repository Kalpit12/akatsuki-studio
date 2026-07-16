"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectFilm } from "@/data/projects";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { useWorkMorph } from "@/components/work/WorkMorphProvider";
import { cn } from "@/lib/utils";

const workFilmPlayerClass =
  "aspect-[9/16] border border-white/10 transition-all duration-500 hover:border-accent/55 hover:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)] max-md:active:border-accent/55 max-md:active:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)] max-md:focus-within:border-accent/55 max-md:focus-within:shadow-[0_0_18px_rgba(225,6,0,0.35),inset_0_0_28px_rgba(225,6,0,0.1)]";

const workFilmFigureBaseClass =
  "mx-auto w-full max-w-[22rem] shrink-0 max-md:max-w-none";

function WorkFilmFigure({
  film,
  className,
}: {
  film: ProjectFilm;
  className?: string;
}) {
  return (
    <figure className={cn(workFilmFigureBaseClass, className)}>
      <LazyVideoPlayer
        src={film.video}
        poster={film.poster}
        className={workFilmPlayerClass}
        showControls={false}
        showPlayOverlay
      />
      <figcaption
        className={cn(
          "mt-3 font-mono text-[10px] tracking-[0.2em]",
          film.featured ? "text-accent" : "text-white/45",
        )}
      >
        {film.label}
      </figcaption>
    </figure>
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
        <section className="section-padding grid gap-16 max-md:py-16 py-24 md:grid-cols-2">
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
          <section className="section-padding max-md:py-12 py-16">
            <p className="label mb-8">Films</p>

            {/* Mobile: full-width stacked films for every case study */}
            <div className="flex flex-col gap-8 md:hidden">
              {project.films.map((film) => (
                <WorkFilmFigure key={film.video} film={film} />
              ))}
            </div>

            {project.slug === "macaash-investments" ? (
              <div className="hidden flex-col gap-10 md:flex">
                <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-8 lg:max-w-6xl">
                  {project.films.slice(0, 3).map((film) => (
                    <WorkFilmFigure key={film.video} film={film} />
                  ))}
                </div>
                <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-8">
                  {project.films.slice(3).map((film) => (
                    <WorkFilmFigure key={film.video} film={film} />
                  ))}
                </div>
              </div>
            ) : project.slug === "tvs-energy" ? (
              <div className="hidden flex-nowrap justify-center gap-6 overflow-x-auto pb-2 md:flex">
                {project.films.map((film) => (
                  <WorkFilmFigure
                    key={film.video}
                    film={film}
                    className="max-w-[18rem]"
                  />
                ))}
              </div>
            ) : (
              <div className="hidden justify-items-center gap-8 md:grid md:grid-cols-2">
                {project.films.map((film) => (
                  <WorkFilmFigure
                    key={film.video}
                    film={film}
                    className={cn(film.featured && "md:col-span-2 md:max-w-[26rem]")}
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}

        {project.gallery.length > 0 ? (
          <section className="section-padding py-16">
            <p className="label mb-8">Gallery</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${project.title} gallery ${i + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </section>
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
            <MagneticButton href="/contact">Start Your Project</MagneticButton>
          </div>
        </section>
      </motion.div>
    </article>
  );
}
