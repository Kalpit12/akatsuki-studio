"use client";

import Link from "next/link";
import type { Client } from "@/data/clients";
import type { ClientWork } from "@/data/clientFilms";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { WorkGallery } from "@/components/work/WorkGallery";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PORTFOLIO_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ClientPageContent({
  client,
  work,
}: {
  client: Client;
  work: ClientWork;
}) {
  const galleryFilms = work.films.length > 1 ? work.films.slice(1) : [];
  const galleryImages = work.gallery
    ? work.heroImage
      ? work.gallery.filter((src) => src !== work.heroImage)
      : work.gallery
    : [];

  return (
    <article>
      <section className="relative h-[85vh] min-h-[500px]">
        <div className="absolute inset-x-0 top-[4.5rem] bottom-0 md:top-[5.25rem]">
          {work.heroVideo ? (
            <LazyVideoPlayer
              src={work.heroVideo}
              poster={work.heroPoster}
              className="absolute inset-0 h-full w-full"
              alwaysPlay
              showControls={false}
              showPlayOverlay={false}
            />
          ) : work.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        </div>
        <div className="section-padding pointer-events-none relative flex h-full flex-col justify-end pb-16 pt-[5.5rem] md:pt-28">
          <p className="label mb-4">{client.detail}</p>
          <h1 className="heading-xl">{client.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{work.excerpt}</p>
        </div>
      </section>

      {galleryFilms.length > 0 ? (
        <section className="section-padding py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label mb-3 text-accent">Productions</p>
              <h2 className="heading-md">Films we made together</h2>
            </div>
            <p className="font-mono text-xs tracking-[0.2em] text-white/45">
              {String(work.films.length).padStart(2, "0")} cuts
            </p>
          </div>

          <div
            className={cn(
              "grid justify-items-center gap-8",
              work.filmsGrid === "staggered"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-12 xl:gap-x-8"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {galleryFilms.map((film) => (
              <figure
                key={film.video}
                className={cn("w-full max-w-[22rem]", film.gridClass)}
              >
                <LazyVideoPlayer
                  src={film.video}
                  poster={film.poster}
                  className="aspect-[9/16] border border-white/10"
                  showPlayOverlay
                  showControls
                />
                <figcaption className="mt-3 font-mono text-[10px] tracking-[0.2em] text-white/45">
                  {film.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {galleryImages.length > 0 ? (
        <WorkGallery
          title={client.name}
          images={galleryImages}
          layout="landscape"
          sectionLabel="Gallery"
          sectionHeading="On location"
          className="py-16 md:py-20"
        />
      ) : null}

      <section className="section-padding border-t border-white/10 py-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="label mb-3 text-muted">Explore more</p>
            <h2 className="heading-md max-w-md text-balance">
              See every brand we&apos;ve partnered with.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <MagneticButton href={PORTFOLIO_PATH} variant="outline">
              All portfolio
            </MagneticButton>
            <MagneticButton href="/#work">View work</MagneticButton>
          </div>
        </div>
        <p className="mt-8">
          <Link
            href={PORTFOLIO_PATH}
            className="label text-muted transition hover:text-accent"
          >
            ← Back to portfolio
          </Link>
        </p>
      </section>
    </article>
  );
}
