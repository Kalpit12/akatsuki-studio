import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LogoWall } from "@/components/home/LogoWall";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ImpactStories } from "@/components/home/ImpactStories";
import { ReelSection } from "@/components/home/ReelSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { AwardsSection } from "@/components/home/AwardsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { StudioGallery } from "@/components/home/StudioGallery";
import { CraftSection } from "@/components/home/CraftSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <LogoWall />
      <FeaturedProjects />
      <ImpactStories />
      <ReelSection />
      <ServicesPreview />
      <ProcessTimeline />
      <AwardsSection />
      <TestimonialsSection />
      <StudioGallery />
      <CraftSection />
      <ContactCTA />
    </>
  );
}
