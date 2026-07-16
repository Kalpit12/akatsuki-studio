import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LogoWall } from "@/components/home/LogoWall";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ImpactStories } from "@/components/home/ImpactStories";
import { Vishh254Teaser } from "@/components/home/Vishh254Teaser";
import { ReelSection } from "@/components/home/ReelSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { PrefetchServiceImages } from "@/components/home/PrefetchServiceImages";
import { PrefetchReelPosters } from "@/components/home/PrefetchReelPosters";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CraftSection } from "@/components/home/CraftSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { MEDIA } from "@/lib/cloudinary";

export default function HomePage() {
  return (
    <>
      {/* Hero poster only — video preload uses unsupported `as=video` in Chrome */}
      <link rel="preload" as="image" href={MEDIA.heroPoster} />
      <PrefetchServiceImages />
      <PrefetchReelPosters />
      <HeroSection />
      <AboutSection />
      <LogoWall />
      <FeaturedProjects />
      <ImpactStories />
      <Vishh254Teaser />
      <ReelSection />
      <ServicesPreview />
      <ProcessTimeline />
      <TestimonialsSection />
      <CraftSection />
      <ContactCTA />
    </>
  );
}
