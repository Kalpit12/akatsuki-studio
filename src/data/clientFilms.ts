import type { FilmOrientation } from "@/data/projects";

export type ClientFilm = {
  video: string;
  poster: string;
  label: string;
  /** Optional grid placement for portfolio film grids */
  gridClass?: string;
};

export type ClientWork = {
  /** Matches Client.slug in clients.ts */
  slug: string;
  heroVideo?: string;
  heroPoster?: string;
  /** Native aspect of hero/cover film for homepage cards */
  heroOrientation?: FilmOrientation;
  /** Image-only hero when no cover film exists */
  heroImage?: string;
  excerpt: string;
  films: ClientFilm[];
  /** Offset second-row films into gaps between top-row columns (desktop) */
  filmsGrid?: "staggered";
  /** Still gallery for photography-led clients */
  gallery?: string[];
};

export const clientWorks: ClientWork[] = [
  {
    slug: "11-motors",
    heroVideo: "/11 Motors/11-motors-range-rover.mp4",
    heroPoster: "/11 Motors/11-motors-range-rover.jpg",
    excerpt:
      "Premium metal, showroom presence, and retail energy — films built for the floor and the feed.",
    films: [
      {
        video: "/11 Motors/11-motors-range-rover.mp4",
        poster: "/11 Motors/11-motors-range-rover.jpg",
        label: "Range Rover Vogue",
      },
      {
        video: "/11 Motors/11-motors-g63.mp4",
        poster: "/11 Motors/11-motors-g63.jpg",
        label: "G63 Review",
      },
      {
        video: "/11 Motors/11-motors-cx5.mp4",
        poster: "/11 Motors/11-motors-cx5.jpg",
        label: "CX5 Shades",
      },
      {
        video: "/11 Motors/11-motors-gle53.mp4",
        poster: "/11 Motors/11-motors-gle53.jpg",
        label: "GLE 53",
      },
    ],
  },
  {
    slug: "autobox-motors",
    heroVideo: "/Autobox/autobox-rr-main.mp4",
    heroPoster: "/Autobox/autobox-rr-main.jpg",
    excerpt:
      "Automotive retail with attitude — sharp cuts, night energy, and brand films that sell the showroom.",
    filmsGrid: "staggered",
    films: [
      {
        video: "/Autobox/autobox-rr-main.mp4",
        poster: "/Autobox/autobox-rr-main.jpg",
        label: "Range Rover",
      },
      {
        video: "/Autobox/autobox-x6.mp4",
        poster: "/Autobox/autobox-x6.jpg",
        label: "X6 Short",
        gridClass: "lg:col-span-2 lg:col-start-1",
      },
      {
        video: "/Autobox/autobox-crown-v2.mp4",
        poster: "/Autobox/autobox-crown-v2.jpg",
        label: "Crown V2",
        gridClass: "lg:col-span-2 lg:col-start-3",
      },
      {
        video: "/Autobox/autobox-lc30.mp4",
        poster: "/Autobox/autobox-lc30.jpg",
        label: "LC30",
        gridClass: "lg:col-span-2 lg:col-start-5",
      },
      {
        video: "/Autobox/autobox-lexus-vip.mp4",
        poster: "/Autobox/autobox-lexus-vip.jpg",
        label: "Lexus VIP",
        gridClass: "lg:col-span-2 lg:col-start-2",
      },
      {
        video: "/Autobox/autobox-vogue-2023.mp4",
        poster: "/Autobox/autobox-vogue-2023.jpg",
        label: "Vogue 2023",
        gridClass: "lg:col-span-2 lg:col-start-4",
      },
    ],
    gallery: [
      "/Autobox/autobox-gallery-01.webp",
      "/Autobox/autobox-gallery-02.webp",
      "/Autobox/autobox-gallery-03.webp",
      "/Autobox/autobox-gallery-04.webp",
      "/Autobox/autobox-gallery-05.webp",
      "/Autobox/autobox-gallery-06.webp",
      "/Autobox/autobox-gallery-07.webp",
      "/Autobox/autobox-gallery-08.webp",
      "/Autobox/autobox-gallery-09.webp",
      "/Autobox/autobox-gallery-10.webp",
      "/Autobox/autobox-gallery-11.webp",
      "/Autobox/autobox-gallery-12.webp",
      "/Autobox/autobox-gallery-13.webp",
      "/Autobox/autobox-gallery-14.webp",
      "/Autobox/autobox-gallery-15.webp",
      "/Autobox/autobox-gallery-16.webp",
      "/Autobox/autobox-gallery-17.webp",
      "/Autobox/autobox-gallery-18.webp",
    ],
  },
  {
    slug: "connect-coffee-museum",
    heroVideo: "/Connect Coffee/connect-coffee-tour.mp4",
    heroPoster: "/Connect Coffee/connect-coffee-tour.jpg",
    excerpt:
      "Coffee culture, hospitality, and experience-led storytelling for one of Nairobi's signature spaces.",
    films: [
      {
        video: "/Connect Coffee/connect-coffee-tour.mp4",
        poster: "/Connect Coffee/connect-coffee-tour.jpg",
        label: "Connect Tour",
      },
      {
        video: "/Connect Coffee/connect-coffee-testimonial.mp4",
        poster: "/Connect Coffee/connect-coffee-testimonial.jpg",
        label: "Coffee Tasting",
      },
    ],
  },
  {
    slug: "bambino",
    heroVideo: "/Bambino/bambino-pasta.mp4",
    heroPoster: "/Bambino/bambino-pasta.jpg",
    heroOrientation: "horizontal",
    excerpt:
      "Restaurant energy, dish-led reels, and social cuts built for appetite and atmosphere.",
    films: [
      {
        video: "/Bambino/bambino-pasta.mp4",
        poster: "/Bambino/bambino-pasta.jpg",
        label: "Pasta",
      },
      {
        video: "/Bambino/bambino-c0648.mp4",
        poster: "/Bambino/bambino-c0648.jpg",
        label: "C0648",
      },
      {
        video: "/Bambino/bambino-dishes.mp4",
        poster: "/Bambino/bambino-dishes.jpg",
        label: "Different Dishes",
      },
      {
        video: "/Bambino/bambino-iced-coffee.mp4",
        poster: "/Bambino/bambino-iced-coffee.jpg",
        label: "Iced Coffee",
      },
      {
        video: "/Bambino/bambino-tipsy-thursdays.mp4",
        poster: "/Bambino/bambino-tipsy-thursdays.jpg",
        label: "Tipsy Thursdays",
      },
    ],
  },
  {
    slug: "bao-box",
    heroVideo: "/Bao Box/bao-box-final.mp4",
    heroPoster: "/Bao Box/bao-box-final.jpg",
    excerpt:
      "Food-forward social content with punchy pacing and a brand feel worth stopping for.",
    films: [
      {
        video: "/Bao Box/bao-box-final.mp4",
        poster: "/Bao Box/bao-box-final.jpg",
        label: "Bao Box Final",
      },
    ],
  },
  {
    slug: "inti",
    heroVideo: "/INTI/inti-sushi-chef.mp4",
    heroPoster: "/INTI/inti-sushi-chef.jpg",
    excerpt:
      "Restaurant films with craft at the centre — dishes, chefs, and the detail that makes Inti distinct.",
    films: [
      {
        video: "/INTI/inti-sushi-chef.mp4",
        poster: "/INTI/inti-sushi-chef.jpg",
        label: "Sushi Chef Elias",
      },
      {
        video: "/INTI/inti-bento-box.mp4",
        poster: "/INTI/inti-bento-box.jpg",
        label: "Bento Box",
      },
    ],
  },
  {
    slug: "stiltz-homelift",
    heroVideo: "/Stiltz Lifts/stiltz-hero.mp4",
    heroPoster: "/Stiltz Lifts/stiltz-hero.jpg",
    heroOrientation: "vertical",
    excerpt:
      "Home accessibility told with clarity — product films for events, installs, and everyday living.",
    films: [
      {
        video: "/Stiltz Lifts/stiltz-hero.mp4",
        poster: "/Stiltz Lifts/stiltz-hero.jpg",
        label: "Stiltz Hero",
      },
      {
        video: "/Stiltz Lifts/stiltz-college.mp4",
        poster: "/Stiltz Lifts/stiltz-college.jpg",
        label: "Stiltz College",
      },
      {
        video: "/Stiltz Lifts/stiltz-event.mp4",
        poster: "/Stiltz Lifts/stiltz-event.jpg",
        label: "Stiltz Event",
      },
      {
        video: "/Stiltz Lifts/stiltz-home.mp4",
        poster: "/Stiltz Lifts/stiltz-home.jpg",
        label: "Stiltz Home",
      },
      {
        video: "/Stiltz Lifts/stiltz-film-04.mp4",
        poster: "/Stiltz Lifts/stiltz-film-04.jpg",
        label: "Home Lift",
      },
    ],
    gallery: [
      "/Stiltz Lifts/stiltz-still-01.jpg",
      "/Stiltz Lifts/stiltz-still-02.jpg",
      "/Stiltz Lifts/stiltz-still-03.jpg",
      "/Stiltz Lifts/stiltz-still-04.jpg",
      "/Stiltz Lifts/stiltz-still-05.jpg",
      "/Stiltz Lifts/stiltz-still-06.jpg",
    ],
  },
  {
    slug: "slate",
    heroVideo: "/Slate/slate-meat.mp4",
    heroPoster: "/Slate/slate-meat.jpg",
    excerpt:
      "Kitchen, bar, and dining atmosphere — content that carries the mood of the room.",
    films: [
      {
        video: "/Slate/slate-meat.mp4",
        poster: "/Slate/slate-meat.jpg",
        label: "Meat Video",
      },
      {
        video: "/Slate/slate-lunch-reset.mp4",
        poster: "/Slate/slate-lunch-reset.jpg",
        label: "Lunch Reset",
      },
      {
        video: "/Slate/slate-kitchen-bar.mp4",
        poster: "/Slate/slate-kitchen-bar.jpg",
        label: "Kitchen & Bar",
      },
    ],
  },
  {
    slug: "posh-autobody",
    heroVideo: "/Posh Auto Body/posh-defender-ppf.mp4",
    heroPoster: "/Posh Auto Body/posh-defender-ppf.jpg",
    excerpt:
      "Custom craft and paint protection — detail-led films for premium automotive body work.",
    films: [
      {
        video: "/Posh Auto Body/posh-defender-ppf.mp4",
        poster: "/Posh Auto Body/posh-defender-ppf.jpg",
        label: "Defender PPF",
      },
      {
        video: "/Posh Auto Body/posh-defender-windscreen.mp4",
        poster: "/Posh Auto Body/posh-defender-windscreen.jpg",
        label: "Defender Windscreen",
      },
      {
        video: "/Posh Auto Body/posh-aston.mp4",
        poster: "/Posh Auto Body/posh-aston.jpg",
        label: "Aston Martin",
      },
      {
        video: "/Posh Auto Body/posh-range-rover-ppf.mp4",
        poster: "/Posh Auto Body/posh-range-rover-ppf.jpg",
        label: "Range Rover PPF",
      },
    ],
  },
  {
    slug: "huawei",
    heroVideo: "/huawei-about.mp4",
    heroPoster: "/huawei-about.jpg",
    heroOrientation: "horizontal",
    excerpt:
      "Product launch film for Huawei Africa — cinematic energy built for stage, screen, and social.",
    films: [
      {
        video: "/huawei-about.mp4",
        poster: "/huawei-about.jpg",
        label: "Product Launch Africa",
      },
    ],
  },
  {
    slug: "craydel-kenya",
    heroVideo: "/Craydel/craydel-dan-scholarship.mp4",
    heroPoster: "/Craydel/craydel-dan-scholarship.jpg",
    excerpt:
      "EdTech storytelling for Craydel — scholarship and programme films built to inspire students and parents across Kenya.",
    films: [
      {
        video: "/Craydel/craydel-dan-scholarship.mp4",
        poster: "/Craydel/craydel-dan-scholarship.jpg",
        label: "Dan Scholarship",
      },
      {
        video: "/Craydel/craydel-emi-programmes.mp4",
        poster: "/Craydel/craydel-emi-programmes.jpg",
        label: "EMI Programmes",
      },
    ],
  },
  {
    slug: "durham-school",
    heroVideo: "/durham-x-radhika.mp4",
    heroPoster: "/durham-x-radhika.jpg",
    excerpt:
      "Radhika × Durham International School — authentic storytelling that reached over a million views.",
    films: [
      {
        video: "/durham-x-radhika.mp4",
        poster: "/durham-x-radhika.jpg",
        label: "Radhika × Durham",
      },
    ],
  },
  {
    slug: "keystone-dental",
    heroVideo: "/Key stone dental/keystone-cover.mp4",
    heroPoster: "/Key stone dental/keystone-cover.jpg",
    heroOrientation: "vertical",
    excerpt:
      "Clinical care, filmed with intention — preparation, presence, and trust for Keystone Dental Clinic in Nairobi.",
    films: [
      {
        video: "/Key stone dental/keystone-cover.mp4",
        poster: "/Key stone dental/keystone-cover.jpg",
        label: "Ready for Care",
      },
      {
        video: "/Key stone dental/keystone-film-01.mp4",
        poster: "/Key stone dental/keystone-film-01.jpg",
        label: "Inside the Clinic",
      },
      {
        video: "/Key stone dental/keystone-film-02.mp4",
        poster: "/Key stone dental/keystone-film-02.jpg",
        label: "5 Things",
      },
      {
        video: "/Key stone dental/keystone-film-03.mp4",
        poster: "/Key stone dental/keystone-film-03.jpg",
        label: "Black Triangles",
      },
      {
        video: "/Key stone dental/keystone-film-04.mp4",
        poster: "/Key stone dental/keystone-film-04.jpg",
        label: "Welcome In",
      },
    ],
  },
  {
    slug: "kyra-customs",
    heroVideo: "/Kyra Customs/kyra-customs-radhika-ppf.mp4",
    heroPoster: "/Kyra Customs/kyra-customs-radhika-ppf.jpg",
    heroOrientation: "vertical",
    excerpt:
      "Paint protection film and custom detailing — sharp cuts that show the craft behind every wrap and finish.",
    films: [
      {
        video: "/Kyra Customs/kyra-customs-radhika-ppf.mp4",
        poster: "/Kyra Customs/kyra-customs-radhika-ppf.jpg",
        label: "Radhika PPF",
      },
      {
        video: "/Kyra Customs/kyra-customs-ppf.mp4",
        poster: "/Kyra Customs/kyra-customs-ppf.jpg",
        label: "Kyra Customs PPF",
      },
      {
        video: "/Kyra Customs/kyra-customs-ppf-love.mp4",
        poster: "/Kyra Customs/kyra-customs-ppf-love.jpg",
        label: "PPF Love",
      },
    ],
  },
  {
    slug: "mara-enkaji",
    heroVideo: "/Mara Enkaji/mara-enkaji-room-c5.mp4",
    heroPoster: "/Mara Enkaji/mara-enkaji-room-c5.jpg",
    heroOrientation: "vertical",
    excerpt:
      "Safari lodge atmosphere — bush breakfasts, river walks, and nights under the Mara sky, filmed for place and presence.",
    films: [
      {
        video: "/Mara Enkaji/mara-enkaji-room-c5.mp4",
        poster: "/Mara Enkaji/mara-enkaji-room-c5.jpg",
        label: "Room C5",
      },
      {
        video: "/Mara Enkaji/mara-enkaji-nights.mp4",
        poster: "/Mara Enkaji/mara-enkaji-nights.jpg",
        label: "Nights Mara",
      },
      {
        video: "/Mara Enkaji/mara-enkaji-bush-breakfast.mp4",
        poster: "/Mara Enkaji/mara-enkaji-bush-breakfast.jpg",
        label: "Bush Breakfast",
      },
      {
        video: "/Mara Enkaji/mara-enkaji-lunch.mp4",
        poster: "/Mara Enkaji/mara-enkaji-lunch.jpg",
        label: "Lunch",
      },
      {
        video: "/Mara Enkaji/mara-enkaji-drink.mp4",
        poster: "/Mara Enkaji/mara-enkaji-drink.jpg",
        label: "Drinks",
      },
      {
        video: "/Mara Enkaji/mara-enkaji-river-walk.mp4",
        poster: "/Mara Enkaji/mara-enkaji-river-walk.jpg",
        label: "River Walk",
      },
    ],
    gallery: [
      "/Mara Enkaji/mara-enkaji-gallery-01.webp",
      "/Mara Enkaji/mara-enkaji-gallery-02.webp",
      "/Mara Enkaji/mara-enkaji-gallery-03.webp",
      "/Mara Enkaji/mara-enkaji-gallery-04.webp",
      "/Mara Enkaji/mara-enkaji-gallery-05.webp",
      "/Mara Enkaji/mara-enkaji-gallery-06.webp",
      "/Mara Enkaji/mara-enkaji-gallery-07.webp",
      "/Mara Enkaji/mara-enkaji-gallery-08.webp",
      "/Mara Enkaji/mara-enkaji-gallery-09.webp",
      "/Mara Enkaji/mara-enkaji-gallery-10.webp",
      "/Mara Enkaji/mara-enkaji-gallery-11.webp",
      "/Mara Enkaji/mara-enkaji-gallery-12.webp",
      "/Mara Enkaji/mara-enkaji-gallery-13.webp",
      "/Mara Enkaji/mara-enkaji-gallery-14.webp",
      "/Mara Enkaji/mara-enkaji-gallery-15.webp",
      "/Mara Enkaji/mara-enkaji-gallery-16.webp",
      "/Mara Enkaji/mara-enkaji-gallery-17.webp",
      "/Mara Enkaji/mara-enkaji-gallery-18.webp",
      "/Mara Enkaji/mara-enkaji-gallery-19.webp",
      "/Mara Enkaji/mara-enkaji-gallery-20.webp",
      "/Mara Enkaji/mara-enkaji-gallery-21.webp",
    ],
  },
  {
    slug: "alliance-automotive",
    heroImage: "/Alliance Automotive/DSC09702.jpg",
    excerpt:
      "Brand services and automotive presence — photography that captures craft, detail, and the work on the floor.",
    films: [],
    gallery: [
      "/Alliance Automotive/DSC09702.jpg",
      "/Alliance Automotive/DSC09705.jpg",
      "/Alliance Automotive/DSC09707.jpg",
      "/Alliance Automotive/DSC09712.jpg",
      "/Alliance Automotive/DSC09716.jpg",
      "/Alliance Automotive/DSC09726.jpg",
    ],
  },
];

export function getClientWork(slug: string) {
  return clientWorks.find((work) => work.slug === slug);
}

export function hasClientWork(slug: string) {
  return clientWorks.some((work) => work.slug === slug);
}

export function getClientWorkSlugs() {
  return clientWorks.map((work) => work.slug);
}
