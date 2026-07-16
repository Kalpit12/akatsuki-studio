"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { useWorkMorph } from "@/components/work/WorkMorphProvider";
import { cn } from "@/lib/utils";

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

  const morphingAway = activeSlug === project.slug && lockHero;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
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
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
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
