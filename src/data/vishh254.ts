export type VishhFilm = {
  id: string;
  title: string;
  tag: string;
  video: string;
  poster: string;
  /** Homepage teaser hero — larger center card */
  featured?: boolean;
  /** Optional inline icon beside title */
  icon?: "sport-bike";
};

export const VISHH254 = {
  handle: "vishh254",
  name: "Vishal Singh",
  role: "Founder · Filmmaker · Creative Director",
  eyebrow: "Personal",
  title: "One Story at a Time.",
  titleAccent: "One Dream at a Time.",
  lead:
    "I'm Vish—a filmmaker and founder of Akatsuki Studio, documenting the machines, people, and places that inspire me while building the life I've always dreamed of.",
  social: {
    instagram: "https://www.instagram.com/vishh254",
    youtube: "https://www.youtube.com/@Vish254",
    tiktok: "https://www.tiktok.com/@vishh254",
  },
  heroVideo: "/Personal Vids/vish-bike.mp4",
  heroPoster: "/Personal Vids/vish-bike.jpg",
  /** Homepage teaser — five flagship cuts */
  teaserFilms: [
    {
      id: "teaser-01",
      title: "Bike Chase BTS",
      tag: "Behind the scenes",
      video: "/Personal Vids/bike-chase-bts.mp4",
      poster: "/Personal Vids/bike-chase-bts.jpg",
    },
    {
      id: "teaser-02",
      title: "The Bike Chase",
      tag: "Film",
      video: "/Personal Vids/chase-scene.mp4",
      poster: "/Personal Vids/chase-scene.jpg",
      featured: true,
      icon: "sport-bike",
    },
    {
      id: "teaser-03",
      title: "BMW Meet",
      tag: "Automotive",
      video: "/Personal Vids/vish-c3073.mp4",
      poster: "/Personal Vids/vish-c3073.jpg",
    },
    {
      id: "teaser-04",
      title: "Pocket Camera",
      tag: "Personal",
      video: "/Personal Vids/pocket-camera.mp4",
      poster: "/Personal Vids/pocket-camera.jpg",
    },
    {
      id: "teaser-05",
      title: "C0251",
      tag: "Film",
      video: "/Personal Vids/vish-c0251.mp4",
      poster: "/Personal Vids/vish-c0251.jpg",
    },
  ] as VishhFilm[],
  works: [
    {
      id: "01",
      title: "Swap Merc",
      tag: "Automotive",
      video: "/Personal Vids/swap-merc.mp4",
      poster: "/Personal Vids/swap-merc.jpg",
    },
    {
      id: "02",
      title: "Jeep Wrangler",
      tag: "Automotive",
      video: "/Personal Vids/jeep-wrangler.mp4",
      poster: "/Personal Vids/jeep-wrangler.jpg",
    },
    {
      id: "03",
      title: "GLE 400d",
      tag: "Automotive",
      video: "/Personal Vids/gle400d.mp4",
      poster: "/Personal Vids/gle400d.jpg",
    },
    {
      id: "04",
      title: "C9989",
      tag: "Film",
      video: "/Personal Vids/c9989.mp4",
      poster: "/Personal Vids/c9989.jpg",
    },
    {
      id: "05",
      title: "G63 Review",
      tag: "11 Motors",
      video: "/Personal Vids/g63-review.mp4",
      poster: "/Personal Vids/g63-review.jpg",
    },
  ] as VishhFilm[],
} as const;

export const VISHH254_PLACEHOLDERS: VishhFilm[] = [];
