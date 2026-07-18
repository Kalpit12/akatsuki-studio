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
        lead: "I picked up a camera because I loved creating.",
        body: "Somewhere along the way, that turned into building Akatsuki.",
      },
      {
        lead: "Today I lead the creative side of the studio,",
        body: "turning ideas into films, campaigns, and content that people remember. I love pressure—the bigger the challenge, the more I enjoy it.",
      },
    ],
    closing:
      "Outside of work, you'll usually find me behind a camera, behind the wheel, or planning the next story.",
  },
  {
    name: "Bansi Chitroda",
    role: "Co-Founder, Finance & Operations",
    title: "Co-Founder, Finance & Operations",
    initials: "BC",
    social: {
      instagram: "https://www.instagram.com/b.chitroda",
      youtube: YOUTUBE_CHANNEL,
    },
    story: [
      {
        lead: "Akatsuki has always been more than a business to me.",
        body: "It's something we're building from the ground up, one client, one project, and one challenge at a time.",
      },
    ],
    closing:
      "I love creating structure behind the creativity—making sure the team can do their best work while building a company we're proud of for years to come.",
  },
];
