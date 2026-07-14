import { MEDIA } from "@/lib/cloudinary";

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
};

export const journalPosts: JournalPost[] = [
  {
    slug: "hospitality-content-that-books",
    title: "Hospitality Content That Actually Books",
    excerpt:
      "Why pretty resort photography fails — and how cinematic systems drive direct bookings instead of vanity reach.",
    date: "2025-06-12",
    category: "Hospitality",
    image: MEDIA.journal[0],
    readTime: "6 min",
  },
  {
    slug: "automotive-launches-that-move-metal",
    title: "Automotive Launches That Move Metal",
    excerpt:
      "From night drives to dealership cutdowns — building desire before the spec sheet ever hits the floor.",
    date: "2025-05-03",
    category: "Automotive",
    image: MEDIA.journal[1],
    readTime: "5 min",
  },
  {
    slug: "behind-arrival-ritual",
    title: "Behind Arrival Ritual",
    excerpt:
      "How we filmed a Nairobi luxury hotel welcome that guests save, share, and book from — shot by shot.",
    date: "2025-04-18",
    category: "Case Study",
    image: MEDIA.journal[2],
    readTime: "8 min",
  },
];

export function getJournalPost(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}

export function formatJournalDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
