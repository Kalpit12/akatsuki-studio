"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useInViewport } from "@/hooks/useInViewport";
import { useVisibilityRatio } from "@/hooks/useVisibilityRatio";
import { DESKTOP_MQ, isFinePointer } from "@/lib/gsap-mobile";
import { PORTFOLIO_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const REELS = [
  {
    ...MEDIA.reel[0],
    label: "Connect Coffee",
    tag: "Hospitality",
    meta: "Coffee Experience",
  },
  {
    video: MEDIA.about,
    poster: MEDIA.aboutPoster,
    label: "Huawei",
    tag: "Launch",
    meta: "Product Film",
  },
  {
    ...MEDIA.reel[2],
    label: "Autobox",
    tag: "Automotive",
    meta: "Retail · Brand",
  },
  {
    ...MEDIA.reel[3],
    label: "11 Motors",
    tag: "Automotive",
    meta: "Retail",
  },
  {
    ...MEDIA.reel[4],
    label: "BTS",
    tag: "Production",
    meta: "Behind the scenes",
  },
] as const;

/** Shared footprint — every reel tile + CTA uses the same vertical frame */
const REEL_CARD_SIZE =
  "relative w-auto shrink-0 aspect-[9/16] max-md:h-[min(58vw,17.5rem)] max-md:max-h-none max-md:snap-center md:h-full md:max-h-full";

type ReelItem = (typeof REELS)[number];

function ReelCard({
  item,
  index,
  allowLoad,
  onRatioChange,
}: {
  item: ReelItem;
  index: number;
  allowLoad: boolean;
  onRatioChange: (index: number, ratio: number) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const ratio = useVisibilityRatio(cardRef);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    onRatioChange(index, ratio);
  }, [index, ratio, onRatioChange]);

  const handlePointerEnter = useCallback(() => {
    if (isFinePointer()) setHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (isFinePointer()) setHovered(false);
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (isFinePointer()) return;
    if ((event.target as HTMLElement).closest("button")) return;
    setHovered((active) => !active);
  }, []);

  const handleMobilePlay = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setHovered(true);
  }, []);

  const handleMobilePause = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <article
      ref={cardRef}
      className={cn(REEL_CARD_SIZE, "group")}
      data-cursor-label="Play"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
    >
      <div className="relative h-full w-full overflow-hidden border border-white/10 bg-black">
        <LazyVideoPlayer
          src={item.video}
          poster={item.poster}
          className="absolute inset-0 h-full w-full"
          videoClassName="object-cover object-center"
          playOnHover={allowLoad}
          hoverActive={hovered}
          mobileTapControls
          onMobilePause={handleMobilePause}
          showMuteOnly
          showControls={false}
          showPlayOverlay={false}
          unloadWhenHidden
        />
        {allowLoad && !hovered ? (
          <button
            type="button"
            onClick={handleMobilePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition active:bg-black/35 md:hidden"
            aria-label={`Play ${item.label} reel`}
          >
            <span className="relative inline-flex items-center gap-2.5 overflow-hidden border border-white/20 bg-black/60 px-4 py-2.5 backdrop-blur-md">
              <span
                className="absolute inset-y-0 left-0 w-px bg-accent"
                aria-hidden
              />
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0 fill-current text-white/75"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.22em] text-white/75 uppercase">
                Play
              </span>
            </span>
          </button>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/35" />
        <div
          className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-start justify-between p-4 md:p-5">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
            {item.tag}
          </span>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 p-4 pb-5 md:p-5 md:pb-6">
          <div
            className="mb-2 h-px w-10 origin-left scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100 md:mb-3"
            aria-hidden
          />
          <h3 className="font-display text-2xl leading-[1.05] tracking-tight text-white/65 transition duration-500 group-hover:text-white md:text-3xl lg:text-4xl">
            {item.label}
          </h3>
          <p className="mt-1.5 text-xs leading-normal text-white/35 transition duration-500 group-hover:text-white/65 md:text-sm">
            {item.meta}
          </p>
        </div>
      </div>
    </article>
  );
}

function ReelContinueCard() {
  return (
    <Link
      href={PORTFOLIO_PATH}
      data-magnetic
      className={cn(
        REEL_CARD_SIZE,
        "group flex flex-col justify-between border border-white/15 bg-white/[0.03] p-5 md:p-6",
      )}
    >
      <p className="label text-accent">Continue</p>
      <div>
        <h3 className="font-display text-xl leading-tight text-balance transition group-hover:text-accent md:text-2xl lg:text-3xl">
          See every brand we&apos;ve worked with.
        </h3>
        <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] text-white/60 transition group-hover:text-white md:text-xs">
          All work →
        </span>
      </div>
    </Link>
  );
}

export function ReelSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterDesktopRef = useRef<HTMLParagraphElement>(null);
  const counterMobileRef = useRef<HTMLParagraphElement>(null);
  const ratiosRef = useRef<Map<number, number>>(new Map());
  const counterIndexRef = useRef(0);
  const introReady = useIntroReady();
  const sectionInView = useInViewport(sectionRef, "200px 0px");
  const allowLoad = introReady && sectionInView;

  const updateCounter = useCallback((index: number, ratio: number) => {
    ratiosRef.current.set(index, ratio);

    let bestIndex = 0;
    let bestRatio = 0;
    ratiosRef.current.forEach((value, key) => {
      if (value > bestRatio) {
        bestRatio = value;
        bestIndex = key;
      }
    });

    if (bestRatio < 0.15 || bestIndex === counterIndexRef.current) return;

    counterIndexRef.current = bestIndex;
    const label = `${String(bestIndex + 1).padStart(2, "0")} / ${String(REELS.length).padStart(2, "0")}`;
    if (counterDesktopRef.current) counterDesktopRef.current.textContent = label;
    if (counterMobileRef.current) counterMobileRef.current.textContent = label;
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const pinReel = () => {
        const travel = () =>
          Math.max(track.scrollWidth - window.innerWidth, window.innerHeight * 0.65);

        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${travel()}`,
            pin: true,
            pinType: "transform",
            scrub: 0.2,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            anticipatePin: 0,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      };

      mm.add(DESKTOP_MQ, pinReel);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-reel-section
      className="relative isolate z-[2] bg-background max-md:py-16 md:flex md:h-[100svh] md:flex-col md:overflow-hidden"
    >
      <div className="section-padding relative z-20 flex shrink-0 items-end justify-between gap-6 max-md:pt-16 max-md:pb-3 md:pt-24 md:pb-4">
        <div>
          <p className="label mb-2 md:mb-3">Studio reel</p>
          <h2 className="heading-lg max-w-xl text-balance">
            Motion in every direction.
          </h2>
          <p className="mt-2 text-xs text-muted md:hidden">
            Swipe the reel →
          </p>
        </div>
        <div className="hidden max-w-[14rem] shrink-0 text-right md:block">
          <p className="text-sm text-muted">
            Scroll to scrub the reel — selected cuts from recent productions.
          </p>
          <p
            ref={counterDesktopRef}
            className="mt-2 font-mono text-xs tracking-[0.2em] text-accent"
          >
            01 / {String(REELS.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="section-padding relative z-20 mb-3 hidden shrink-0 md:mb-4 md:block">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-accent"
            style={{ willChange: sectionInView ? "transform" : undefined }}
          />
        </div>
      </div>

      <div className="relative max-md:-mx-6 max-md:overflow-x-auto max-md:overflow-y-visible max-md:pb-2 max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:min-h-0 md:flex-1 md:overflow-hidden md:pb-7">
        <div
          ref={trackRef}
          className={cn(
            "flex w-max max-w-none items-end gap-3 px-6 max-md:snap-x max-md:snap-mandatory md:gap-4 md:px-12 lg:gap-5 lg:px-20",
            sectionInView && "md:will-change-transform",
          )}
        >
          {REELS.map((item, i) => (
            <ReelCard
              key={item.label}
              item={item}
              index={i}
              allowLoad={allowLoad}
              onRatioChange={updateCounter}
            />
          ))}

          <ReelContinueCard />
        </div>
      </div>

      <div className="section-padding pointer-events-none absolute bottom-3 left-0 z-20 md:hidden">
        <p
          ref={counterMobileRef}
          className="font-mono text-xs tracking-[0.2em] text-accent"
        >
          01 / {String(REELS.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
