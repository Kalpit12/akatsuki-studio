import { MEDIA } from "@/lib/cloudinary";

export type ProjectFilm = {
  video: string;
  poster: string;
  label: string;
};

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
  /** Optional portrait / cutdown films shown on the case study */
  films?: ProjectFilm[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "kyra-platinum-imports",
    title: "Kyra Platinum",
    client: "Kyra Platinum Imports",
    category: "Brand Film",
    industry: "Commercial",
    year: "2025",
    excerpt:
      "Premium metal, sharp presence — a brand film that makes every import feel inevitable.",
    coverVideo: "/Kyra/kyra-urus.mp4",
    coverImage: "/Kyra/kyra-urus.jpg",
    heroVideo: "/Kyra/kyra-urus.mp4",
    challenge:
      "Kyra Platinum Imports needed to look as exclusive online as the inventory feels on the floor — the feed was lagging behind the brand.",
    direction:
      "Cinematic vehicle presence, night energy, and detail cuts built for Instagram, YouTube, and the showroom screen.",
    results: [
      { label: "Campaign reach", value: "1.4M+" },
      { label: "Engagement lift", value: "+2.3×" },
      { label: "Enquiries", value: "+31%" },
    ],
    credits: [
      { role: "Creative Direction", name: "Akatsuki Studio" },
      { role: "Client", name: "Kyra Platinum Imports" },
    ],
    gallery: [
      "/Kyra/kyra-still-01.jpg",
      "/Kyra/kyra-still-02.jpg",
      "/Kyra/kyra-still-03.jpg",
      "/Kyra/kyra-still-04.jpg",
      "/Kyra/kyra-still-05.jpg",
      "/Kyra/kyra-still-06.jpg",
    ],
    films: [
      {
        video: "/Kyra/kyra-x3m-reel.mp4",
        poster: "/Kyra/kyra-x3m-reel.jpg",
        label: "X3 M Reel",
      },
      {
        video: "/Kyra/kyra-xm.mp4",
        poster: "/Kyra/kyra-xm.jpg",
        label: "XM Cut",
      },
    ],
    featured: true,
  },
  {
    slug: "tvs-energy",
    title: "TVS Motors",
    client: "TVS Motors",
    category: "Commercial",
    industry: "Commercial",
    year: "2025",
    excerpt:
      "Kinetic cuts and punchy sound — a feed that finally matches the pace of the brand.",
    coverVideo: "/TVS/tvs-launch.mp4",
    coverImage: "/TVS/tvs-launch.jpg",
    heroVideo: "/TVS/tvs-launch.mp4",
    challenge:
      "TVS Motors rides on pace and presence. The social system needed motion that felt alive — not stock footage with a logo.",
    direction:
      "High-tempo edits, strong sound design, and social assets the brand team can actually ship week after week.",
    results: [
      { label: "Reach", value: "2.1M+" },
      { label: "Completion rate", value: "64%" },
      { label: "Social lift", value: "+1.9×" },
    ],
    credits: [
      { role: "Creative Direction", name: "Akatsuki Studio" },
      { role: "Client", name: "TVS Motors" },
    ],
    gallery: [
      "/TVS/tvs-still-01.jpg",
      "/TVS/tvs-still-02.jpg",
      "/TVS/tvs-still-03.jpg",
      "/TVS/tvs-still-04.jpg",
      "/TVS/tvs-still-05.jpg",
      "/TVS/tvs-still-06.jpg",
    ],
    featured: true,
  },
  {
    slug: "macaash-investments",
    title: "First Impression",
    client: "Macaash Investments",
    category: "Brand Film",
    industry: "Campaign",
    year: "2025",
    excerpt:
      "Property sold on first impression — light, space, and finish that make enquiries more serious.",
    coverVideo: "/Macaash/macaash-cover.mp4",
    coverImage: "/Macaash/macaash-cover.jpg",
    heroVideo: "/Macaash/macaash-cover.mp4",
    challenge:
      "Developments need to feel inevitable on screen. Soft photography wasn't converting serious buyers.",
    direction:
      "Architectural light, quiet walkthroughs, and cuts designed for paid and organic enquiry paths.",
    results: [
      { label: "Enquiries", value: "+36%" },
      { label: "Qualified leads", value: "+24%" },
      { label: "Campaign reach", value: "980K+" },
    ],
    credits: [
      { role: "Creative Direction", name: "Akatsuki Studio" },
      { role: "Client", name: "Macaash Investments" },
    ],
    gallery: [],
    films: [
      {
        video: "/Macaash/macaash-reel-01.mp4",
        poster: "/Macaash/macaash-reel-01.jpg",
        label: "Macaash Reel 01",
      },
      {
        video: "/Macaash/macaash-reel-02.mp4",
        poster: "/Macaash/macaash-reel-02.jpg",
        label: "Macaash Reel 02",
      },
    ],
    featured: true,
  },
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
      { label: "Enquiries", value: "+28%" },
    ],
    credits: [
      { role: "Creative Direction", name: "Akatsuki Studio" },
      { role: "Client", name: "Elias Jewelers" },
    ],
    gallery: [
      "/ELIAS/elias-still-01.jpg",
      "/ELIAS/elias-still-02.jpg",
      "/ELIAS/elias-still-03.jpg",
    ],
    films: [
      {
        video: "/ELIAS/elias-diwali-reel.mp4",
        poster: "/ELIAS/elias-diwali-reel.jpg",
        label: "Diwali Reel",
      },
      {
        video: "/ELIAS/elias-gold-sequence.mp4",
        poster: "/ELIAS/elias-gold-sequence.jpg",
        label: "Gold Sequence",
      },
    ],
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
