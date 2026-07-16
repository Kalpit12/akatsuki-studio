"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProjects } from "@/data/projects";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useNearViewport } from "@/hooks/useNearViewport";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const CROSSFADE =
  "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

function FeaturedProjectVideo({
  src,
  poster,
  active,
  warm,
  allowLoad,
}: {
  src: string;
  poster: string;
  active: boolean;
  warm: boolean;
  allowLoad: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const shouldMount = allowLoad && !videoFailed;
  const shouldPlay = allowLoad && active && !videoFailed;
  const showVideo = shouldPlay && videoReady;

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
  }, [src]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldPlay) return;

    const play = () => {
      video.muted = true;
      void video.play().catch(() => {});
    };

    const onReady = () => setVideoReady(true);

    if (video.readyState >= 2) {
      onReady();
      play();
    } else {
      video.addEventListener("canplay", play);
      video.addEventListener("loadeddata", onReady);
    }

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [shouldPlay, src]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!active) {
      video.pause();
      setVideoReady(false);
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [active]);

  if (!shouldMount) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          CROSSFADE,
          showVideo ? "scale-[1.02] opacity-0" : "scale-100 opacity-100",
        )}
        loading={active || warm ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={active ? "high" : warm ? "low" : "auto"}
        aria-hidden
      />
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          CROSSFADE,
          showVideo ? "scale-[1.02] opacity-100" : "scale-100 opacity-0",
        )}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={shouldPlay}
        preload={shouldPlay || warm ? "auto" : "metadata"}
        onError={() => setVideoFailed(true)}
      />
    </>
  );
}

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const introReady = useIntroReady();
  const sectionNear = useNearViewport(containerRef, "400px 0px");
  const allowLoad = introReady && sectionNear;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mounted = true;

    const ctx = gsap.context(() => {
      projects.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.project-panel-${i}`,
          start: "top 55%",
          end: "bottom 45%",
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

  useEffect(() => {
    if (!introReady) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [introReady]);

  useEffect(() => {
    if (!sectionNear) return;

    const posters = projects.map((p) => p.coverImage);
    const run = () => {
      for (const href of posters) {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      }
    };

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle.call(window, run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 400);
    return () => window.clearTimeout(t);
  }, [sectionNear, projects]);

  return (
    <section ref={containerRef} data-featured-section className="relative">
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

      {projects.map((project, i) => {
        const isActive = activeIndex === i;
        const isWarm = Math.abs(activeIndex - i) === 1;

        return (
          <div
            key={project.slug}
            className={`project-panel-${i} relative h-screen`}
          >
            <Link
              href={`/work/${project.slug}`}
              className="group relative block h-full overflow-hidden"
              data-cursor-label="View"
            >
              <FeaturedProjectVideo
                src={project.coverVideo}
                poster={project.coverImage}
                active={isActive}
                warm={isWarm}
                allowLoad={allowLoad}
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
        );
      })}
    </section>
  );
}
