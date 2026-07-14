import type { Metadata } from "next";
import { services } from "@/data/services";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "What We Create",
  description:
    "Creative campaigns, automotive production, event coverage, SEO, social, cinematic content, and website design by Akatsuki Studio.",
};

export default function ServicesPage() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="section-padding pb-24">
        <p className="label mb-4">What we create</p>
        <h1 className="heading-xl max-w-4xl text-balance">
          Campaigns, film, and digital built to be remembered.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          From end-to-end creative campaigns and automotive production to events,
          SEO, social, cinematic content, and websites — every offering starts
          with impact, not volume.
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
              <div className="relative aspect-video overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  aria-hidden
                />
                <video
                  className="relative h-full w-full object-cover"
                  src={service.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
              </div>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <p className="label mb-4 text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="heading-lg mb-6">{service.title}</h2>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/10 px-4 py-1.5 text-xs uppercase tracking-wider text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="section-padding pb-32 text-center">
        <MagneticButton href="/contact">Discuss Your Project</MagneticButton>
      </div>
    </div>
  );
}
