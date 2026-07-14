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
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      gsap.fromTo(
        "[data-work-tile]",
        { y: 80, opacity: 0, clipPath: "inset(12% 8% 12% 8%)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: "[data-work-grid]",
            start: "top 82%",
          },
        },
      );

      gsap.fromTo(
        "[data-work-cta]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
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
    <div ref={rootRef} className="pt-28 md:pt-36">
      <header className="section-padding pb-14 md:pb-20">
        <p data-work-hero className="label mb-5 text-accent">
          Selected work
        </p>
        <h1
          data-work-hero
          className="heading-xl max-w-4xl text-balance"
        >
          Recent films &amp; campaigns
        </h1>
        <p
          data-work-hero
          className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
        >
          Visuals built to move people — and brands — past the scroll. A selection
          of briefs from recent years.
        </p>
        <div
          data-work-hero
          className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6"
        >
          <p className="label text-white/40">{String(projects.length).padStart(2, "0")} projects</p>
          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          <p className="label text-white/40">Hover to preview</p>
        </div>
      </header>

      <div data-work-grid className="section-padding pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-14">
          {projects.map((project, i) => (
            <WorkProjectTile key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      <section
        data-work-cta
        className="section-padding border-t border-white/10 py-24 md:py-32"
      >
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="label mb-4 text-accent">Next brief</p>
            <h2 className="heading-lg max-w-2xl text-balance">
              Like what you see? Let&apos;s build the next one.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Tell us what you&apos;re launching — we&apos;ll tell you how the work
              should land.
            </p>
          </div>
          <MagneticButton href="/contact" variant="primary">
            Start a project →
          </MagneticButton>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
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
