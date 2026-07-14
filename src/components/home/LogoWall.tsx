"use client";

import type { ReactNode } from "react";
import { Marquee, MarqueeItem } from "@/components/ui/Marquee";
import { clientRoster, clients } from "@/data/clients";

type LogoWallProps = {
  /** Hide the section intro (useful on /clients where the page hero already covers it) */
  showIntro?: boolean;
  /** Copy under the logo strip */
  caption?: ReactNode;
};

/** First logos likely in view when the strip mounts — fetch early, skip React preload. */
const EAGER_COUNT = 8;

export function LogoWall({
  showIntro = true,
  caption = (
    <>
      Brands that chose impact over noise — and stayed for the work.
    </>
  ),
}: LogoWallProps) {
  return (
    <section className="border-y border-white/10 py-14 md:py-16">
      {showIntro ? (
        <div className="section-padding mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <p className="label">Brands we&apos;ve worked with</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Trust earned in pixels, metal, and moments that stick.
          </p>
        </div>
      ) : null}

      {/* Full-bleed white strip — keeps brand colors true */}
      <div className="relative">
        {/* Top edge: faint rail + beam traveling right */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-2 -translate-y-1/2 overflow-visible"
          aria-hidden
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent/30" />
          <span className="logo-wall-beam logo-wall-beam--right" />
        </div>

        {/* Bottom edge: faint rail + beam traveling left */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-2 translate-y-1/2 overflow-visible"
          aria-hidden
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent/30" />
          <span className="logo-wall-beam logo-wall-beam--left" />
        </div>

        <div className="relative overflow-hidden bg-white py-7 md:py-9">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24"
            aria-hidden
          />
          <Marquee speed={32} className="gap-0">
            {clients.map((client, i) => {
              // Marquee duplicates children — only eager-load the first pass of near-viewport logos
              const eager =
                i < EAGER_COUNT && i < clientRoster.length;
              return (
                <MarqueeItem
                  key={`${client.slug}-${i}`}
                  className="text-transparent"
                >
                  <span className="inline-flex h-14 items-center justify-center gap-12 px-4 md:h-16 md:gap-16 md:px-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.logo}
                      alt={client.name}
                      title={client.name}
                      width={180}
                      height={52}
                      loading={eager ? "eager" : "lazy"}
                      // fetchPriority=low skips React 19 auto <link rel="preload">
                      fetchPriority="low"
                      decoding="async"
                      className="block h-11 w-auto max-w-[12rem] object-contain object-center transition duration-300 md:h-[3.25rem] md:max-w-[14rem]"
                    />
                    <span
                      className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-accent"
                      aria-hidden
                    />
                  </span>
                </MarqueeItem>
              );
            })}
          </Marquee>
        </div>
      </div>

      {caption ? (
        <div className="section-padding mt-8 text-center md:mt-10">
          {typeof caption === "string" ? (
            <p className="font-display text-lg leading-snug text-white/80 md:text-xl">
              {caption}
            </p>
          ) : (
            caption
          )}
        </div>
      ) : null}
    </section>
  );
}
