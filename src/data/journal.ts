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
    title: "Content That Actually Converts",
    excerpt:
      "Why pretty photography fails — and how cinematic systems drive enquiries instead of vanity reach.",
    date: "2025-06-12",
    category: "Strategy",
    image: MEDIA.journal[0],
    readTime: "6 min",
  },
  {
    slug: "automotive-launches-that-move-metal",
    title: "Launches That Land",
    excerpt:
      "From hero films to social cutdowns — building desire before the brief ever hits the feed.",
    date: "2025-05-03",
    category: "Campaigns",
    image: MEDIA.journal[1],
    readTime: "5 min",
  },
  {
    slug: "behind-arrival-ritual",
    title: "Behind Arrival Ritual",
    excerpt:
      "How we filmed a welcome sequence people save, share, and enquire from — shot by shot.",
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
