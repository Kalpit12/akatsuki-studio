"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";

gsap.registerPlugin(ScrollTrigger);

const REELS = [
  { ...MEDIA.reel[0], tag: "Campaign · Brand", meta: "Kitchen · 0:28" },
  { ...MEDIA.reel[1], tag: "Commercial", meta: "Lifestyle · 0:45" },
  { ...MEDIA.reel[2], tag: "Launch", meta: "Film · 0:40" },
  { ...MEDIA.reel[3], tag: "Brand", meta: "Atmosphere · 0:32" },
  { ...MEDIA.reel[4], tag: "Detail", meta: "Craft · 0:22" },
  { ...MEDIA.reel[5], tag: "Commercial", meta: "Space · 0:35" },
] as const;

export function ReelSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    let mounted = true;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(track.scrollWidth - window.innerWidth, window.innerHeight)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (!mounted) return;
            const count = REELS.length;
            const idx = Math.min(
              count - 1,
              Math.floor(self.progress * count + 0.001),
            );
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        },
      });
    }, section);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen flex-col overflow-hidden bg-background"
    >
      <div className="section-padding relative z-20 flex shrink-0 items-end justify-between gap-8 pt-28 pb-6 md:pt-32 md:pb-8">
        <div>
          <p className="label mb-4">Studio reel</p>
          <h2 className="heading-lg max-w-xl text-balance">
            Motion in every direction.
          </h2>
        </div>
        <div className="hidden max-w-[14rem] text-right md:block">
          <p className="text-sm text-muted">
            Scroll to scrub the reel — selected cuts from recent productions.
          </p>
          <p className="mt-3 font-mono text-xs tracking-[0.2em] text-accent">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(REELS.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="section-padding relative z-20 mb-5 shrink-0 md:mb-6">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-accent will-change-transform"
          />
        </div>
      </div>

      {/* Cards live in remaining viewport height so titles never clip */}
      <div className="relative min-h-0 flex-1 pb-8 md:pb-10">
        <div
          ref={trackRef}
          className="flex h-full items-stretch gap-4 px-6 will-change-transform md:gap-5 md:px-12 lg:gap-6 lg:px-20"
        >
          {REELS.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <article
                key={item.label}
                className="group relative h-full w-[78vw] shrink-0 md:w-[52vw] lg:w-[42vw]"
                data-cursor-label="Play"
              >
                {/* Media clipped; copy sits above with safe padding */}
                <div className="absolute inset-0 overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <video
                    className={`h-full w-full object-cover transition duration-700 ${
                      isActive ? "scale-100 opacity-100" : "scale-[1.04] opacity-75"
                    }`}
                    src={item.video}
                    autoPlay={isActive}
                    muted
                    loop
                    playsInline
                    preload={isActive ? "metadata" : "none"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/35" />
                  <div
                    className={`absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>

                <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-start justify-between p-5 md:p-7">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {item.tag}
                  </span>
                </div>

                <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 p-5 pb-6 md:p-7 md:pb-8">
                  <div
                    className={`mb-3 h-px w-12 origin-left bg-accent transition duration-500 md:mb-4 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <h3
                    className={`font-display text-3xl leading-[1.05] tracking-tight transition duration-500 md:text-4xl lg:text-5xl ${
                      isActive ? "text-white" : "text-white/65"
                    }`}
                  >
                    {item.label}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-normal transition duration-500 ${
                      isActive ? "text-white/65" : "text-white/35"
                    }`}
                  >
                    {item.meta}
                  </p>
                </div>
              </article>
            );
          })}

          <Link
            href="/work"
            data-magnetic
            className="group relative flex h-full w-[70vw] shrink-0 flex-col justify-between border border-white/15 bg-white/[0.03] p-8 md:w-[40vw] md:p-10"
          >
            <p className="label text-accent">Continue</p>
            <div>
              <h3 className="heading-md mb-4 max-w-xs text-balance leading-tight transition group-hover:text-accent">
                See the full case studies.
              </h3>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 transition group-hover:text-white">
                All work →
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="section-padding pointer-events-none absolute bottom-4 left-0 z-20 md:hidden">
        <p className="font-mono text-xs tracking-[0.2em] text-accent">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(REELS.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
