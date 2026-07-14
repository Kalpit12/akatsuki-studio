"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function WorkProjectTile({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hovered) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered]);

  // Touch / coarse pointers: preview when the tile media is in view
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    if (!window.matchMedia("(hover: none)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
          setHovered(true);
        } else {
          video.pause();
          video.currentTime = 0;
          setHovered(false);
        }
      },
      { threshold: 0.55 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={rootRef}
      href={`/work/${project.slug}`}
      data-work-tile
      data-cursor-label="View"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.03] md:rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered ? "scale-[1.04] opacity-0" : "scale-100 opacity-100",
          )}
          aria-hidden
        />
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered ? "scale-[1.04] opacity-100" : "scale-100 opacity-0",
          )}
          src={project.coverVideo}
          poster={project.coverImage}
          muted
          loop
          playsInline
          preload="metadata"
        />

        <span
          className={cn(
            "pointer-events-none absolute inset-0 border transition-all duration-500",
            hovered
              ? "border-accent/55 shadow-[inset_0_0_28px_rgba(225,6,0,0.1)]"
              : "border-transparent",
          )}
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

        <span
          className={cn(
            "label shrink-0 pt-1 text-accent transition-all duration-500",
            hovered ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
          )}
        >
          View project →
        </span>
      </div>

      <span className="sr-only">
        Project {String(index + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}
