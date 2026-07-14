"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function ServicesPreview() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-item",
        { y: 24, opacity: 0.35 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const current = services[active];

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`poster-${current.id}`}
        src={current.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <video
        key={current.id}
        className="absolute inset-0 h-full w-full object-cover"
        src={current.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />

      <div className="section-padding relative z-10 flex min-h-screen flex-col justify-center gap-16 py-28 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
        <div className="max-w-xl shrink-0">
          <p className="label mb-4">What we create</p>
          <h2 className="heading-lg mb-6 text-balance">
            Campaigns, film, and digital that people remember.
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-white/70">
            {current.teaser}
          </p>
          <Link
            href="/services"
            data-magnetic
            className="text-xs uppercase tracking-[0.2em] text-accent hover:text-accent-hover"
          >
            Explore what we create →
          </Link>
        </div>

        <nav
          className="w-full max-w-lg"
          aria-label="Studio services"
        >
          <ul className="space-y-0">
            {services.map((service, i) => {
              const isActive = active === i;
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    className="service-item group flex w-full items-center gap-5 border-b border-white/20 py-5 text-left transition-colors duration-300 hover:border-accent md:py-6"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors ${
                        isActive ? "text-accent" : "text-white/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display flex-1 text-2xl transition-colors duration-300 md:text-3xl lg:text-4xl ${
                        isActive ? "text-white" : "text-white/55"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`hidden text-[10px] uppercase tracking-[0.18em] transition-opacity sm:block ${
                        isActive ? "text-white/70 opacity-100" : "opacity-0"
                      }`}
                    >
                      {service.tags[0]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
