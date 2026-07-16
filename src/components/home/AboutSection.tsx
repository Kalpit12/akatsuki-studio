"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import { MEDIA } from "@/lib/cloudinary";
import { CountUpStat } from "@/components/ui/CountUpStat";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
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
  titleClassName?: string;
  paragraphs?: string[];
  closing?: string;
  closingClassName?: string;
  showStats?: boolean;
  showTruth?: boolean;
  showHeader?: boolean;
  /** Video source for the media panel */
  videoSrc?: string;
  videoPoster?: string;
  /** Label seated above the media frame */
  videoCaption?: string | null;
  /** Homepage: media left. About page story can stay left. */
  mediaSide?: "left" | "right";
  showAboutLink?: boolean;
  /** Extra studio tour block (text left, video right) above the stats */
  showStudioFloor?: boolean;
};

const DEFAULT_PARAGRAPHS = [
  "At Akatsuki Studio, we don't measure success by the number of videos we deliver — we measure it by the impact they create. More enquiries. More engagement. More people remembering your brand.",
  "From cinematic commercials and brand films to events, product launches, social campaigns, and websites that convert — every project starts with one question: what will this actually do for the business?",
];

export function AboutSection({
  eyebrow = "Who we are",
  title = "Measured by impact — not volume.",
  titleClassName,
  paragraphs = DEFAULT_PARAGRAPHS,
  closing = "Because anyone can post content. We create content people remember.",
  closingClassName,
  showStats = true,
  showTruth = true,
  showHeader = true,
  videoSrc = MEDIA.about,
  videoPoster = MEDIA.aboutPoster,
  videoCaption = "Huawei Africa Product Launch Video",
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
              scrub: 0.5,
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
    <div className="about-media relative min-w-0 lg:col-span-7">
      {videoCaption ? (
        <div className="mb-4 flex items-center gap-3 md:mb-5">
          <span className="h-px w-6 shrink-0 bg-accent md:w-8" aria-hidden />
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase md:text-[11px]">
            {videoCaption}
          </p>
        </div>
      ) : null}
      <div className="about-media-frame relative aspect-video w-full overflow-hidden border border-white/10">
        <LazyVideoPlayer
          src={videoSrc}
          poster={videoPoster}
          className="h-full w-full"
          videoClassName="object-cover object-center"
          playInView
          showMuteOnly
          showControls={false}
          showPlayOverlay={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-black/15" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-accent">EST.</p>
            <p className="mt-1 font-display text-2xl text-white">Nairobi</p>
          </div>
          <p className="max-w-[10rem] shrink-0 text-right text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/55">
            Film · Brand · Digital
          </p>
        </div>
      </div>
    </div>
  );

  const copyPanel = (
    <div
      className={cn(
        "about-copy flex min-w-0 flex-col justify-center",
        "lg:col-span-5",
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
        <p
          className={cn(
            "mt-8 max-w-xl font-display text-xl text-white md:text-2xl",
            closingClassName,
          )}
        >
          {closing}
        </p>
      ) : null}
    </div>
  );

  const pillarsBlock = showTruth ? (
    <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
      {PILLARS.map((pillar) => (
        <li
          key={pillar.label}
          className={cn(
            "flex min-w-0 flex-col justify-between px-4 py-5 md:min-h-[7.5rem] md:px-5 md:py-6 lg:px-6",
            pillar.accent ? "bg-white/[0.03]" : "bg-background",
          )}
        >
          <p
            className={cn(
              "font-display text-xl leading-none tracking-tight md:text-2xl",
              pillar.accent ? "text-accent" : "text-white",
            )}
          >
            {pillar.label}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed tracking-[0.04em] text-muted md:mt-4">
            {pillar.detail}
          </p>
        </li>
      ))}
    </ul>
  ) : null;

  const aboutLink = showAboutLink && showTruth ? (
    <div className="mt-10">
      <Link
        href="/about"
        data-magnetic
        className="label link-underline text-accent hover:text-accent-hover"
      >
        More about the studio →
      </Link>
    </div>
  ) : null;

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-36">
      <div className="section-padding">
        {showHeader ? (
          <div className="mb-14 flex flex-col gap-4 border-b border-white/10 pb-10 md:mb-16 md:pb-12">
            <div>
              <p className="label mb-4">{eyebrow}</p>
              <h2 className={cn("max-w-3xl text-balance", titleClassName ?? "heading-lg")}>
                {title}
              </h2>
            </div>
          </div>
        ) : null}

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

        {pillarsBlock}
        {aboutLink}
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
                This is where campaigns are built — briefs on the wall,
                timelines on the monitors, and cuts that have to feel expensive
                before they ever leave the suite.
              </p>
              <p className="mb-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
                Clients walk in with a brief or a launch. They leave with a
                story the feed can&apos;t ignore.
              </p>
              <p className="mt-4 max-w-md font-display text-xl text-accent md:text-2xl">
                Come see where the magic happens.
              </p>
            </div>

            <div className="about-media relative lg:col-span-7">
              <div className="about-media-frame relative aspect-[16/10] overflow-hidden border border-white/10 md:aspect-[16/9]">
                <LazyVideoPlayer
                  src={MEDIA.studioTour}
                  poster={MEDIA.studioTourPoster}
                  className="h-full w-full"
                  playInView
                  showControls={false}
                  showPlayOverlay={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-black/10" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between p-6 md:p-8">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
                      THE FLOOR
                    </p>
                    <p className="mt-1 font-display text-2xl text-white">The studio</p>
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
