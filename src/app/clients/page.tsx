import type { Metadata } from "next";
import { LogoWall } from "@/components/home/LogoWall";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AwardsSection } from "@/components/home/AwardsSection";
import { ClientsRoster } from "@/components/clients/ClientsRoster";
import { clientRoster, getClientSectorsPresent } from "@/data/clients";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Brands Akatsuki Studio has worked with — automotive, technology, hospitality, education, and more.",
};

export default function ClientsPage() {
  const sectors = getClientSectorsPresent();

  return (
    <div className="pt-28 md:pt-36">
      <div className="section-padding pb-14 md:pb-16">
        <p className="label mb-4">Clients</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="heading-xl max-w-3xl text-balance">
            Brands we&apos;ve worked with
          </h1>
          <div className="max-w-sm md:pb-2 md:text-right">
            <p className="font-display text-xl leading-snug text-white md:text-2xl">
              Built on trust.{" "}
              <span className="text-accent">Proven on every brief.</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              21 partners across automotive, hospitality, tech, and beyond.
            </p>
          </div>
        </div>
      </div>

      <LogoWall
        showIntro={false}
        caption={
          <p className="mx-auto max-w-2xl font-display text-2xl leading-snug text-balance text-white md:text-3xl">
            From dealership floors to dining rooms —{" "}
            <span className="text-accent">brands that refuse to blend in.</span>
          </p>
        }
      />

      <div className="section-padding pt-16 md:pt-20">
        <div className="mb-12 flex flex-wrap gap-8 border-b border-white/10 pb-8 md:mb-16 md:gap-14">
          <div>
            <p className="font-mono text-3xl text-white md:text-4xl">
              {String(clientRoster.length).padStart(2, "0")}
            </p>
            <p className="label mt-2 text-accent">Partners</p>
          </div>
          <div>
            <p className="font-mono text-3xl text-white md:text-4xl">
              {String(sectors.length).padStart(2, "0")}
            </p>
            <p className="label mt-2 text-accent">Sectors</p>
          </div>
          <div>
            <p className="font-mono text-3xl text-white md:text-4xl">
              {String(
                clientRoster.filter((c) => c.workSlug).length,
              ).padStart(2, "0")}
            </p>
            <p className="label mt-2 text-muted">Case studies live</p>
          </div>
        </div>
      </div>

      <ClientsRoster />

      <TestimonialsSection />
      <AwardsSection />
    </div>
  );
}
