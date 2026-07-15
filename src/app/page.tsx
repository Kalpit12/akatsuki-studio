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
import { MEDIA } from "@/lib/cloudinary";

export default function HomePage() {
  return (
    <>
      {/* Hero-only: give the first reel exclusive early bandwidth */}
      <link rel="preload" as="video" href={MEDIA.hero} type="video/mp4" />
      <link rel="preload" as="image" href={MEDIA.heroPoster} />
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
