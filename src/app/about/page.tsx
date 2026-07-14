import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TeamSection } from "@/components/home/TeamSection";
import { StudioGallery } from "@/components/home/StudioGallery";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Akatsuki Studio is a Nairobi creative production studio for hospitality and automotive brands — cinematic campaigns that fill rooms and move metal.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40">
      <div className="section-padding pb-16">
        <p className="label mb-4">About</p>
        <h1 className="heading-xl max-w-4xl text-balance">
          Storytellers for the stay and the drive.
        </h1>
      </div>
      <AboutSection
        eyebrow="Our Story"
        title="We help hotels fill rooms and automotive brands move metal."
        paragraphs={[
          "Akatsuki Studio partners with hospitality and automotive clients across Kenya — from luxury Nairobi hotels and coastal resorts to vehicle launches and dealership campaigns.",
          "We blend cinematic production with demand strategy so the work looks expensive and performs: direct bookings, showroom traffic, and a feed guests and drivers can't ignore.",
        ]}
        closing="Let's create something guests book and drivers chase."
        showTruth={false}
        showAboutLink={false}
        showStudioFloor
      />
      <ProcessTimeline />
      <StudioGallery />
      <TeamSection />
      <div className="section-padding pb-32 text-center">
        <MagneticButton href="/contact">Work With Us</MagneticButton>
      </div>
    </div>
  );
}
