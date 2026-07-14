"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";

gsap.registerPlugin(ScrollTrigger);

const CRAFT = [
  {
    id: "light",
    title: "Light",
    line: "Mood before megapixels.",
    detail: "Every frame starts with intention — shadow, flare, and the emotion between.",
    media: MEDIA.studio[2],
  },
  {
    id: "lens",
    title: "Lens",
    line: "Perspective that sells the story.",
    detail: "Glass chosen for feeling, not habit. Wide when the world matters. Tight when the eyes do.",
    media: MEDIA.studio[0],
  },
  {
    id: "sound",
    title: "Sound",
    line: "Half the picture is invisible.",
    detail: "Score, silence, and texture that make the cut land harder than the visual alone.",
    media: MEDIA.studio[3],
  },
  {
    id: "color",
    title: "Color",
    line: "Grade like memory, not reality.",
    detail: "Palettes that brand the moment — warm enough to want, cold enough to remember.",
    media: MEDIA.reel[0]?.poster ?? MEDIA.studio[1],
  },
  {
    id: "cut",
    title: "Cut",
    line: "Rhythm is the real director.",
    detail: "Pace that holds attention without begging for it. Edit for pulse, not padding.",
    media: MEDIA.studio[4],
  },
  {
    id: "story",
    title: "Story",
    line: "Pretty without purpose is noise.",
    detail: "Strategy under the spectacle — so the work moves culture and the business.",
    media: MEDIA.studio[5],
  },
] as const;

export function CraftSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const current = CRAFT[active];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".craft-intro > *"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.85,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        el.querySelectorAll(".craft-row"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el.querySelector(".craft-list"),
            start: "top 75%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden border-y border-white/10"
    >
      {/* Atmospheric media — crossfades with active craft */}
      <div className="absolute inset-0" aria-hidden>
        {CRAFT.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.media}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="section-padding relative z-10 grid min-h-screen gap-16 py-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20 lg:py-32">
        <div className="craft-intro max-w-xl">
          <p className="label mb-5">The craft</p>
          <h2 className="heading-lg mb-6 text-balance">
            Six obsessions behind every stay and every drive.
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Not a service menu — the instincts we protect on every property shoot
            and vehicle launch. This is how hospitality and automotive work ends
            up feeling expensive.
          </p>

          <div className="mb-10 border-l-2 border-accent pl-5">
            <p className="font-display text-2xl text-white md:text-3xl">
              {current.line}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              {current.detail}
            </p>
          </div>

          <Link
            href="/about"
            data-magnetic
            className="label link-underline text-accent hover:text-accent-hover"
          >
            Inside the studio →
          </Link>
        </div>

        <div className="craft-list" role="list">
          {CRAFT.map((item, i) => {
            const isActive = active === i;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`craft-row group flex w-full items-baseline gap-5 border-b border-white/15 py-5 text-left transition-colors duration-300 md:gap-8 md:py-6 ${
                  isActive ? "border-accent" : "hover:border-white/35"
                }`}
              >
                <span
                  className={`font-mono text-xs tracking-[0.2em] transition-colors ${
                    isActive ? "text-accent" : "text-white/35"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span
                    className={`font-display text-3xl tracking-tight transition-colors duration-300 md:text-5xl ${
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`max-w-xs text-sm transition-opacity duration-300 md:text-right ${
                      isActive ? "text-white/70 opacity-100" : "opacity-0 md:opacity-40 md:group-hover:opacity-70"
                    }`}
                  >
                    {item.line}
                  </span>
                </span>
                <span
                  className={`hidden h-2 w-2 shrink-0 rounded-full bg-accent transition-transform duration-300 md:block ${
                    isActive ? "scale-100" : "scale-0"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
