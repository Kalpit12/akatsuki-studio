import { MEDIA } from "@/lib/cloudinary";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  industry: string;
  year: string;
  excerpt: string;
  coverVideo: string;
  coverImage: string;
  heroVideo: string;
  challenge: string;
  direction: string;
  results: { label: string; value: string }[];
  credits: { role: string; name: string }[];
  gallery: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "elias-jewellery-campaign",
    title: "Elias Jewellery Campaign",
    client: "Elias Jewelers",
    category: "Campaign Film",
    industry: "Luxury Retail",
    year: "2025",
    excerpt:
      "A quiet, light-led film where every stone and silhouette gets space to breathe — built to stop the scroll for luxury jewellery.",
    coverVideo: MEDIA.projects.elias.video,
    coverImage: MEDIA.projects.elias.poster,
    heroVideo: MEDIA.projects.elias.video,
    challenge:
      "Fine jewellery dies in noisy feeds. Elias needed a campaign that felt as intentional as the craft — macro craft, soft light, zero visual clutter.",
    direction:
      "Restraint first: controlled lighting, close detail on metal and stone, and a tempo that lets desire settle. Delivered as a hero film with social cutdowns.",
    results: [
      { label: "Campaign reach", value: "850K+" },
      { label: "Engagement lift", value: "+2.1×" },
      { label: "Showroom enquiries", value: "+28%" },
    ],
    credits: [
      { role: "Creative Direction", name: "Akatsuki Studio" },
      { role: "Client", name: "Elias Jewelers" },
    ],
    gallery: [...MEDIA.projects.elias.gallery],
    featured: true,
  },
  {
    slug: "hemingways-arrival",
    title: "Arrival Ritual",
    client: "Hemingways Nairobi",
    category: "Brand Film",
    industry: "Hospitality",
    year: "2025",
    excerpt:
      "A cinematic welcome film that makes the lobby feel like the first chapter of the stay.",
    coverVideo: MEDIA.projects.resort.video,
    coverImage: MEDIA.projects.resort.poster,
    heroVideo: MEDIA.projects.resort.video,
    challenge:
      "A luxury Nairobi hotel was booking on reputation alone — online, the experience looked interchangeable with every other five-star feed.",
    direction:
      "We shot the arrival as a sensory ritual: light on stone, staff choreography, suite quiet. Built for Instagram and the booking page, not a corporate montage.",
    results: [
      { label: "Direct enquiries", value: "+34%" },
      { label: "Reel views", value: "1.1M" },
      { label: "Save rate", value: "+2.4×" },
    ],
    credits: [
      { role: "Director", name: "Amara Okonkwo" },
      { role: "DP", name: "James Mwangi" },
      { role: "Agency", name: "Akatsuki Studio" },
    ],
    gallery: [...MEDIA.projects.resort.gallery],
    featured: true,
  },
  {
    slug: "toyota-built-to-move",
    title: "Built to Move",
    client: "Toyota Kenya",
    category: "Commercial",
    industry: "Automotive",
    year: "2025",
    excerpt:
      "A launch film that sells the drive — metal, road, and the feeling of control.",
    coverVideo: MEDIA.projects.automotive.video,
    coverImage: MEDIA.projects.automotive.poster,
    heroVideo: MEDIA.projects.automotive.video,
    challenge:
      "A new model launch needed desire, not a feature list. Spec sheets don't stop the scroll — motion does.",
    direction:
      "Anamorphic night drives, macro bodywork, and a score that hits like torque. Cutdowns for dealership floors, YouTube, and Meta.",
    results: [
      { label: "Launch views", value: "3.6M" },
      { label: "Dealership traffic", value: "+22%" },
      { label: "Completion rate", value: "68%" },
    ],
    credits: [
      { role: "Creative Director", name: "Zara Kimani" },
      { role: "Editor", name: "David Ochieng" },
    ],
    gallery: [...MEDIA.projects.automotive.gallery],
    featured: true,
  },
  {
    slug: "sarova-coastal-demand",
    title: "Coastal Demand",
    client: "Sarova Hotels",
    category: "Campaign",
    industry: "Hospitality",
    year: "2024",
    excerpt:
      "From pretty resort photos to a demand engine guests book direct from.",
    coverVideo: MEDIA.projects.lodge.video,
    coverImage: MEDIA.projects.lodge.poster,
    heroVideo: MEDIA.projects.lodge.video,
    challenge:
      "Beautiful property, soft direct bookings — too much demand leaking to OTAs and influencers.",
    direction:
      "Content system across reels, F&B, rooms, and proof. Shot native for the feed, wired to a booking CTA guests already trust.",
    results: [
      { label: "Direct bookings", value: "+30%" },
      { label: "Occupancy lift", value: "+18pts" },
      { label: "Followers", value: "+8.1K" },
    ],
    credits: [
      { role: "Director", name: "Amara Okonkwo" },
      { role: "Producer", name: "Grace Wanjiru" },
    ],
    gallery: [...MEDIA.projects.lodge.gallery],
    featured: true,
  },
  {
    slug: "dobie-night-drive",
    title: "Night Drive",
    client: "DT Dobie",
    category: "Digital",
    industry: "Automotive",
    year: "2024",
    excerpt:
      "Lifestyle film and social system for a premium Nairobi dealership brand.",
    coverVideo: MEDIA.projects.motors.video,
    coverImage: MEDIA.projects.motors.poster,
    heroVideo: MEDIA.projects.motors.video,
    challenge:
      "Premium inventory was invisible online. The showroom felt exclusive; the feed felt generic.",
    direction:
      "Night-time city drives, owner portraits, and short-form cuts that make the badge feel inevitable.",
    results: [
      { label: "Reach", value: "1.3M" },
      { label: "Test drives booked", value: "+41%" },
      { label: "Engaged accounts", value: "35K+" },
    ],
    credits: [{ role: "Strategy Lead", name: "Zara Kimani" }],
    gallery: [...MEDIA.projects.motors.gallery],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
