"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
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

      <ul className="space-y-3">
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

function ClientRow({ client, index }: { client: Client; index: number }) {
  const project = client.workSlug ? getProject(client.workSlug) : undefined;
  const hasWork = Boolean(client.workSlug && project);

  const inner = (
    <>
      <span className="flex items-center font-mono text-xs tracking-[0.2em] text-accent md:col-span-1">
        {String(index).padStart(2, "0")}
      </span>

      {/* White logo strip — true brand colors, centered */}
      <div className="md:col-span-3">
        <div className="flex h-20 w-full items-center justify-center overflow-hidden bg-white px-4 shadow-[inset_3px_0_0_0_#e10600] transition duration-300 group-hover:shadow-[inset_3px_0_0_0_#e10600,0_0_0_1px_rgba(225,6,0,0.25)] md:h-24 md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className="mx-auto h-12 w-auto max-h-14 max-w-[90%] object-contain object-center md:h-14"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center md:col-span-5">
        <h3
          className={cn(
            "font-display text-2xl leading-tight text-white transition-colors md:text-3xl",
            hasWork && "group-hover:text-accent",
          )}
        >
          {client.name}
        </h3>
        <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-white/40">
          {client.detail}
        </p>
      </div>

      <div className="flex items-center md:col-span-3 md:justify-end">
        {hasWork && project ? (
          <div className="relative mr-4 hidden h-14 w-24 overflow-hidden border border-white/10 md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              aria-hidden
            />
          </div>
        ) : null}
        <span
          className={cn(
            "text-xs uppercase tracking-[0.2em] transition",
            hasWork
              ? "text-white/50 group-hover:text-accent"
              : "text-white/25",
          )}
        >
          {hasWork ? "View work →" : "—"}
        </span>
      </div>
    </>
  );

  const rowClass =
    "client-row group grid grid-cols-1 items-center gap-5 border border-white/10 bg-white/[0.02] px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.04] md:grid-cols-12 md:gap-6 md:px-5 md:py-5";

  if (hasWork && client.workSlug) {
    return (
      <li>
        <Link
          href={`/work/${client.workSlug}`}
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
