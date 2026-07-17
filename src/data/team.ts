export type StoryBlock = {
  lead: string;
  body: string;
};

export type TeamSocial = {
  instagram: string;
  youtube: string;
  /** Only used when provided (e.g. Vishal) */
  tiktok?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Short line under the name (title case) */
  title: string;
  /** Default portrait */
  image?: string;
  /** Shown on hover (falls back to image if omitted) */
  hoverImage?: string;
  /** Initials avatar when no photo is available */
  initials?: string;
  social: TeamSocial;
  story: StoryBlock[];
  closing: string;
};

const YOUTUBE_CHANNEL = "https://www.youtube.com/@Vish254";

export const team: TeamMember[] = [
  {
    name: "Vishal Singh",
    role: "Founder, Akatsuki Studio",
    title: "Founder, Filmmaker, Creative Director",
    initials: "VS",
    social: {
      instagram: "https://www.instagram.com/vishh254",
      youtube: YOUTUBE_CHANNEL,
      tiktok: "https://www.tiktok.com/@vishh254",
    },
    story: [
      {
        lead: "I picked up a camera chasing feeling — and never looked back.",
        body: "What began as frames that made people pause grew into films, campaigns, and branded stories with weight. I move between photography, filmmaking, and creative direction — always hunting the clearest way to tell each story.",
      },
      {
        lead: "A modern studio means pushing past safe.",
        body: "From cinematic portraits to punchy reels and full campaigns, I aim to build work that feels distinct — the kind that breaks the scroll and makes someone stop.",
      },
      {
        lead: "Details matter because they carry intention.",
        body: "Every frame, every cut, every beat has to serve the story. If it doesn’t, it doesn’t stay.",
      },
    ],
    closing:
      "This is where intention becomes craft — and craft becomes work people remember.",
  },
  {
    name: "B. Chitroda",
    role: "Founder, Akatsuki Studio",
    title: "Founder, Creative Strategist, Storyteller",
    initials: "BC",
    social: {
      instagram: "https://www.instagram.com/b.chitroda",
      youtube: YOUTUBE_CHANNEL,
    },
    story: [
      {
        lead: "I build brands people don’t just see — they feel.",
        body: "My lane is the space between concept and culture: how a brief becomes a look, a mood, a moment that lives past the campaign window. Style is never decoration for me — it’s strategy in disguise.",
      },
      {
        lead: "Presence is the real deliverable.",
        body: "Whether we’re shaping a launch, a lifestyle cut, or a full visual system, I obsess over what makes someone pause mid-scroll and choose you. Attention is earned. Memory is designed.",
      },
      {
        lead: "Taste is a filter — not a vibe.",
        body: "I push for work that is sharp, current, and unmistakably ours. If it doesn’t raise the bar for the brand and for Akatsuki, we keep cutting until it does.",
      },
    ],
    closing:
      "This is where vision meets nerve — and brands leave a mark that lasts.",
  },
];
