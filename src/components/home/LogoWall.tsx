"use client";

import type { ReactNode } from "react";
import LogoLoop from "@/components/ui/LogoLoop";
import type { LogoImageItem } from "@/components/ui/LogoLoop";
import { clientRoster } from "@/data/clients";

type LogoWallProps = {
  /** Hide the section intro (useful on /clients where the page hero already covers it) */
  showIntro?: boolean;
  /** Copy under the logo strip */
  caption?: ReactNode;
};

const DEFAULT_CAPTION = (
  <p className="mx-auto max-w-2xl font-display text-lg leading-snug text-balance md:text-xl">
    <span className="text-accent">Brands that chose impact over noise</span>
    <span className="text-white/80"> — and stayed for the work.</span>
  </p>
);

const imageLogos: LogoImageItem[] = clientRoster.map((client) => ({
  src: client.logo,
  alt: client.name,
  title: client.name,
  height: 40,
}));

export function LogoWall({
  showIntro = true,
  caption = DEFAULT_CAPTION,
}: LogoWallProps) {
  return (
    <section className="border-y border-white/10 py-14 md:py-16">
      {showIntro ? (
        <div className="section-padding mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <p className="label">Brands we&apos;ve worked with</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Trust earned in pixels, moments, and work that sticks.
          </p>
        </div>
      ) : null}

      <div className="relative overflow-hidden" style={{ height: 88 }}>
        <LogoLoop
          className="logo-wall-logoloop"
          logos={imageLogos}
          speed={100}
          direction="left"
          logoHeight={40}
          gap={48}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#090909"
          ariaLabel="Brands we have worked with"
        />
      </div>

      {caption ? (
        <div className="section-padding mt-8 text-center md:mt-10">
          {typeof caption === "string" ? (
            <p className="mx-auto max-w-2xl font-display text-lg leading-snug text-balance text-white/80 md:text-xl">
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
