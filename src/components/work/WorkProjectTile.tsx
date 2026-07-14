"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

const TILE_LAYOUT = [
  "md:col-span-7 aspect-[16/11]",
  "md:col-span-5 aspect-[4/5] md:mt-16",
  "md:col-span-5 aspect-[4/5] md:-mt-8",
  "md:col-span-7 aspect-[16/11] md:mt-20",
] as const;

export function WorkProjectTile({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const layout = TILE_LAYOUT[index % TILE_LAYOUT.length];

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

  // Touch / coarse pointers: preview when the tile is in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
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

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={`/work/${project.slug}`}
      data-work-tile
      data-cursor-label="View"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn("group relative col-span-1 block", layout)}
    >
      <div className="relative h-full w-full overflow-hidden bg-white/[0.03]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered ? "scale-105 opacity-0" : "scale-100 opacity-100",
          )}
          aria-hidden
        />
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0",
          )}
          src={project.coverVideo}
          poster={project.coverImage}
          muted
          loop
          playsInline
          preload="metadata"
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500",
            hovered ? "opacity-90" : "opacity-60",
          )}
        />

        {/* Accent rim on hover */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 border transition-all duration-500",
            hovered ? "border-accent/70 shadow-[inset_0_0_40px_rgba(225,6,0,0.12)]" : "border-transparent",
          )}
        />

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className="label text-white/55">
              {project.category}
              <span className="mx-2 text-white/25">/</span>
              {project.year}
            </p>
            <span
              className={cn(
                "label text-accent transition-all duration-500",
                hovered ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0",
              )}
            >
              View project →
            </span>
          </div>

          <div className="overflow-hidden">
            <h2
              className={cn(
                "font-display text-2xl leading-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-3xl lg:text-[2.1rem]",
                hovered ? "-translate-y-0" : "translate-y-0",
              )}
            >
              {project.client}
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/65 md:text-[15px]">{project.title}</p>
        </div>
      </div>
    </Link>
  );
}
