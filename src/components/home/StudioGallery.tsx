"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";

gsap.registerPlugin(ScrollTrigger);

const SPACES = [
  {
    src: MEDIA.studio[0],
    label: "01",
    title: "First frame",
    detail: "Atmosphere that stops the scroll",
    layout: "md:col-span-7 md:row-span-2 md:min-h-[640px]",
  },
  {
    src: MEDIA.studio[1],
    label: "02",
    title: "Golden hour",
    detail: "Light we wait for every time",
    layout: "md:col-span-5 md:min-h-[310px]",
  },
  {
    src: MEDIA.studio[2],
    label: "03",
    title: "On the move",
    detail: "Pace, energy, and desire",
    layout: "md:col-span-5 md:min-h-[310px]",
  },
  {
    src: MEDIA.studio[3],
    label: "04",
    title: "Quiet detail",
    detail: "Frames shot to convert",
    layout: "md:col-span-4 md:min-h-[280px]",
  },
  {
    src: MEDIA.studio[4],
    label: "05",
    title: "Product craft",
    detail: "Detail that sells the brand",
    layout: "md:col-span-4 md:min-h-[280px]",
  },
  {
    src: MEDIA.studio[5],
    label: "06",
    title: "Heat & heart",
    detail: "Moments people feel twice",
    layout: "md:col-span-4 md:min-h-[280px]",
  },
] as const;

function stackOffsets(grid: HTMLElement, items: HTMLElement[]) {
  // Clear transforms so we measure true layout positions
  gsap.set(items, { clearProps: "transform" });
  const gridRect = grid.getBoundingClientRect();
  const cx = gridRect.left + gridRect.width / 2;
  const cy = gridRect.top + gridRect.height / 2;

  return items.map((item, i) => {
    const rect = item.getBoundingClientRect();
    const ix = rect.left + rect.width / 2;
    const iy = rect.top + rect.height / 2;
    return {
      x: cx - ix,
      y: cy - iy,
      rotation: (i - (items.length - 1) / 2) * 5,
      scale: 0.72,
    };
  });
}

export function StudioGallery() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const grid = el.querySelector<HTMLElement>(".gallery-grid");
    const items = gsap.utils.toArray<HTMLElement>(".gallery-item", el);
    const captions = gsap.utils.toArray<HTMLElement>(".gallery-caption", el);
    const intro = el.querySelectorAll(".gallery-intro > *");
    if (!grid || !items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        intro,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        let offsets = stackOffsets(grid, items);

        items.forEach((item, i) => {
          gsap.set(item, {
            x: offsets[i].x,
            y: offsets[i].y,
            scale: offsets[i].scale,
            rotation: offsets[i].rotation,
            zIndex: items.length - i,
            transformOrigin: "center center",
          });
        });
        gsap.set(captions, { opacity: 0, y: 18 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: grid,
            start: "top 78%",
            end: "top 15%",
            scrub: 1.15,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              // Remeasure stack offsets from true layout
              gsap.set(items, { x: 0, y: 0, scale: 1, rotation: 0 });
              offsets = stackOffsets(grid, items);
            },
          },
        });

        items.forEach((item, i) => {
          tl.fromTo(
            item,
            {
              x: () => offsets[i].x,
              y: () => offsets[i].y,
              scale: () => offsets[i].scale,
              rotation: () => offsets[i].rotation,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              stagger: 0,
            },
            0,
          );
        });

        tl.to(
          captions,
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
          },
          0.5,
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          items,
          { y: 48, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: grid,
              start: "top 82%",
              once: true,
            },
          },
        );
        gsap.set(captions, { opacity: 1, y: 0 });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-x-clip py-28 md:py-36">
      <div
        className="pointer-events-none absolute top-16 right-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-24 left-[-4%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.1)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="gallery-intro section-padding relative mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-4 text-accent">The space</p>
          <h2 className="heading-lg max-w-2xl text-balance">
            Where ideas become{" "}
            <span className="text-accent">cinema</span>
            <span
              className="ml-1.5 inline-block h-2 w-2 rounded-full bg-accent align-middle shadow-[0_0_14px_rgba(225,6,0,0.7)]"
              aria-hidden
            />
          </h2>
          <span
            className="mt-5 block h-px w-16 bg-accent/70 shadow-[0_0_10px_rgba(225,6,0,0.45)]"
            aria-hidden
          />
        </div>
        <p className="max-w-sm border-l border-accent/35 pl-4 text-sm leading-relaxed text-muted md:pb-1">
          On location across Kenya — sets, streets, and spaces where brands come
          to life, framed so the work feels as expensive as the brand.
        </p>
      </div>

      <div className="gallery-grid section-padding relative grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        {SPACES.map((space, i) => (
          <article
            key={space.title}
            className={`gallery-item group relative min-h-[280px] overflow-hidden bg-white/[0.03] will-change-transform ${space.layout}`}
            data-cursor-label={space.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={space.src}
              alt={`${space.title} — Akatsuki Studio`}
              className="absolute inset-0 h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />

            <div className="gallery-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
              <div>
                <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-accent">
                  {space.label}
                </p>
                <h3 className="font-display text-xl text-white md:text-2xl">
                  {space.title}
                </h3>
                <p className="mt-1 max-w-[16rem] text-sm text-white/55 opacity-100 transition duration-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  {space.detail}
                </p>
              </div>
              <span
                className="mb-1 hidden h-px w-10 origin-right scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100 md:block"
                aria-hidden
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
