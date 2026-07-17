import { MEDIA } from "@/lib/cloudinary";

export type FilmOrientation = "horizontal" | "vertical";

export type ProjectFilm = {
  video: string;
  poster: string;
  label: string;
  /** Native aspect — horizontal uses 16:9, vertical uses 9:16 in the case study */
  orientation?: FilmOrientation;
  /** Center highlight in the films grid (case study) */
  featured?: boolean;
};

export function getFilmOrientation(film: ProjectFilm): FilmOrientation {
  return film.orientation ?? "vertical";
}

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
    slug: "tvs-energy",
    title: "TVS Motors",
    client: "TVS Motors",
    category: "Commercial",
    industry: "Commercial",
    year: "2025",
    excerpt:
      "Kinetic cuts and punchy sound — a feed that finally matches the pace of the brand.",
    coverVideo: "/TVS/tvs-draft1.mp4",
    coverImage: "/TVS/tvs-draft1.jpg",
    heroVideo: "/TVS/tvs-draft1.mp4",
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
    films: [
      {
        video: "/TVS/tvs-meru-day.mp4",
        poster: "/TVS/tvs-meru-day.jpg",
        label: "Meru Day",
        orientation: "horizontal",
      },
      {
        video: "/TVS/tvs-mt-saturday.mp4",
        poster: "/TVS/tvs-mt-saturday.jpg",
        label: "MT Saturday",
        orientation: "horizontal",
      },
      {
        video: "/TVS/tvs-mea-awards.mp4",
        poster: "/TVS/tvs-mea-awards.jpg",
        label: "MEA Awards",
        orientation: "horizontal",
      },
      {
        video: "/TVS/tvs-motor-show.mp4",
        poster: "/TVS/tvs-motor-show.jpg",
        label: "Motor Show",
        orientation: "vertical",
      },
    ],
    featured: true,
  },
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
      "/Kyra/kyra-gallery-01.webp",
      "/Kyra/kyra-gallery-02.webp",
      "/Kyra/kyra-gallery-03.webp",
      "/Kyra/kyra-gallery-04.webp",
      "/Kyra/kyra-gallery-05.webp",
      "/Kyra/kyra-gallery-06.webp",
      "/Kyra/kyra-gallery-07.webp",
      "/Kyra/kyra-gallery-08.webp",
      "/Kyra/kyra-gallery-09.webp",
      "/Kyra/kyra-gallery-10.webp",
      "/Kyra/kyra-gallery-11.webp",
      "/Kyra/kyra-gallery-12.webp",
      "/Kyra/kyra-gallery-13.webp",
      "/Kyra/kyra-gallery-14.webp",
    ],
    films: [
      {
        video: "/Kyra/kyra-x3m-reel.mp4",
        poster: "/Kyra/kyra-x3m-reel.jpg",
        label: "X3 M Reel",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-xm.mp4",
        poster: "/Kyra/kyra-xm.jpg",
        label: "XM Cut",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-c5643.mp4",
        poster: "/Kyra/kyra-c5643.jpg",
        label: "C5643",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-c5678.mp4",
        poster: "/Kyra/kyra-c5678.jpg",
        label: "C5678",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-e63.mp4",
        poster: "/Kyra/kyra-e63.jpg",
        label: "E63",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-m440i.mp4",
        poster: "/Kyra/kyra-m440i.jpg",
        label: "M440i Insta",
        orientation: "horizontal",
      },
      {
        video: "/Kyra/kyra-bentley-review.mp4",
        poster: "/Kyra/kyra-bentley-review.jpg",
        label: "Bentley Review",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-c2625.mp4",
        poster: "/Kyra/kyra-c2625.jpg",
        label: "C2625",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-lc-v8-review.mp4",
        poster: "/Kyra/kyra-lc-v8-review.jpg",
        label: "LC V8 Review",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-obsessed-sti.mp4",
        poster: "/Kyra/kyra-obsessed-sti.jpg",
        label: "Obsessed STI",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-c63s.mp4",
        poster: "/Kyra/kyra-c63s.jpg",
        label: "C63S",
        orientation: "vertical",
      },
      {
        video: "/Kyra/kyra-svr-reel.mp4",
        poster: "/Kyra/kyra-svr-reel.jpg",
        label: "SVR Reel",
        orientation: "vertical",
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
      "/ELIAS/elias-still-04.jpg",
      "/ELIAS/elias-still-05.jpg",
      "/ELIAS/elias-still-06.jpg",
      "/ELIAS/elias-still-07.jpg",
      "/ELIAS/elias-still-08.jpg",
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
        video: "/Macaash/macaash-film-01.mp4",
        poster: "/Macaash/macaash-film-01.jpg",
        label: "Property Film 1",
      },
      {
        video: "/Macaash/macaash-film-02.mp4",
        poster: "/Macaash/macaash-film-02.jpg",
        label: "Property Film 2",
      },
      {
        video: "/Macaash/macaash-reel-01.mp4",
        poster: "/Macaash/macaash-reel-01.jpg",
        label: "Property Film 3",
      },
      {
        video: "/Macaash/macaash-film-03.mp4",
        poster: "/Macaash/macaash-film-03.jpg",
        label: "Property Film 4",
      },
      {
        video: "/Macaash/macaash-film-04.mp4",
        poster: "/Macaash/macaash-film-04.jpg",
        label: "Property Film 5",
      },
    ],
    featured: true,
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
