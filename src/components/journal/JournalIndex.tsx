"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatJournalDate, type JournalPost } from "@/data/journal";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type JournalIndexProps = {
  posts: JournalPost[];
};

export function JournalIndex({ posts }: JournalIndexProps) {
  const ref = useRef<HTMLElement>(null);
  const [featured, ...rest] = posts;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".journal-intro > *"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        el.querySelector(".journal-featured"),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.15,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        el.querySelectorAll(".journal-row"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el.querySelector(".journal-list"),
            start: "top 82%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="pt-28 pb-28 md:pt-36 md:pb-36">
      <div className="journal-intro section-padding mb-14 border-b border-white/10 pb-12 md:mb-16 md:pb-16">
        <p className="label mb-4">Journal</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="heading-xl max-w-3xl text-balance">
            Stories from the studio.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted md:pb-2 md:text-right">
            Process notes, craft, and campaigns — from the studio floor.
          </p>
        </div>
      </div>

      {featured ? (
        <Link
          href={`/journal/${featured.slug}`}
          className="journal-featured group section-padding mb-16 block md:mb-24"
          data-cursor-label="Read"
        >
          <article className="grid items-stretch gap-8 border border-white/10 lg:grid-cols-12 lg:gap-0">
            <div className="relative aspect-[16/11] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-[1.04]"
                fetchPriority="low"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/40" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
              <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.22em] text-accent md:top-7 md:left-7">
                FEATURED
              </span>
            </div>

            <div className="flex flex-col justify-end p-6 md:p-10 lg:col-span-5 lg:p-12">
              <p className="label mb-4">
                <span className="text-accent">{featured.category}</span>
                <span className="text-white/30"> · </span>
                {formatJournalDate(featured.date)}
                <span className="text-white/30"> · </span>
                {featured.readTime}
              </p>
              <h2 className="heading-lg mb-5 text-balance transition-colors group-hover:text-accent">
                {featured.title}
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/70 transition group-hover:text-accent">
                Read article <span aria-hidden>→</span>
              </span>
            </div>
          </article>
        </Link>
      ) : null}

      <div className="journal-list section-padding">
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
          <p className="label">More from the journal</p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
            {String(rest.length).padStart(2, "0")} entries
          </p>
        </div>

        <ul className="border-t border-white/10">
          {rest.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/journal/${post.slug}`}
                className="journal-row group grid grid-cols-1 items-center gap-6 border-b border-white/10 py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
                data-cursor-label="Read"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-accent md:col-span-1">
                  {String(i + 2).padStart(2, "0")}
                </span>

                <div className="relative aspect-[16/10] overflow-hidden md:col-span-3 md:aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                </div>

                <div className="md:col-span-5">
                  <p className="label mb-3">
                    <span className="text-accent">{post.category}</span>
                    <span className="text-white/30"> · </span>
                    {post.readTime}
                  </p>
                  <h3
                    className={cn(
                      "font-display text-2xl text-white transition-colors group-hover:text-accent md:text-3xl",
                    )}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between md:col-span-3 md:flex-col md:items-end md:justify-center md:gap-4">
                  <time
                    dateTime={post.date}
                    className="text-xs uppercase tracking-[0.16em] text-muted"
                  >
                    {formatJournalDate(post.date)}
                  </time>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50 transition group-hover:text-accent">
                    Read →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
