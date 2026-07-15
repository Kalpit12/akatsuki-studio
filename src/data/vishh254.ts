export type VishhWork = {
  id: string;
  title: string;
  tag: string;
  /** Optional until assets are added */
  video?: string;
  poster?: string;
};

export const VISHH254 = {
  handle: "vishh254",
  name: "Vishal Singh",
  role: "Founder · Filmmaker · Creative Director",
  eyebrow: "Personal",
  title: "Creating Stories. Chasing Bigger Dreams.",
  lead:
    "Every project is another step toward building something bigger than myself. Vishh254 is a collection of the films, experiences, and moments that continue to shape that journey.",
  social: {
    instagram: "https://www.instagram.com/vishh254",
    youtube: "https://www.youtube.com/@Vish254",
    tiktok: "https://www.tiktok.com/@vishh254",
  },
  /** Add film paths here when ready — page already renders the grid */
  works: [] as VishhWork[],
} as const;

export const VISHH254_PLACEHOLDERS: VishhWork[] = [
  { id: "01", title: "Coming soon", tag: "Film" },
  { id: "02", title: "Coming soon", tag: "Film" },
  { id: "03", title: "Coming soon", tag: "Experience" },
];
