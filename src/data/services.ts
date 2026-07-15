import { MEDIA } from "@/lib/cloudinary";

export const services = [
  {
    id: "campaigns",
    title: "Creative Campaigns",
    teaser: "End-to-end campaigns across every platform.",
    description:
      "The best content is never just one video. We create end-to-end campaigns that bring your brand to life across every platform — from concept and strategy to production and delivery. Whether you're launching a product, building awareness, or telling your brand's story, we create campaigns that people remember.",
    video: MEDIA.services.campaigns.video,
    image: MEDIA.services.campaigns.poster,
    tags: ["Concept", "Strategy", "Multi-platform"],
  },
  {
    id: "automotive",
    title: "Commercial Production",
    teaser: "Frames that turn heads and drive results.",
    description:
      "When it comes to commercial content, we don't follow the pack — we help set the bar. From product films and launch campaigns to branded storytelling, every frame is crafted to showcase design, emotion, and performance.",
    video: MEDIA.services.automotive.video,
    image: MEDIA.services.automotive.poster,
    tags: ["Launches", "Product", "Performance"],
  },
  {
    id: "events",
    title: "Event Coverage",
    teaser: "Cinematic coverage that outlasts the night.",
    description:
      "Corporate conferences, product launches, networking events, and brand activations — we capture every moment with cinematic quality, delivering content that keeps the conversation going long after the event ends.",
    video: MEDIA.services.events.video,
    image: MEDIA.services.events.poster,
    tags: ["Launches", "Conferences", "Activations"],
  },
  {
    id: "seo",
    title: "SEO & Digital Growth",
    teaser: "Visibility that brings the right customers.",
    description:
      "Great businesses deserve to be discovered. Our SEO strategies improve your visibility, increase organic traffic, and help the right customers find you.",
    video: MEDIA.services.seo.video,
    image: MEDIA.services.seo.poster,
    tags: ["Organic Traffic", "Visibility", "Discovery"],
  },
  {
    id: "social",
    title: "Social Media Management",
    teaser: "Strategy and content people trust and follow.",
    description:
      "Social media isn't about posting for the sake of it. We create strategies, produce engaging content, and manage your platforms to build a brand people trust, follow, and remember.",
    video: MEDIA.services.social.video,
    image: MEDIA.services.social.poster,
    tags: ["Strategy", "Content", "Community"],
  },
  {
    id: "cinematic",
    title: "Cinematic Content",
    teaser: "Films that capture attention and stick.",
    description:
      "Commercial films and branded content crafted to capture attention, tell compelling stories, and leave a lasting impression.",
    video: MEDIA.services.cinematic.video,
    image: MEDIA.services.cinematic.poster,
    tags: ["Commercials", "Brand Films", "Story"],
  },
  {
    id: "websites",
    title: "Website Design",
    teaser: "Sites that reflect the brand and convert.",
    description:
      "Modern, responsive websites designed to reflect your brand, create exceptional user experiences, and turn visitors into customers.",
    video: MEDIA.services.websites.video,
    image: MEDIA.services.websites.poster,
    tags: ["UX", "Responsive", "Conversion"],
  },
] as const;
