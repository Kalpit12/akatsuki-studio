import type { Metadata } from "next";
import Link from "next/link";
import { LazyVideoPlayer } from "@/components/ui/LazyVideoPlayer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Vishh254BackLink } from "@/components/vishh254/Vishh254BackLink";
import { Vishh254ScrollMark } from "@/components/vishh254/Vishh254ScrollMark";
import { VISHH254, type VishhFilm } from "@/data/vishh254";

export const metadata: Metadata = {
  title: "Vishh254 — Creating Stories. Chasing Bigger Dreams.",
  description: VISHH254.lead,
};

function WorkCard({
  work,
  className = "",
}: {
  work: VishhFilm;
  className?: string;
}) {
  return (
    <article
      className={`group relative overflow-hidden border border-white/10 bg-white/[0.02] ${className}`}
    >
      <div className="relative aspect-[9/16] bg-black sm:aspect-[3/4] lg:aspect-[9/16]">
        <LazyVideoPlayer
          src={work.video}
          poster={work.poster}
          className="h-full w-full"
          showPlayOverlay
          showControls
        />
      </div>
      <div className="border-t border-white/10 px-4 py-3 md:px-5 md:py-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/45">
          {work.tag}
        </p>
        <p className="mt-1 font-display text-lg text-white md:text-xl">
          {work.title}
        </p>
      </div>
    </article>
  );
}

export default function Vishh254Page() {
  const works = VISHH254.works;
  const [leadA, leadB, ...tail] = works;

  return (
    <article>
      <Vishh254ScrollMark />
      <div className="section-padding pt-32 md:pt-40">
        <Vishh254BackLink />
      </div>
      <section className="relative -mt-16 h-[85vh] min-h-[500px] md:-mt-20">
        <LazyVideoPlayer
          src={VISHH254.heroVideo}
          poster={VISHH254.heroPoster}
          className="absolute inset-0 h-full w-full"
          alwaysPlay
          showControls={false}
          showPlayOverlay={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-black/35 to-black/20" />
        <div className="section-padding pointer-events-none relative flex h-full flex-col justify-end pb-16 pt-32 md:pb-20">
          <p className="label mb-4 text-accent">{VISHH254.eyebrow}</p>
          <p className="mb-3 font-mono text-[10px] tracking-[0.22em] text-white/45">
            @{VISHH254.handle} · {VISHH254.role}
          </p>
          <h1 className="heading-xl max-w-4xl text-balance">
            Creating Stories.{" "}
            <span className="text-accent">Chasing Bigger Dreams.</span>
            <span
              className="ml-1.5 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle shadow-[0_0_14px_rgba(225,6,0,0.7)]"
              aria-hidden
            />
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {VISHH254.lead}
          </p>
        </div>
      </section>

      <section className="section-padding border-b border-white/10 py-10 md:py-12">
        <div className="flex flex-wrap items-center gap-5">
          <MagneticButton href="/work">Studio Work →</MagneticButton>
          <div className="flex items-center gap-3" role="group" aria-label="Social">
            <Link
              href={VISHH254.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${VISHH254.name} on Instagram`}
              className="group relative inline-flex h-11 items-center gap-2.5 overflow-hidden border border-white/15 bg-white/[0.03] pl-3 pr-4 text-white/70 transition duration-300 hover:border-white/40 hover:text-white"
            >
              <span
                className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 70%, #515bd4 100%)",
                }}
                aria-hidden
              />
              <span className="relative z-10 flex h-6 w-6 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px] transition duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.8" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="0.9"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </span>
              <span className="relative z-10 font-mono text-[10px] tracking-[0.22em] uppercase">
                Instagram
              </span>
            </Link>
            <Link
              href={VISHH254.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${VISHH254.name} on YouTube`}
              className="group relative inline-flex h-11 w-14 items-center justify-center bg-[#ff0000]/10 text-[#ff4444] transition duration-300 hover:bg-[#ff0000] hover:text-white"
            >
              <span
                className="pointer-events-none absolute inset-x-2 top-0 h-px bg-[#ff4444]/50 transition group-hover:bg-white/40"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-[#ff4444]/50 transition group-hover:bg-white/40"
                aria-hidden
              />
              <svg
                viewBox="0 0 24 24"
                className="relative z-10 h-5 w-5 transition duration-300 group-hover:scale-110"
                fill="currentColor"
                aria-hidden
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/10 py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-3 text-accent">Selected work</p>
            <h2 className="heading-md max-w-xl text-balance">
              Films, experiences, and moments.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A living collection that keeps growing with every chapter.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-6 lg:gap-6">
          {leadA ? <WorkCard work={leadA} className="lg:col-span-3" /> : null}
          {leadB ? <WorkCard work={leadB} className="lg:col-span-3" /> : null}
          {tail.map((work) => (
            <WorkCard key={work.id} work={work} className="lg:col-span-2" />
          ))}
        </div>
      </section>

      <section className="section-padding pb-28 md:pb-36">
        <div className="border border-white/10 bg-white/[0.02] px-6 py-12 text-center md:px-12 md:py-16">
          <p className="label mb-4 text-accent">Next</p>
          <h2 className="heading-md mx-auto max-w-2xl text-balance">
            Ready to build the next chapter together?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <MagneticButton href="/contact">Start the Project</MagneticButton>
            <MagneticButton href="/work" variant="outline">
              See Studio Work
            </MagneticButton>
          </div>
        </div>
      </section>
    </article>
  );
}
