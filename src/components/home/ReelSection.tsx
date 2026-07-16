"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useInViewport } from "@/hooks/useInViewport";
import { useVisibilityRatio } from "@/hooks/useVisibilityRatio";
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

type ReelItem = (typeof REELS)[number];

function ReelCardVideo({
  src,
  poster,
  ratio,
  allowLoad,
}: {
  src: string;
  poster: string;
  ratio: number;
  allowLoad: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const failedRef = useRef(false);
  const isActive = ratio >= 0.52;
  const isWarm = ratio >= 0.12;
  const shouldMount = allowLoad && isWarm && !failedRef.current;
  const shouldPlay = allowLoad && isActive && !failedRef.current;

  useEffect(() => {
    failedRef.current = false;
  }, [src]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldPlay) return;

    const play = () => {
      video.muted = true;
      void video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else {
      video.addEventListener("canplay", play, { once: true });
      video.addEventListener("loadeddata", play, { once: true });
    }
  }, [shouldPlay, src]);

  useEffect(() => {
    const video = ref.current;
    if (!video || shouldPlay) return;
    video.pause();
    if (!isWarm) {
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [shouldPlay, isWarm]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          shouldPlay ? "opacity-0" : "opacity-100",
        )}
        loading={isWarm ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={isActive ? "high" : "low"}
        aria-hidden
      />
      {shouldMount ? (
        <video
          ref={ref}
          className={cn(
            "h-full w-full object-cover transition duration-500",
            isActive ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
          )}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={shouldPlay ? "auto" : "metadata"}
          onError={() => {
            failedRef.current = true;
          }}
        />
      ) : null}
    </>
  );
}

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
  const isActive = ratio >= 0.52;

  useEffect(() => {
    onRatioChange(index, ratio);
  }, [index, ratio, onRatioChange]);

  return (
    <article
      ref={cardRef}
      className="group relative h-full w-[78vw] shrink-0 md:w-[52vw] lg:w-[42vw]"
      data-cursor-label="Play"
    >
      <div className="absolute inset-0 overflow-hidden border border-white/10">
        <ReelCardVideo
          src={item.video}
          poster={item.poster}
          ratio={ratio}
          allowLoad={allowLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/35" />
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-start justify-between p-5 md:p-7">
        <span className="font-mono text-[10px] tracking-[0.22em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
          {item.tag}
        </span>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 p-5 pb-6 md:p-7 md:pb-8">
        <div
          className={cn(
            "mb-3 h-px w-12 origin-left bg-accent transition duration-500 md:mb-4",
            isActive ? "scale-x-100" : "scale-x-0",
          )}
        />
        <h3
          className={cn(
            "font-display text-3xl leading-[1.05] tracking-tight transition duration-500 md:text-4xl lg:text-5xl",
            isActive ? "text-white" : "text-white/65",
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-normal transition duration-500",
            isActive ? "text-white/65" : "text-white/35",
          )}
        >
          {item.meta}
        </p>
      </div>
    </article>
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
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const travel = () =>
        Math.max(track.scrollWidth - window.innerWidth, window.innerHeight * 0.75);

      gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${travel()}`,
          pin: !isMobile,
          scrub: isMobile ? 0.15 : 0.2,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          anticipatePin: isMobile ? 0 : 0.5,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-reel-section
      className="relative flex h-screen flex-col overflow-hidden bg-background"
    >
      <div className="section-padding relative z-20 flex shrink-0 items-end justify-between gap-8 pt-28 pb-6 md:pt-32 md:pb-8">
        <div>
          <p className="label mb-4">Studio reel</p>
          <h2 className="heading-lg max-w-xl text-balance">
            Motion in every direction.
          </h2>
        </div>
        <div className="hidden max-w-[14rem] text-right md:block">
          <p className="text-sm text-muted">
            Scroll to scrub the reel — selected cuts from recent productions.
          </p>
          <p
            ref={counterDesktopRef}
            className="mt-3 font-mono text-xs tracking-[0.2em] text-accent"
          >
            01 / {String(REELS.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="section-padding relative z-20 mb-5 shrink-0 md:mb-6">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-accent"
            style={{ willChange: sectionInView ? "transform" : undefined }}
          />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 pb-8 md:pb-10">
        <div
          ref={trackRef}
          className={cn(
            "flex h-full items-stretch gap-4 px-6 md:gap-5 md:px-12 lg:gap-6 lg:px-20",
            sectionInView && "will-change-transform",
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

          <Link
            href="/clients"
            data-magnetic
            className="group relative flex h-full w-[70vw] shrink-0 flex-col justify-between border border-white/15 bg-white/[0.03] p-8 md:w-[40vw] md:p-10"
          >
            <p className="label text-accent">Continue</p>
            <div>
              <h3 className="heading-md mb-4 max-w-xs text-balance leading-tight transition group-hover:text-accent">
                See every brand we&apos;ve worked with.
              </h3>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 transition group-hover:text-white">
                All work →
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="section-padding pointer-events-none absolute bottom-4 left-0 z-20 md:hidden">
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
