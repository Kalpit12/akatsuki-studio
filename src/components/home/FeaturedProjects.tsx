"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProjects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

function FeaturedProjectVideo({
  src,
  poster,
  active,
}: {
  src: string;
  poster: string;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (active) {
      // Ensure source is ready, then play — React `autoPlay` alone is unreliable
      // when panels toggle or when the file is large / below the fold.
      const play = () => {
        video.muted = true;
        const p = video.play();
        if (p) void p.catch(() => {});
      };

      if (video.readyState >= 2) play();
      else {
        video.addEventListener("loadeddata", play, { once: true });
        video.load();
      }
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before ready */
      }
    }
  }, [active, src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={active ? "auto" : "metadata"}
    />
  );
}

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mounted = true;

    const ctx = gsap.context(() => {
      projects.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.project-panel-${i}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (!mounted) return;
            setActiveIndex(i);
          },
          onEnterBack: () => {
            if (!mounted) return;
            setActiveIndex(i);
          },
        });
      });
    }, el);

    return () => {
      mounted = false;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={containerRef} className="relative">
      <div
        className="pointer-events-none absolute top-10 right-[6%] z-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-40 left-[-3%] z-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.1)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="section-padding relative z-10 py-24 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-4 text-accent">The work</p>
            <h2 className="heading-lg max-w-2xl text-balance">
              Films and campaigns made{" "}
              <span className="text-accent">impossible</span> to scroll past
              <span
                className="ml-1.5 inline-block h-2 w-2 rounded-full bg-accent align-middle shadow-[0_0_14px_rgba(225,6,0,0.7)]"
                aria-hidden
              />
            </h2>
            <span
              className="mt-5 block h-px w-16 bg-accent/70 shadow-[0_0_10px_rgba(225,6,0,0.45)]"
              aria-hidden
            />
          </div>
          <Link
            href="/work"
            className="label link-underline shrink-0 border-l border-accent/35 pl-4 text-accent hover:text-accent-hover"
          >
            All case studies →
          </Link>
        </div>
      </div>

      {projects.map((project, i) => (
        <div key={project.slug} className={`project-panel-${i} relative h-screen`}>
          <Link
            href={`/work/${project.slug}`}
            className="group relative block h-full overflow-hidden"
            data-cursor-label="View"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              aria-hidden
            />
            <FeaturedProjectVideo
              src={project.coverVideo}
              poster={project.coverImage}
              active={activeIndex === i}
            />
            <div className="absolute inset-0 bg-black/40 transition-colors duration-700 group-hover:bg-black/25" />

            <div className="section-padding relative flex h-full flex-col justify-end pb-20 md:pb-28">
              <p className="label mb-4">{project.category}</p>
              <h3 className="heading-lg mb-2">{project.title}</h3>
              <p className="text-lg text-white/70">{project.client}</p>
              <span className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] opacity-100 transition-all duration-500 md:opacity-0 md:group-hover:opacity-100">
                View Case Study <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}
