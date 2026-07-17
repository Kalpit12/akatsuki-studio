import type { Metadata } from "next";
import { LogoWall } from "@/components/home/LogoWall";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AwardsSection } from "@/components/home/AwardsSection";
import { ClientsRoster } from "@/components/clients/ClientsRoster";
import { clientRoster, getClientSectorsPresent } from "@/data/clients";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Brands Akatsuki Studio has worked with — across industries, briefs, and scales.",
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
              21 partners across every kind of brief.
            </p>
          </div>
        </div>
      </div>

      <LogoWall
        showIntro={false}
        caption={
          <p className="mx-auto max-w-2xl font-display text-xl leading-snug text-balance text-white max-md:px-1 md:text-3xl">
            From first campaigns to long-term partners —{" "}
            <span className="text-accent">brands that refuse to blend in.</span>
          </p>
        }
      />

      <div className="section-padding max-md:pt-10 pt-16 md:pt-20">
        <div className="mb-8 grid max-w-lg grid-cols-3 gap-4 border-b border-white/10 pb-6 md:mb-16 md:flex md:max-w-none md:flex-wrap md:gap-14 md:pb-8">
          <div>
            <p className="font-mono text-2xl text-white md:text-4xl">
              {String(clientRoster.length).padStart(2, "0")}
            </p>
            <p className="label mt-1.5 text-accent md:mt-2">Partners</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-white md:text-4xl">
              {String(sectors.length).padStart(2, "0")}
            </p>
            <p className="label mt-1.5 text-accent md:mt-2">Sectors</p>
          </div>
          <div>
            <p className="font-mono text-2xl text-white md:text-4xl">
              {String(
                clientRoster.filter((c) => c.workSlug).length,
              ).padStart(2, "0")}
            </p>
            <p className="label mt-1.5 text-muted md:mt-2">Case studies live</p>
          </div>
        </div>
      </div>

      <ClientsRoster />

      <TestimonialsSection />
      <AwardsSection />
    </div>
  );
}
