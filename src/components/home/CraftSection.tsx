"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useMobileCenterActive } from "@/hooks/useMobileCenterActive";

gsap.registerPlugin(ScrollTrigger);

const CRAFT = [
  {
    id: "golden-hour",
    title: "Chasing golden hour.",
    line: "The light that sells the feeling.",
    detail: "We wait for the hour that makes every frame glow and feel like cinema.",
    media: "/Craft/chasing-golden-hour.webp",
  },
  {
    id: "coffee",
    title: "Looking for better coffee.",
    line: "Fuel for the long take.",
    detail: "Good shots take patience — and another round before the coffee goes cold.",
    media: "/Craft/looking-for-better-coffee.webp",
  },
  {
    id: "one-last-shot",
    title: 'Saying "one last shot."',
    line: "Never settle for almost.",
    detail: "The take after the take is usually the one that ends up in the cut.",
    media: "/Craft/saying-one-last-shot.webp",
  },
  {
    id: "colour-grade",
    title: "Colour grading at 2 AM.",
    line: "When the world goes quiet.",
    detail: "Late nights with the timeline — nudging hues until the frame finally feels right.",
    media: "/Craft/color-grading-at-2-am.webp",
  },
  {
    id: "cars",
    title: "Talking about cars.",
    line: "Obsession meets craft.",
    detail: "Lines, sound, and presence — the same instincts we bring to every launch.",
    media: "/Craft/talking-about-cars.webp",
  },
  {
    id: "next-idea",
    title: "Planning the next big idea.",
    line: "Always one frame ahead.",
    detail: "Even mid-shoot, the next concept is already forming — restlessness is part of the craft.",
    media: "/Craft/planning-the-next-big-idea.webp",
  },
] as const;

export const CRAFT_IMAGES = CRAFT.map((c) => c.media);

export function CraftSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const current = CRAFT[active];
  const introReady = useIntroReady();
  const { lockScrollSelection } = useMobileCenterActive(
    ref,
    'button[class*="craft-row-"]',
    setActive,
  );

  // Prefetch craft stills after intro so hover swaps stay snappy
  useEffect(() => {
    if (!introReady) return;

    const run = () => {
      for (const href of CRAFT_IMAGES) {
        const img = new Image();
        img.decoding = "async";
        img.src = href;
      }
    };

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle.call(window, run, { timeout: 2200 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 600);
    return () => window.clearTimeout(t);
  }, [introReady]);

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
      <div className="absolute inset-0" aria-hidden>
        {CRAFT.map((item, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.media}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "low" : "auto"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="section-padding relative z-10 grid min-h-screen gap-16 py-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20 lg:py-32">
        <div className="craft-intro max-w-xl">
          <p className="label mb-5">The craft</p>
          <h2 className="heading-lg mb-6 text-balance">
            Six obsessions behind every frame we ship.
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
            The little habits, inside jokes, and everyday rituals that quietly
            shape how we create, collaborate, and obsess over every project.
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
                onClick={() => {
                  setActive(i);
                  lockScrollSelection();
                }}
                className={cn(
                  "craft-row group flex w-full items-baseline gap-5 border-b py-5 text-left transition-colors duration-300 md:gap-8 md:py-6",
                  `craft-row-${i}`,
                  isActive ? "border-accent" : "border-white/15 hover:border-white/35",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs tracking-[0.2em] transition-colors duration-300",
                    isActive ? "text-accent" : "text-white/35",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span
                    className={cn(
                      "font-display text-2xl tracking-tight transition-colors duration-300 sm:text-3xl md:text-4xl",
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/70",
                    )}
                  >
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "max-w-xs text-sm transition-opacity duration-300 md:text-right",
                      isActive
                        ? "text-white/70 opacity-100"
                        : "opacity-0 md:opacity-40 md:group-hover:opacity-70",
                    )}
                  >
                    {item.line}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full bg-accent transition-transform duration-300",
                    isActive ? "scale-100" : "scale-0",
                  )}
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
