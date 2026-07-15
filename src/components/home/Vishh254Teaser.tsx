import Link from "next/link";

/** Homepage teaser under Reach — links to Vishh254 personal page */
export function Vishh254Teaser() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(225,6,0,0.14)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="section-padding relative py-20 md:py-28">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="label mb-4 text-accent">vishh254</p>
            <h2 className="heading-lg max-w-3xl text-balance">
              Creating Stories.{" "}
              <span className="text-accent">Chasing Bigger Dreams.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Every project is another step toward building something bigger
              than myself. Vishh254 is a collection of the films, experiences,
              and moments that continue to shape that journey.
            </p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end lg:pb-1">
            <Link
              href="/vishh254"
              data-magnetic
              className="group inline-flex items-center gap-3 border border-accent/40 bg-accent/10 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-accent transition hover:border-accent hover:bg-accent hover:text-white"
            >
              View My Work
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div
          className="mt-10 h-px w-full bg-gradient-to-r from-accent/70 via-white/10 to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
