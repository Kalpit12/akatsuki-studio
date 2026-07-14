"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";
import { WorkProjectTile } from "@/components/work/WorkProjectTile";
import { MagneticButton } from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export function WorkIndex({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-work-hero]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      gsap.fromTo(
        "[data-work-tile]",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-work-grid]",
            start: "top 82%",
          },
        },
      );

      gsap.fromTo(
        "[data-work-cta]",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-work-cta]",
            start: "top 88%",
          },
        },
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative pt-28 md:pt-36">
      <div
        className="pointer-events-none absolute top-24 right-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-48 left-[-4%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.1)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <header className="section-padding relative pb-14 md:pb-20">
        <p data-work-hero className="label mb-5 text-accent">
          Our work
        </p>
        <h1 data-work-hero className="heading-xl max-w-4xl text-balance">
          Our most recent{" "}
          <span className="text-accent">works</span>
          <span
            className="ml-1.5 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle shadow-[0_0_16px_rgba(225,6,0,0.7)]"
            aria-hidden
          />
        </h1>
        <span
          data-work-hero
          className="mt-6 block h-px w-16 bg-accent/70 shadow-[0_0_10px_rgba(225,6,0,0.45)]"
          aria-hidden
        />
        <p
          data-work-hero
          className="mt-6 max-w-xl border-l border-accent/35 pl-4 text-base leading-relaxed text-muted md:text-lg"
        >
          Vibrant visuals that tell powerful stories — films and campaigns from
          recent years.
        </p>
      </header>

      <div data-work-grid className="section-padding relative pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16">
          {projects.map((project, i) => (
            <WorkProjectTile key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      <section
        data-work-cta
        className="section-padding relative overflow-hidden border-t border-accent/20 py-24 md:py-32"
      >
        <div
          className="pointer-events-none absolute top-1/2 right-[10%] h-56 w-56 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="label mb-4 text-accent">Next chapter</p>
            <h2 className="heading-lg max-w-2xl text-balance">
              Like what you see?
              <br />
              Let&apos;s <span className="text-accent">connect</span>.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Tell us what you&apos;re building — we&apos;ll tell you how the work
              should land.
            </p>
          </div>
          <MagneticButton href="/contact" variant="primary">
            Let&apos;s Talk →
          </MagneticButton>
        </div>

        <div className="relative mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          <Link href="/services" className="transition hover:text-white">
            Services
          </Link>
          <Link href="/clients" className="transition hover:text-white">
            Clients
          </Link>
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
        </div>
      </section>
    </div>
  );
}
