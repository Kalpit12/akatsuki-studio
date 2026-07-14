"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { team, type TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-accent hover:text-white"
    >
      {children}
    </a>
  );
}

function FounderSocials({ member }: { member: TeamMember }) {
  return (
    <div
      className="absolute right-4 bottom-4 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-1.5 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <SocialIcon href={member.social.instagram} label={`${member.name} on Instagram`}>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </SocialIcon>
      <SocialIcon href={member.social.youtube} label={`${member.name} on YouTube`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
        </svg>
      </SocialIcon>
      {member.social.tiktok ? (
        <SocialIcon href={member.social.tiktok} label={`${member.name} on TikTok`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M19.6 6.8A5.4 5.4 0 0 1 16.4 4h-3.1v11.2a2.7 2.7 0 1 1-1.9-2.6V9.4a5.9 5.9 0 1 0 5 5.8V10a8.4 8.4 0 0 0 4.9 1.6V8.5a5.4 5.4 0 0 1-1.7-1.7Z" />
          </svg>
        </SocialIcon>
      ) : null}
    </div>
  );
}

function FounderPortrait({ member }: { member: TeamMember }) {
  const [mobileSwap, setMobileSwap] = useState(false);
  const hasHoverAlt = Boolean(member.hoverImage && member.hoverImage !== member.image);

  const toggleMobileSwap = () => {
    // Desktop keeps CSS hover — don't hijack fine-pointer devices
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (!hasHoverAlt) return;
    setMobileSwap((v) => !v);
  };

  return (
    <div
      role={hasHoverAlt ? "button" : undefined}
      tabIndex={hasHoverAlt ? 0 : undefined}
      aria-pressed={hasHoverAlt ? mobileSwap : undefined}
      aria-label={
        hasHoverAlt
          ? mobileSwap
            ? `Show primary photo of ${member.name}`
            : `Show alternate photo of ${member.name}`
          : undefined
      }
      onClick={toggleMobileSwap}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMobileSwap();
        }
      }}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-accent/70 [@media(hover:hover)_and_(pointer:fine)]:cursor-default"
    >
      {member.image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.image}
            alt={member.name}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition duration-700",
              // Desktop hover (unchanged)
              "[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-0",
              // Mobile / touch tap toggle
              mobileSwap &&
                "[@media(hover:none)]:scale-105 [@media(hover:none)]:opacity-0",
            )}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.hoverImage ?? member.image}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700",
              "[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100",
              mobileSwap &&
                "[@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100",
            )}
            aria-hidden
          />
        </>
      ) : null}

      {hasHoverAlt ? (
        <span
          className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/55 px-2.5 py-1 text-[10px] tracking-[0.18em] text-white/80 uppercase backdrop-blur-sm [@media(hover:hover)_and_(pointer:fine)]:hidden"
          aria-hidden
        >
          Tap
        </span>
      ) : null}

      <FounderSocials member={member} />
    </div>
  );
}

function FounderBlock({
  member,
  reverse,
}: {
  member: TeamMember;
  reverse?: boolean;
}) {
  return (
    <div
      data-founder-block
      className={cn(
        "grid items-center gap-12 border-b border-white/10 py-16 md:gap-16 md:py-24 lg:grid-cols-12 lg:gap-20",
        "last:border-b-0 last:pb-0",
      )}
    >
      <div
        data-story-portrait
        className={cn("lg:col-span-5", reverse && "lg:order-2")}
      >
        <FounderPortrait member={member} />

        <div className="mt-5">
          <p className="font-display text-xl tracking-tight text-white md:text-2xl">
            {member.name}
          </p>
          <p className="mt-1 text-sm text-muted">{member.title}</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-8 lg:col-span-7 lg:gap-10",
          reverse && "lg:order-1",
        )}
      >
        {member.story.map((block) => (
          <div key={block.lead} data-story-block>
            <p className="text-lg leading-relaxed text-white md:text-xl md:leading-relaxed">
              <strong className="font-semibold text-white">{block.lead}</strong>{" "}
              <span className="text-white/65">{block.body}</span>
            </p>
          </div>
        ))}
        <p
          data-story-block
          className="flex items-start gap-3 text-base leading-relaxed text-white/70 md:text-lg"
        >
          <span
            className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_14px_rgba(225,6,0,0.75)]"
            aria-hidden
          />
          <span>{member.closing}</span>
        </p>
      </div>
    </div>
  );
}

export function TeamSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-story-head]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );

      root.querySelectorAll<HTMLElement>("[data-founder-block]").forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll("[data-story-portrait], [data-story-block]"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: block, start: "top 78%" },
          },
        );
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section-padding py-28 md:py-36">
      <div className="mb-6 md:mb-10">
        <p data-story-head className="label mb-5 text-accent">
          The founders
        </p>
        <h2 data-story-head className="heading-lg max-w-4xl text-balance">
          Born at dawn.
          <br className="hidden md:block" /> Built to break the scroll.
        </h2>
      </div>

      <div>
        {team.map((member, i) => (
          <FounderBlock key={member.name} member={member} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
