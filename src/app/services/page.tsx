import type { Metadata } from "next";
import { services } from "@/data/services";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ServiceMedia } from "@/components/services/ServiceMedia";

export const metadata: Metadata = {
  title: "What We Create",
  description:
    "Creative campaigns, commercial production, event coverage, SEO, social, cinematic content, and website design by Akatsuki Studio.",
};

export default function ServicesPage() {
  return (
    <div className="relative pt-32 md:pt-40">
      <div
        className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.14)_0%,transparent_70%)] blur-2xl"
        aria-hidden
      />

      <div className="section-padding relative pb-24">
        <p className="label mb-4 text-accent">What we create</p>
        <h1 className="heading-xl max-w-4xl text-balance">
          Campaigns, film, and digital built to be{" "}
          <span className="text-accent">remembered</span>
          <span
            className="ml-1.5 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle shadow-[0_0_14px_rgba(225,6,0,0.7)]"
            aria-hidden
          />
        </h1>
        <div className="mt-5 h-px w-16 bg-accent/80" aria-hidden />
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          From end-to-end creative campaigns and commercial production to events,
          SEO, social, cinematic content, and websites — every offering starts
          with <span className="text-white">impact</span>, not volume.
        </p>
      </div>

      <div className="section-padding space-y-32 pb-32">
        {services.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="relative aspect-video overflow-hidden border border-white/10 transition duration-500 hover:border-accent/40">
                <ServiceMedia src={service.image} alt={service.title} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/70 via-accent/20 to-transparent" />
              </div>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <p className="label mb-4 text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="heading-lg mb-6 border-l-2 border-accent pl-5">
                {service.title}
              </h2>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-accent/25 bg-accent/[0.06] px-4 py-1.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-accent/50 hover:text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="section-padding relative pb-32 text-center">
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.2)_0%,transparent_70%)] blur-xl"
          aria-hidden
        />
        <p className="label mb-6 text-accent">Next step</p>
        <MagneticButton href="/contact">Discuss Your Project</MagneticButton>
      </div>
    </div>
  );
}
