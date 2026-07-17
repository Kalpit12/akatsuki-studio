export type ClientSector =
  | "automotive"
  | "corporate"
  | "education"
  | "real-estate"
  | "hospitality"
  | "healthcare"
  | "retail"
  | "media";

export type Client = {
  name: string;
  slug: string;
  sector: ClientSector;
  detail: string;
  /** Public path under /clients/wall — compressed WebP for marquees */
  logo: string;
  /** Case study slug when work is published */
  workSlug?: string;
  workTitle?: string;
};

export const SECTOR_ORDER: ClientSector[] = [
  "automotive",
  "corporate",
  "education",
  "real-estate",
  "hospitality",
  "healthcare",
  "retail",
  "media",
];

export const sectorMeta: Record<
  ClientSector,
  { label: string; title: string; blurb: string }
> = {
  automotive: {
    label: "Mobility",
    title: "Brands on the move",
    blurb:
      "Importers, custom shops, and mobility brands — content that turns heads and drives results.",
  },
  corporate: {
    label: "Corporate & Technology",
    title: "Tech and growth partners",
    blurb:
      "Technology, edtech, and fintech teams building products worth remembering.",
  },
  education: {
    label: "Education",
    title: "Schools & learning",
    blurb: "Institutions that need presence with the same care as the classroom.",
  },
  "real-estate": {
    label: "Real Estate",
    title: "Spaces & places",
    blurb:
      "Developments and home solutions that deserve a cinematic first impression.",
  },
  hospitality: {
    label: "Food & Spaces",
    title: "Coffee, dining & places",
    blurb:
      "Spaces where atmosphere sells — coffee, restaurants, and experience brands.",
  },
  healthcare: {
    label: "Healthcare",
    title: "Care with clarity",
    blurb: "Practices that need trust, polish, and a brand people feel safe with.",
  },
  retail: {
    label: "Retail & Luxury",
    title: "Luxury goods",
    blurb: "Jewellery and luxury retail where every detail has to feel intentional.",
  },
  media: {
    label: "Media",
    title: "Podcasts & content",
    blurb: "Shows and media brands that live on attention — and keep it.",
  },
};

export const clientRoster: Client[] = [
  {
    name: "TVS",
    slug: "tvs",
    sector: "automotive",
    detail: "Mobility",
    logo: "/clients/wall/tvs.webp",
    workSlug: "tvs-energy",
    workTitle: "TVS",
  },
  {
    name: "Kyra Platinum Imports",
    slug: "kyra-platinum-imports",
    sector: "automotive",
    detail: "Import Partner",
    logo: "/clients/wall/kyra-platinum-imports.webp",
    workSlug: "kyra-platinum-imports",
    workTitle: "Kyra Platinum",
  },
  {
    name: "Kyra Customs",
    slug: "kyra-customs",
    sector: "automotive",
    detail: "Custom Builds",
    logo: "/clients/wall/kyra-customs.webp",
  },
  {
    name: "11 Motors",
    slug: "11-motors",
    sector: "automotive",
    detail: "Retail",
    logo: "/clients/wall/11-motors.webp",
  },
  {
    name: "Autobox Motors",
    slug: "autobox-motors",
    sector: "automotive",
    detail: "Retail",
    logo: "/clients/wall/autobox-motors.webp",
  },
  {
    name: "Alliance Automotive",
    slug: "alliance-automotive",
    sector: "automotive",
    detail: "Brand Services",
    logo: "/clients/wall/alliance-automotive.webp",
  },
  {
    name: "Posh Autobody",
    slug: "posh-autobody",
    sector: "automotive",
    detail: "Custom Craft",
    logo: "/clients/wall/posh-autobody.webp",
  },
  {
    name: "Huawei",
    slug: "huawei",
    sector: "corporate",
    detail: "Technology",
    logo: "/clients/wall/huawei.webp",
  },
  {
    name: "Craydel Kenya",
    slug: "craydel-kenya",
    sector: "corporate",
    detail: "EdTech",
    logo: "/clients/wall/craydel-kenya.webp",
  },
  {
    name: "Watu Africa",
    slug: "watu-africa",
    sector: "corporate",
    detail: "Fintech & Mobility Finance",
    logo: "/clients/wall/watu-africa.webp",
  },
  {
    name: "Durham School",
    slug: "durham-school",
    sector: "education",
    detail: "Education",
    logo: "/clients/wall/durham-school.webp",
  },
  {
    name: "Macaash Investments",
    slug: "macaash-investments",
    sector: "real-estate",
    detail: "Real Estate",
    logo: "/clients/wall/macaash-investments.webp",
    workSlug: "macaash-investments",
    workTitle: "First Impression",
  },
  {
    name: "Stiltz Homelift",
    slug: "stiltz-homelift",
    sector: "real-estate",
    detail: "Home Accessibility",
    logo: "/clients/wall/stiltz-homelift.webp",
  },
  {
    name: "Connect Coffee Museum",
    slug: "connect-coffee-museum",
    sector: "hospitality",
    detail: "Coffee Experience",
    logo: "/clients/wall/connect-coffee-museum.webp",
  },
  {
    name: "Bao Box",
    slug: "bao-box",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/wall/bao-box.webp",
  },
  {
    name: "Slate",
    slug: "slate",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/wall/slate.webp",
  },
  {
    name: "Inti",
    slug: "inti",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/wall/inti.webp",
  },
  {
    name: "Bambino",
    slug: "bambino",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/wall/bambino.webp",
  },
  {
    name: "Keystone Dental",
    slug: "keystone-dental",
    sector: "healthcare",
    detail: "Dental & Healthcare",
    logo: "/clients/wall/keystone-dental.webp",
  },
  {
    name: "Elias Jewelers",
    slug: "elias-jewelers",
    sector: "retail",
    detail: "Luxury Jewellery",
    logo: "/clients/wall/elias-jewelers.webp",
    workSlug: "elias-jewellery-campaign",
    workTitle: "Elias Jewellery Campaign",
  },
  {
    name: "CoffeePump Podcast",
    slug: "coffeepump-podcast",
    sector: "media",
    detail: "Podcast",
    logo: "/clients/wall/coffeepump-podcast.webp",
  },
];

/** Flat list for marquee (duplicated for seamless scroll). */
export const clients = [
  ...clientRoster,
  ...clientRoster.slice(0, 6),
] as const;

export function getClientsBySector(sector: ClientSector) {
  return clientRoster.filter((c) => c.sector === sector);
}

export function getClientSectorsPresent() {
  return SECTOR_ORDER.filter((s) =>
    clientRoster.some((c) => c.sector === s),
  );
}

export const awards = [
  { title: "Loeries Bronze", year: "2025", project: "Arrival Ritual" },
  { title: "AMA Awards Shortlist", year: "2025", project: "Built to Move" },
  { title: "Pulse Film Festival", year: "2024", project: "Coastal Demand" },
  { title: "Marketing Society Kenya", year: "2024", project: "Night Drive" },
] as const;
