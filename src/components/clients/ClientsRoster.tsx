"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type Client,
  type ClientSector,
  getClientSectorsPresent,
  getClientsBySector,
  sectorMeta,
} from "@/data/clients";
import { getProject } from "@/data/projects";
import { getClientWork, hasClientWork } from "@/data/clientFilms";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function ClientsRoster() {
  const ref = useRef<HTMLElement>(null);
  const sectors = getClientSectorsPresent();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".clients-sector"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        el.querySelectorAll(".client-row"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  let runningIndex = 0;

  return (
    <section ref={ref} className="section-padding pb-28 md:pb-36">
      <div className="space-y-20 md:space-y-28">
        {sectors.map((sector) => {
          const list = getClientsBySector(sector);
          const offset = runningIndex;
          runningIndex += list.length;
          return (
            <ClientSectorBlock
              key={sector}
              sector={sector}
              clients={list}
              indexOffset={offset}
            />
          );
        })}
      </div>
    </section>
  );
}

function ClientSectorBlock({
  sector,
  clients,
  indexOffset,
}: {
  sector: ClientSector;
  clients: Client[];
  indexOffset: number;
}) {
  const copy = sectorMeta[sector];

  return (
    <div className="clients-sector">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:pb-10">
        <div>
          <p className="label mb-3">
            <span className="text-accent">{copy.label}</span>
            <span className="text-white/30"> · </span>
            {String(clients.length).padStart(2, "0")} partners
          </p>
          <h2 className="heading-lg">{copy.title}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
            {copy.blurb}
          </p>
        </div>
        <Link
          href="/work"
          className="label shrink-0 text-muted transition hover:text-accent"
        >
          Browse all work →
        </Link>
      </div>

      <ul className="space-y-0">
        {clients.map((client, i) => (
          <ClientRow
            key={client.slug}
            client={client}
            index={indexOffset + i + 1}
          />
        ))}
      </ul>
    </div>
  );
}

function ClientRowCover({
  video,
  poster,
}: {
  video: string;
  poster: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = ref.current;
    const el = videoRef.current;
    if (!root || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (!visible) {
          setActive(false);
          el.pause();
          try {
            el.currentTime = 0;
          } catch {
            /* ignore */
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.muted = true;
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <div
      ref={ref}
      className="relative mr-4 hidden h-14 w-24 overflow-hidden md:block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition duration-700",
          active ? "scale-105 opacity-0" : "scale-100 opacity-100",
        )}
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition duration-700",
          active ? "scale-105 opacity-100" : "scale-100 opacity-0",
        )}
        src={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
    </div>
  );
}

function ClientRow({ client, index }: { client: Client; index: number }) {
  const project = client.workSlug ? getProject(client.workSlug) : undefined;
  const clientWork = getClientWork(client.slug);
  const hasWork = Boolean(client.workSlug && project);
  const hasFilms = hasClientWork(client.slug);
  const hasPage = hasWork || hasFilms;
  const href = hasWork
    ? `/work/${client.workSlug}`
    : hasFilms
      ? `/clients/${client.slug}`
      : undefined;

  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-3.5">
        <span className="w-7 shrink-0 font-mono text-xs tracking-[0.2em] text-accent">
          {String(index).padStart(2, "0")}
        </span>

        <span className="mr-2 flex h-8 w-20 shrink-0 items-center justify-start md:mr-4 md:h-9 md:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            width={96}
            height={36}
            className="max-h-full max-w-full object-contain object-left opacity-[0.88] brightness-0 invert"
            loading="lazy"
            decoding="async"
          />
        </span>

        <div className="flex min-w-0 flex-col justify-center">
          <h3
            className={cn(
              "font-display text-2xl leading-tight text-white transition-colors md:text-3xl",
              hasPage && "group-hover:text-accent",
            )}
          >
            {client.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/40">
            {client.detail}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end">
        {hasWork && project ? (
          <div className="relative mr-4 hidden h-14 w-24 overflow-hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              aria-hidden
            />
          </div>
        ) : hasFilms && clientWork ? (
          clientWork.heroVideo && clientWork.heroPoster ? (
            <ClientRowCover
              video={clientWork.heroVideo}
              poster={clientWork.heroPoster}
            />
          ) : clientWork.heroImage ? (
            <div className="relative mr-4 hidden h-14 w-24 overflow-hidden md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={clientWork.heroImage}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                aria-hidden
              />
            </div>
          ) : null
        ) : null}
        <span
          className={cn(
            "text-xs uppercase tracking-[0.2em] transition",
            hasPage
              ? "text-white/50 group-hover:text-accent"
              : "text-white/25",
          )}
        >
          {hasWork || hasFilms ? "View work →" : "—"}
        </span>
      </div>
    </>
  );

  const rowClass =
    "client-row group flex flex-col gap-3 border-b border-white/10 py-5 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:py-6";

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className={cn(rowClass)}
          data-cursor-label="View"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className={rowClass}>{inner}</div>
    </li>
  );
}
