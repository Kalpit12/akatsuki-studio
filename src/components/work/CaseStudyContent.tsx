"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { useWorkMorph } from "@/components/work/WorkMorphProvider";
import { cn } from "@/lib/utils";

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
      <section className="relative h-[85vh] min-h-[500px]">
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
            playInView
            showControls={false}
            showPlayOverlay={false}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <motion.div
          className="section-padding pointer-events-none relative flex h-full flex-col justify-end pb-16 pt-32"
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
        <section className="section-padding grid gap-16 py-24 md:grid-cols-2">
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
          <section className="section-padding py-16">
            <p className="label mb-8">Films</p>
            <div className="grid justify-items-center gap-8 sm:grid-cols-2">
              {project.films.map((film) => (
                <figure key={film.video} className="w-full max-w-[22rem]">
                  <LazyVideoPlayer
                    src={film.video}
                    poster={film.poster}
                    className="aspect-[9/16] border border-white/10"
                    showPlayOverlay
                    showControls
                  />
                  <figcaption className="mt-3 font-mono text-[10px] tracking-[0.2em] text-white/45">
                    {film.label}
                  </figcaption>
                </figure>
              ))}
            </div>
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
                <div className="relative aspect-[16/10]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <video
                    className="relative h-full w-full object-cover transition group-hover:scale-105"
                    src={p.coverVideo}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onMouseEnter={(e) => void e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
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
