"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getHomeWorkCards, type HomeWorkCard } from "@/data/homeWork";
import { MOBILE_MQ, DESKTOP_MQ } from "@/lib/gsap-mobile";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useInViewport } from "@/hooks/useInViewport";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Compact stack offsets beside the heading */
const STACK = [
  { x: 0, y: 0, rotation: -7, scale: 1 },
  { x: 12, y: 5, rotation: 4, scale: 0.96 },
  { x: -10, y: 7, rotation: -3, scale: 0.92 },
  { x: 8, y: 11, rotation: 5, scale: 0.88 },
  { x: -14, y: 3, rotation: -5, scale: 0.84 },
  { x: 16, y: 9, rotation: 3, scale: 0.8 },
] as const;

type StackOffset = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  opacity: number;
};

function stackPose(index: number): StackOffset {
  const preset = STACK[index % STACK.length];
  const layer = Math.floor(index / STACK.length);
  return {
    x: preset.x + layer * 3,
    y: preset.y + layer * 4,
    rotation: preset.rotation + layer * 1.2,
    scale: Math.max(0.72, preset.scale - layer * 0.04),
    zIndex: 40 - index,
    opacity: index < 5 ? 1 : index < 8 ? 0.55 : 0,
  };
}

function measureStackOffsets(
  items: HTMLElement[],
  originEl: HTMLElement,
  stackScale: number,
): StackOffset[] {
  gsap.set(items, { clearProps: "transform,opacity,zIndex" });

  const originRect = originEl.getBoundingClientRect();
  const ox = originRect.left + originRect.width / 2;
  const oy = originRect.top + originRect.height / 2;

  return items.map((item, i) => {
    const rect = item.getBoundingClientRect();
    const ix = rect.left + rect.width / 2;
    const iy = rect.top + rect.height / 2;
    const stack = stackPose(i);

    return {
      x: ox - ix + stack.x,
      y: oy - iy + stack.y,
      rotation: stack.rotation,
      scale: stack.scale * stackScale,
      zIndex: stack.zIndex,
      opacity: stack.opacity,
    };
  });
}

/** Top-to-bottom unfold — one column, tight stagger */
function verticalStagger(index: number) {
  return index * 0.018;
}

function WorkStackCard({
  card,
  index,
  allowVideo,
}: {
  card: HomeWorkCard;
  index: number;
  allowVideo: boolean;
}) {
  return (
    <Link
      href={card.href}
      className={cn(
        "work-stack-card group block w-full [backface-visibility:hidden] [contain:layout_style_paint] [transform:translateZ(0)]",
        card.orientation === "horizontal" && "col-span-2",
      )}
      data-cursor-label="View"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 transition-[border-color,box-shadow] duration-500 group-hover:border-accent/50 group-hover:shadow-[0_24px_60px_rgba(225,6,0,0.16)]",
          card.orientation === "horizontal"
            ? "aspect-[16/10] sm:aspect-video"
            : "aspect-[9/14]",
        )}
      >
        {card.video ? (
          <LazyVideoPlayer
            src={card.video}
            poster={card.poster}
            className="absolute inset-0 h-full w-full"
            videoClassName="object-cover object-center"
            playOnHover={allowVideo}
            showMuteOnly
            showControls={false}
            showPlayOverlay={false}
            unloadWhenHidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading={index < 4 ? "eager" : "lazy"}
            decoding="async"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="work-card-label absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p className="font-mono text-[9px] tracking-[0.22em] text-white/50 uppercase">
            {card.subtitle}
          </p>
          <p className="mt-1 font-display text-base leading-tight text-white md:text-lg">
            {card.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProjects() {
  const cards = getHomeWorkCards();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [staticLayout, setStaticLayout] = useState(false);
  const introReady = useIntroReady();
  const sectionInView = useInViewport(sectionRef, "200px 0px");
  const allowVideo = introReady && sectionInView;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!section || !pin || !stage) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setStaticLayout(true);
      return;
    }

    let mounted = true;

    const setAnimationState = (complete: boolean) => {
      if (!mounted) return;
      stage.toggleAttribute("data-work-animating", !complete);
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const buildTimeline = (end: string, stackScale: number) => {
        const items = gsap.utils.toArray<HTMLElement>(".work-stack-card", stage);
        const labels = gsap.utils.toArray<HTMLElement>(".work-card-label", stage);
        const origin = stage.querySelector<HTMLElement>("[data-stack-origin]");
        if (!items.length || !origin) return;

        let offsets = measureStackOffsets(items, origin, stackScale);

        items.forEach((item, i) => {
          gsap.set(item, {
            x: offsets[i].x,
            y: offsets[i].y,
            rotation: offsets[i].rotation,
            scale: offsets[i].scale,
            zIndex: offsets[i].zIndex,
            opacity: offsets[i].opacity,
            transformOrigin: "center center",
            force3D: true,
          });
        });
        gsap.set(labels, { opacity: 0, y: 8 });

        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: pin,
            start: "top 12%",
            end,
            pin: stage,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onEnter: () => setAnimationState(false),
            onEnterBack: () => setAnimationState(false),
            onLeave: () => setAnimationState(true),
            onLeaveBack: () => setAnimationState(false),
            onRefreshInit: () => {
              offsets = measureStackOffsets(items, origin, stackScale);
            },
          },
        });

        items.forEach((item, i) => {
          tl.fromTo(
            item,
            {
              x: () => offsets[i].x,
              y: () => offsets[i].y,
              rotation: () => offsets[i].rotation,
              scale: () => offsets[i].scale,
              opacity: () => offsets[i].opacity,
              zIndex: () => offsets[i].zIndex,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              zIndex: 1,
            },
            verticalStagger(i),
          );
        });

        tl.to(labels, { opacity: 1, y: 0, stagger: 0.015 }, 0.28);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      mm.add(MOBILE_MQ, () => buildTimeline("+=72%", 0.5));
      mm.add(DESKTOP_MQ, () => buildTimeline("+=88%", 0.38));
    }, section);

    stage.setAttribute("data-work-animating", "true");

    return () => {
      mounted = false;
      stage.removeAttribute("data-work-animating");
      ctx.revert();
    };
  }, [cards.length]);

  const headerBlock = (
    <div className="section-padding relative z-10 max-md:py-12 md:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl shrink-0">
          <p className="label mb-4 text-accent">The work</p>
          <h2 className="heading-lg text-balance">
            Films and campaigns made{" "}
            <span className="text-accent">impossible</span> to scroll past
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

        <div className="flex w-full flex-col items-end gap-6 lg:w-[min(42vw,400px)] lg:shrink-0">
          {!staticLayout ? (
            <div
              data-stack-origin
              className="relative h-[min(48vw,200px)] w-full max-w-[320px] lg:h-[220px] lg:max-w-none"
              aria-hidden
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} data-featured-section className="relative isolate z-[1] bg-background">
      <div
        className="pointer-events-none absolute top-10 right-[6%] z-0 hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.16)_0%,transparent_70%)] blur-3xl md:block"
        aria-hidden
      />

      <div ref={pinRef} className="relative">
        <div ref={stageRef} className="relative">
          {headerBlock}

          <div className="section-padding pb-6 pt-2 md:pb-8">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {cards.map((card, index) => (
                <WorkStackCard
                  key={card.key}
                  card={card}
                  index={index}
                  allowVideo={allowVideo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding pb-16 md:pb-24">
        <p className="text-center font-mono text-[10px] tracking-[0.24em] text-white/40 uppercase">
          {String(cards.length).padStart(2, "0")} partners · hover to preview · tap to explore
        </p>
      </div>
    </section>
  );
}
