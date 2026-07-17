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
import { MOBILE_MQ } from "@/lib/gsap-mobile";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function getClientPreview(client: Client) {
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

  let poster: string | undefined;
  if (hasWork && project) {
    poster = project.coverImage;
  } else if (hasFilms && clientWork) {
    poster = clientWork.heroPoster ?? clientWork.heroImage;
  }

  return { project, clientWork, hasWork, hasFilms, hasPage, href, poster };
}

function SectorJumpNav({ sectors }: { sectors: ClientSector[] }) {
  return (
    <nav
      className="sticky top-[4.25rem] z-30 -mx-6 mb-8 border-b border-white/10 bg-background/95 px-6 py-3 backdrop-blur-md md:hidden"
      aria-label="Jump to sector"
    >
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sectors.map((sector) => (
          <a
            key={sector}
            href={`#sector-${sector}`}
            className="shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[9px] tracking-[0.18em] text-white/70 uppercase transition active:border-accent/50 active:text-accent"
          >
            {sectorMeta[sector].label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function ClientsRoster() {
  const ref = useRef<HTMLElement>(null);
  const sectors = getClientSectorsPresent();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isMobile = window.matchMedia(MOBILE_MQ).matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".clients-sector"),
        { y: isMobile ? 24 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: isMobile ? 0.08 : 0.12,
          duration: isMobile ? 0.65 : 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        },
      );

      if (!isMobile) {
        gsap.fromTo(
          el.querySelectorAll(".client-row-desktop"),
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
      }
    }, el);

    return () => ctx.revert();
  }, []);

  let runningIndex = 0;

  return (
    <section ref={ref} className="section-padding max-md:pb-20 pb-28 md:pb-36">
      <SectorJumpNav sectors={sectors} />

      <div className="space-y-12 md:space-y-28">
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
    <div id={`sector-${sector}`} className="clients-sector scroll-mt-28">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-4 md:pb-10">
        <div>
          <p className="label mb-2 md:mb-3">
            <span className="text-accent">{copy.label}</span>
            <span className="text-white/30"> · </span>
            {String(clients.length).padStart(2, "0")} partners
          </p>
          <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-white md:text-[clamp(2rem,5vw,4.5rem)] md:font-medium md:leading-[0.95]">
            {copy.title}
          </h2>
          <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-muted md:block md:text-base">
            {copy.blurb}
          </p>
        </div>
        <Link
          href="/work"
          className="label hidden shrink-0 text-muted transition hover:text-accent md:inline-block"
        >
          Browse all work →
        </Link>
      </div>

      <ul className="max-md:grid max-md:grid-cols-1 max-md:gap-3 md:space-y-0">
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
      className="relative mr-4 h-14 w-24 overflow-hidden"
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

function ClientRowMobile({
  client,
  index,
  href,
  hasPage,
  poster,
}: {
  client: Client;
  index: number;
  href?: string;
  hasPage: boolean;
  poster?: string;
}) {
  const cardInner = (
    <>
      {hasPage && poster ? (
        <div className="relative mb-3 aspect-[16/10] overflow-hidden border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-active:scale-[1.02]"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ) : null}

      <div className="flex items-center gap-2.5">
        <span className="w-6 shrink-0 font-mono text-[10px] tracking-[0.2em] text-accent">
          {String(index).padStart(2, "0")}
        </span>

        <span className="flex h-7 w-[4.25rem] shrink-0 items-center justify-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt=""
            width={68}
            height={28}
            className="max-h-full max-w-full object-contain object-left opacity-[0.88] brightness-0 invert"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        </span>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "truncate font-display text-lg leading-tight text-white transition-colors",
              hasPage && "group-active:text-accent",
            )}
          >
            {client.name}
          </h3>
          <p className="truncate text-[10px] tracking-[0.14em] text-white/40 uppercase">
            {client.detail}
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 text-[10px] tracking-[0.16em] uppercase",
            hasPage ? "text-accent" : "text-white/25",
          )}
        >
          {hasPage ? "→" : "—"}
        </span>
      </div>
    </>
  );

  const cardClass =
    "group block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 transition active:border-accent/35 active:bg-accent/[0.04]";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {cardInner}
      </Link>
    );
  }

  return <div className={cn(cardClass, "opacity-80")}>{cardInner}</div>;
}

function ClientRowDesktop({
  client,
  index,
  href,
  hasWork,
  hasFilms,
  hasPage,
  project,
  clientWork,
}: {
  client: Client;
  index: number;
  href?: string;
  hasWork: boolean;
  hasFilms: boolean;
  hasPage: boolean;
  project: ReturnType<typeof getProject>;
  clientWork: ReturnType<typeof getClientWork>;
}) {
  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span className="w-7 shrink-0 font-mono text-xs tracking-[0.2em] text-accent">
          {String(index).padStart(2, "0")}
        </span>

        <span className="mr-4 flex h-9 w-24 shrink-0 items-center justify-start">
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
              "font-display text-3xl leading-tight text-white transition-colors",
              hasPage && "group-hover:text-accent",
            )}
          >
            {client.name}
          </h3>
          <p className="mt-1 text-xs tracking-[0.16em] text-white/40 uppercase">
            {client.detail}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end">
        {hasWork && project ? (
          <div className="relative mr-4 h-14 w-24 overflow-hidden">
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
            <div className="relative mr-4 h-14 w-24 overflow-hidden">
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
            "text-xs tracking-[0.2em] uppercase transition",
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
    "client-row-desktop group flex items-center justify-between gap-6 border-b border-white/10 py-6 transition-colors hover:border-white/20";

  if (href) {
    return (
      <Link href={href} className={rowClass} data-cursor-label="View">
        {inner}
      </Link>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}

function ClientRow({ client, index }: { client: Client; index: number }) {
  const { project, clientWork, hasWork, hasFilms, hasPage, href, poster } =
    getClientPreview(client);

  return (
    <li>
      <div className="md:hidden">
        <ClientRowMobile
          client={client}
          index={index}
          href={href}
          hasPage={hasPage}
          poster={poster}
        />
      </div>
      <div className="hidden md:block">
        <ClientRowDesktop
          client={client}
          index={index}
          href={href}
          hasWork={hasWork}
          hasFilms={hasFilms}
          hasPage={hasPage}
          project={project}
          clientWork={clientWork}
        />
      </div>
    </li>
  );
}
