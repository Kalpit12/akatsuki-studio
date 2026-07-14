export type ReachStory = {
  id: string;
  title: string;
  views: number;
  viewsLabel: string;
  description: string;
  /** Optional short subject bio */
  about?: string;
  video: string;
  poster: string;
};

export const REACH_STORIES: ReachStory[] = [
  {
    id: "shiksha-bmw",
    title: "Shiksha's BMW",
    views: 1_100_000,
    viewsLabel: "Instagram Views",
    description:
      "A fresh chapter, captured in a way that people couldn't stop watching.",
    about:
      "Shiksha Arora — award-winning media personality, presenter, and content creator with 278K Instagram and 1.5M TikTok followers. A story celebrating her new BMW reached over 1.1M Instagram views.",
    video: "/shiksha-bmw-reveal.mp4",
    poster: "/shiksha-bmw-reveal.jpg",
  },
  {
    id: "radhika-durham",
    title: "Radhika × Durham",
    views: 1_200_000,
    viewsLabel: "Instagram Views",
    description:
      "A story about growth, new beginnings, and the journey ahead.",
    about:
      "Radhika Kaur — lifestyle creator known for authentic storytelling and engaging brand collaborations. Her Durham International School feature reached 1.2M Instagram views.",
    video: "/durham-x-radhika.mp4",
    poster: "/durham-x-radhika.jpg",
  },
  {
    id: "luqmaan-picasso",
    title: "Luqmaan's Picasso",
    views: 300_000,
    viewsLabel: "Instagram Views",
    description: "A closer look at one of Nairobi's most recognizable cars.",
    about:
      "Luqmaan Hasham — one of Kenya's leading automotive creators, sharing his passion for performance cars with 387K Instagram followers. His latest \"Picasso\" video reached over 300K Instagram views.",
    video: "/luqmaan-e63.mp4",
    poster: "/luqmaan-e63.jpg",
  },
];

export const REACH_TOTAL = {
  value: 2_600_000,
  label: "combined Instagram views",
} as const;
