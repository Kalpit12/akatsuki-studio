"use client";

import Link from "next/link";
import type { Project } from "@/data/projects";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CaseStudyContent({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  return (
    <article>
      <section className="relative h-[85vh] min-h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          // Case hero is LCP on this page — keep eager, but low so React skips unused preloads
          fetchPriority="low"
          decoding="async"
          aria-hidden
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={project.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <div className="section-padding relative flex h-full flex-col justify-end pb-16 pt-32">
          <p className="label mb-4">{project.category}</p>
          <h1 className="heading-xl">{project.title}</h1>
          <p className="mt-4 text-xl text-muted">{project.client}</p>
        </div>
      </section>

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

      <section className="section-padding py-16">
        <p className="label mb-8">Behind The Scenes</p>
        <div className="grid gap-4 md:grid-cols-2">
          {project.gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${project.title} gallery ${i + 1}`}
              className="aspect-[16/10] w-full rounded-2xl object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <section className="section-padding border-y border-white/10 py-20">
        <p className="label mb-10">Campaign Results</p>
        <div className="grid gap-8 md:grid-cols-3">
          {project.results.map((r) => (
            <div key={r.label}>
              <p className="font-display text-5xl text-accent">{r.value}</p>
              <p className="label mt-2">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

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
    </article>
  );
}
