"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE, STATS } from "@/lib/constants";
import { MEDIA } from "@/lib/cloudinary";
import { CountUpStat } from "@/components/ui/CountUpStat";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  { label: "Seen", detail: "Not scrolled past", accent: false },
  { label: "Felt", detail: "Before it's explained", accent: true },
  { label: "Wanted", detail: "Desire in every frame", accent: false },
  { label: "Remembered", detail: "Long after the cut", accent: true },
] as const;

type AboutSectionProps = {
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  closing?: string;
  showStats?: boolean;
  showTruth?: boolean;
  /** Video source for the media panel */
  videoSrc?: string;
  videoPoster?: string;
  /** Homepage: media left. About page story can stay left. */
  mediaSide?: "left" | "right";
  showAboutLink?: boolean;
  /** Extra studio tour block (text left, video right) above the stats */
  showStudioFloor?: boolean;
};

const DEFAULT_PARAGRAPHS = [
  "At Akatsuki Studio, we don't measure success by the number of videos we deliver — we measure it by the impact they create. More enquiries. More engagement. More people remembering your brand.",
  "From cinematic commercials and industry-leading automotive content to real estate showcases, corporate events, product launches, social media campaigns, and websites that convert — every project starts with one question: what will this actually do for the business?",
];

export function AboutSection({
  eyebrow = "Who we are",
  title = "Measured by impact — not volume.",
  paragraphs = DEFAULT_PARAGRAPHS,
  closing = "Because anyone can post content. We create content people remember.",
  showStats = true,
  showTruth = true,
  videoSrc = MEDIA.about,
  videoPoster = MEDIA.aboutPoster,
  mediaSide = "left",
  showAboutLink = true,
  showStudioFloor = false,
}: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const mediaOnRight = mediaSide === "right";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".about-media, .about-copy > *"),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.95,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            once: true,
          },
        },
      );

      const mediaImg = el.querySelector<HTMLElement>(
        ".about-media-frame video, .about-media-frame img",
      );
      if (mediaImg) {
        gsap.fromTo(
          mediaImg,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.querySelector(".about-media"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (showStats) {
        gsap.fromTo(
          el.querySelectorAll(".stat-item"),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el.querySelector(".stats-grid"),
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [showStats]);

  const mediaPanel = (
    <div className="about-media relative lg:col-span-6">
      <div className="about-media-frame relative aspect-[16/10] overflow-hidden border border-white/10 md:aspect-[4/3] lg:aspect-[5/4] lg:min-h-[28rem]">
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-black/15" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 p-6 md:p-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent">EST.</p>
            <p className="mt-1 font-display text-2xl text-white">Nairobi</p>
          </div>
          <p className="max-w-[10rem] text-right text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/55">
            Film · Motors · Property
          </p>
        </div>
      </div>
    </div>
  );

  const copyPanel = (
    <div
      className={cn(
        "about-copy flex flex-col justify-center",
        mediaOnRight ? "lg:col-span-6" : "lg:col-span-6",
      )}
    >
      {showTruth ? (
        <div className="mb-10 border-l-2 border-accent pl-5">
          <p className="label mb-2 text-accent">The first question</p>
          <p className="max-w-lg font-display text-xl leading-snug text-white md:text-2xl">
            &ldquo;How many posts do you do per month?&rdquo;
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            Fair question. But we&apos;d rather ask, &ldquo;What are those posts
            actually doing for your business?&rdquo;
          </p>
        </div>
      ) : null}

      {paragraphs.map((text) => (
        <p
          key={text.slice(0, 48)}
          className="mb-5 max-w-xl text-base leading-relaxed text-muted last:mb-0 md:text-lg"
        >
          {text}
        </p>
      ))}

      {closing ? (
        <p className="mt-8 max-w-xl font-display text-xl text-white md:text-2xl">
          {closing}
        </p>
      ) : null}

      {showTruth ? (
        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
          {PILLARS.map((pillar) => (
            <li
              key={pillar.label}
              className={cn(
                "flex flex-col justify-between px-4 py-5 md:min-h-[7.5rem] md:px-5 md:py-6",
                pillar.accent ? "bg-white/[0.03]" : "bg-background",
              )}
            >
              <p
                className={cn(
                  "font-display text-xl tracking-tight md:text-2xl",
                  pillar.accent ? "text-accent" : "text-white",
                )}
              >
                {pillar.label}
              </p>
              <p className="mt-3 max-w-[11rem] text-[11px] leading-relaxed tracking-[0.04em] text-muted md:mt-4">
                {pillar.detail}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {showAboutLink && showTruth ? (
        <div className="mt-10">
          <Link
            href="/about"
            data-magnetic
            className="label link-underline text-accent hover:text-accent-hover"
          >
            More about the studio →
          </Link>
        </div>
      ) : null}
    </div>
  );

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-36">
      <div className="section-padding">
        <div className="mb-14 flex flex-col gap-4 border-b border-white/10 pb-10 md:mb-16 md:flex-row md:items-end md:justify-between md:pb-12">
          <div>
            <p className="label mb-4">{eyebrow}</p>
            <h2 className="heading-lg max-w-3xl text-balance">{title}</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:pb-1 md:text-right">
            {SITE.address}
            <span className="mt-1 block text-white/50">Creative production studio</span>
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {mediaOnRight ? (
            <>
              {copyPanel}
              {mediaPanel}
            </>
          ) : (
            <>
              {mediaPanel}
              {copyPanel}
            </>
          )}
        </div>
      </div>

      {showStudioFloor ? (
        <div className="section-padding mt-20 border-t border-white/10 pt-16 md:mt-24 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="about-copy flex flex-col justify-center lg:col-span-5">
              <p className="label mb-4 text-accent">The floor</p>
              <h3 className="heading-lg mb-6 max-w-xl text-balance">
                Where the work comes to life.
              </h3>
              <p className="mb-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
                This is where hospitality and automotive campaigns are built —
                briefs on the wall, timelines on the monitors, and cuts that have
                to feel expensive before they ever leave the suite.
              </p>
              <p className="mb-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
                Clients walk in with a property or a launch. They leave with a
                story the feed can&apos;t ignore.
              </p>
              <p className="mt-4 max-w-md font-display text-xl text-white md:text-2xl">
                Come see where the magic happens.
              </p>
            </div>

            <div className="about-media relative lg:col-span-7">
              <div className="about-media-frame relative aspect-[16/10] overflow-hidden border border-white/10 md:aspect-[16/9]">
                <video
                  className="h-full w-full object-cover"
                  src={MEDIA.studioTour}
                  poster={MEDIA.studioTourPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-black/10" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between p-6 md:p-8">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
                      THE FLOOR
                    </p>
                    <p className="mt-1 font-display text-2xl text-white">Westlands</p>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                    Where the cut lands
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showStats ? (
        <div className="stats-grid section-padding mt-20 border-t border-white/10 pt-14 md:mt-24 md:pt-16">
          <div className="mb-12 max-w-2xl md:mb-14">
            <p className="label mb-4 text-accent">Results-Driven</p>
            <h3 className="heading-md text-balance">
              Everything we create is designed to help your brand grow.
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="stat-item relative md:pl-6">
                <span
                  className="absolute top-1 left-0 hidden h-8 w-px bg-accent/80 md:block"
                  aria-hidden
                />
                <p className="font-display text-4xl tracking-tight text-white md:text-5xl lg:text-6xl">
                  <CountUpStat
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={1.6 + i * 0.15}
                  />
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
