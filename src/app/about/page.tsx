import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TeamSection } from "@/components/home/TeamSection";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Akatsuki Studio is a Nairobi creative production studio — cinematic campaigns, brands, and stories for clients of every kind.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="section-padding pb-16">
        <p className="label mb-4">About</p>
        <h1 className="heading-lg max-w-3xl text-balance">
          We&apos;re just a bunch of creatives who hate boring.
        </h1>
      </div>
      <AboutSection
        eyebrow="Our Story"
        title="Akatsuki started with a camera and an obsession for making things look and feel different. Today, we're a team creating campaigns, brands, and stories that people actually stop scrolling for."
        titleClassName="heading-md max-w-4xl leading-snug"
        paragraphs={[
          "Akatsuki Studio exists for brands that want more than content. We help businesses build attention, trust, and identity through thoughtful strategy, bold ideas, and cinematic execution.",
          "Whether it's a single campaign or a long-term partnership, our goal is simple: create work that feels different, performs better, and stands the test of time.",
        ]}
        closing="Let's build something unforgettable."
        closingClassName="text-accent"
        showTruth={false}
        showAboutLink={false}
        showStudioFloor
      />
      <ProcessTimeline />
      <TeamSection />
      <div className="section-padding pb-32 text-center">
        <MagneticButton href="/contact">Start the Project</MagneticButton>
      </div>
    </div>
  );
}
