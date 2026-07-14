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
      gsap.fromTo(
        ".hero-line",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
          delay: 2.8,
        },
      );

      gsap.fromTo(
        ".hero-eyebrow, .hero-support, .hero-cta",
        { opacity: 0, y: 20 },
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
        y: -80,
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
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="hero-video-wrap absolute inset-0 scale-105 will-change-transform">
          <VideoBackground src={MEDIA.hero} poster={MEDIA.heroPoster} overlay />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.7)_100%)]"
          aria-hidden
        />

        <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 pt-36 pb-20 text-center md:pt-44 lg:pt-48">
          <p className="hero-eyebrow label mb-6 text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Hospitality & automotive · Nairobi, Kenya
          </p>
          <h1
            ref={titleRef}
            className="heading-xl max-w-5xl text-balance text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)]"
          >
            <span className="hero-line block">Great property.</span>
            <span className="hero-line block">Quiet showroom.</span>
            <span className="hero-line block">
              Let&apos;s{" "}
              <RotatingText
                words={HERO_VERBS}
                className="text-accent"
                startDelayMs={4200}
              />{" "}
              that.
            </span>
          </h1>
          <p className="hero-support mt-8 max-w-xl text-base leading-relaxed text-white/75 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-lg">
            Cinematic campaigns for hotels, resorts, and automotive brands —
            built to fill rooms, move metal, and own the feed.
          </p>
          <div className="hero-cta mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
            <MagneticButton href="/contact">Start a Project →</MagneticButton>
            <MagneticButton
              href="/work"
              variant="outline"
              className="border-white/40 bg-black/25 backdrop-blur-sm hover:border-accent hover:bg-accent/15"
            >
              See the work ↓
            </MagneticButton>
          </div>
          <span className="hero-cta mt-10 animate-pulse-glow text-xs uppercase tracking-[0.3em] text-white/55">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
