"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEDIA } from "@/lib/cloudinary";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RotatingText } from "@/components/ui/RotatingText";

const HERO_VERBS = ["change", "elevate", "amplify", "ignite", "transform"];

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      gsap.fromTo(
        ".hero-line",
        { y: mobile ? 18 : 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: mobile ? 0.85 : 1.1,
          stagger: mobile ? 0.08 : 0.1,
          ease: "power4.out",
          delay: 2.8,
        },
      );

      gsap.fromTo(
        ".hero-eyebrow, .hero-support, .hero-cta",
        { opacity: 0, y: mobile ? 12 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 3.2,
          ease: "power3.out",
          stagger: 0.1,
        },
      );

      gsap.to(".hero-video-wrap", {
        scale: 1.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-content", {
        y: mobile ? -40 : -80,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "55% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh] overflow-x-clip">
      <div className="sticky top-0 h-screen overflow-x-clip overflow-y-hidden">
        <div className="hero-video-wrap absolute inset-0 scale-105 will-change-transform">
          <VideoBackground src={MEDIA.hero} poster={MEDIA.heroPoster} overlay />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.7)_100%)]"
          aria-hidden
        />

        <div className="hero-content relative z-10 flex h-full w-full max-w-[100vw] flex-col items-center justify-center overflow-x-clip px-4 pt-24 pb-14 text-center sm:px-6 sm:pt-36 sm:pb-20 md:pt-44 lg:pt-48">
          <p className="hero-eyebrow label mb-3 max-w-[22rem] px-1 text-[9px] leading-relaxed tracking-[0.14em] text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:mb-6 sm:max-w-none sm:text-xs sm:tracking-[0.2em] md:text-xs">
            Creative studio · Nairobi, Kenya
          </p>

          <h1
            ref={titleRef}
            className="font-display w-full max-w-[min(100%,22rem)] text-[1.7rem] font-medium leading-[1.22] tracking-[-0.025em] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)] sm:max-w-xl sm:text-[clamp(1.85rem,5vw,3.25rem)] sm:leading-[1.12] md:max-w-5xl md:text-[clamp(2.5rem,calc(0.55rem+5.8vw),7rem)] md:leading-[1.02] md:tracking-[-0.03em] md:text-balance"
          >
            <span className="hero-line block">Great brand.</span>
            <span className="hero-line mt-[0.06em] block md:mt-[0.08em]">
              Quiet feed.
            </span>
            {/* Desktop keeps one locked line; mobile allows natural spacing */}
            <span className="hero-line mt-[0.06em] block md:mt-[0.08em]">
              <span className="inline max-md:inline md:whitespace-nowrap">
                Let&apos;s{" "}
                <RotatingText
                  words={HERO_VERBS}
                  className="text-accent"
                  startDelayMs={4200}
                />{" "}
                that.
              </span>
            </span>
          </h1>

          <p className="hero-support mt-4 max-w-[20rem] text-[0.8125rem] leading-relaxed text-white/75 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:mt-8 sm:max-w-xl sm:text-base md:text-lg">
            Cinematic campaigns for brands of every kind — built to earn
            attention, build trust, and own the feed.
          </p>

          <div className="hero-cta mt-6 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-6">
            <MagneticButton href="/contact" className="justify-center">
              Start a Project →
            </MagneticButton>
            <MagneticButton
              href="/work"
              variant="outline"
              className="justify-center border-white/40 bg-black/25 backdrop-blur-sm hover:border-accent hover:bg-accent/15"
            >
              See the work ↓
            </MagneticButton>
          </div>

          <span className="hero-cta mt-7 animate-pulse-glow text-[10px] uppercase tracking-[0.3em] text-white/55 sm:mt-10 sm:text-xs">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
