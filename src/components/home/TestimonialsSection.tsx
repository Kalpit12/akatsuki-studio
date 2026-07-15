"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PAIR_SIZE = testimonials.length <= 3 ? testimonials.length : 2;
const PAIR_DURATION_MS = 5000;
const PAIR_COUNT = Math.ceil(testimonials.length / PAIR_SIZE);

function TestimonialCard({
  item,
  index,
}: {
  item: (typeof testimonials)[number];
  index: number;
}) {
  return (
    <article className="group relative flex h-full min-h-[22rem] flex-col border border-white/10 bg-white/[0.02] transition duration-500 hover:border-accent/35 hover:bg-accent/[0.03] md:min-h-[24rem]">
      <span
        className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-accent via-accent/50 to-transparent"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-2 right-5 font-display text-6xl leading-none text-accent/20 transition duration-500 group-hover:text-accent/40 md:right-6 md:text-7xl"
        aria-hidden
      >
        ”
      </span>

      <div className="relative flex h-full flex-col p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="label text-white/35">{item.client}</p>
        </div>

        <blockquote className="font-display text-lg leading-snug text-white md:text-xl lg:leading-snug">
          {item.quote}
        </blockquote>

        <footer className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-xs text-accent">
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{item.name}</p>
            <p className="mt-0.5 text-xs text-muted">{item.title}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [pairIndex, setPairIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-testimonial-head]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 80%" },
        },
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (paused || PAIR_COUNT <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setPairIndex((prev) => (prev + 1) % PAIR_COUNT);
    }, PAIR_DURATION_MS);

    return () => window.clearInterval(id);
  }, [paused]);

  const start = pairIndex * PAIR_SIZE;
  const visible = testimonials.slice(start, start + PAIR_SIZE);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-y border-white/10 py-28 md:py-36"
    >
      <div
        className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.14)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="section-padding relative">
        <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-testimonial-head className="label mb-4 text-accent">
              Testimonials
            </p>
            <h2
              data-testimonial-head
              className="heading-lg max-w-xl text-balance"
            >
              Words from our partners
            </h2>
          </div>
          <p
            data-testimonial-head
            className="max-w-xs text-sm leading-relaxed text-muted md:pb-1 md:text-right"
          >
            From Zona and Autobox to creators and brands of every kind — voices
            from the roster.
          </p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <div className="relative min-h-[22rem] md:min-h-[24rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={pairIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "grid gap-5 lg:gap-6",
                  visible.length >= 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2",
                )}
              >
                {visible.map((item, i) => (
                  <TestimonialCard
                    key={item.id}
                    item={item}
                    index={start + i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
              {String(pairIndex + 1).padStart(2, "0")} /{" "}
              {String(PAIR_COUNT).padStart(2, "0")}
            </p>

            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial pairs">
              {Array.from({ length: PAIR_COUNT }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === pairIndex}
                  aria-label={`Show testimonials ${i * 2 + 1} and ${i * 2 + 2}`}
                  onClick={() => setPairIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === pairIndex
                      ? "w-8 bg-accent shadow-[0_0_12px_rgba(225,6,0,0.55)]"
                      : "w-1.5 bg-white/25 hover:bg-white/45",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
