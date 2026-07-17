"use client";

import { awards } from "@/data/clients";

export function AwardsSection() {
  return (
    <section className="section-padding max-md:py-20 py-28 md:py-36">
      <div className="mb-14 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-4">Recognition</p>
          <h2 className="heading-lg max-w-xl text-balance">
            Proof the work lands — for any brand that shows up.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-muted">
          Selected awards and festival nods from recent campaigns.
        </p>
      </div>

      <ul className="border-t border-white/15">
        {awards.map((award) => (
          <li
            key={award.title}
            className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b border-white/15 max-md:py-5 py-7 transition-colors md:grid-cols-[6rem_1fr_1fr] md:gap-8 md:py-9"
          >
            <span className="font-mono text-xs tracking-[0.15em] text-accent">
              {award.year}
            </span>
            <h3 className="font-display text-xl transition-colors group-hover:text-accent md:text-2xl">
              {award.title}
            </h3>
            <p className="col-start-2 text-sm text-muted md:col-start-3 md:text-right">
              {award.project}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
