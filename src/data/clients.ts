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
  /** Public path under /clients — transparent PNG */
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
    label: "Automotive",
    title: "Motor brands & dealerships",
    blurb:
      "Importers, custom shops, dealerships, and mobility brands — content that turns heads and moves metal.",
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
    label: "Real Estate & Property",
    title: "Property & accessibility",
    blurb:
      "Investments and home solutions that deserve a cinematic first impression.",
  },
  hospitality: {
    label: "Hospitality & Restaurants",
    title: "Coffee, dining & hospitality",
    blurb:
      "Spaces where atmosphere sells — coffee museums, restaurants, and hospitality brands.",
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
    detail: "Motorcycles & Mobility",
    logo: "/clients/tvs.png",
  },
  {
    name: "Kyra Platinum Imports",
    slug: "kyra-platinum-imports",
    sector: "automotive",
    detail: "Vehicle Importer",
    logo: "/clients/kyra-platinum-imports.png",
  },
  {
    name: "Kyra Customs",
    slug: "kyra-customs",
    sector: "automotive",
    detail: "Vehicle Customisation",
    logo: "/clients/kyra-customs.png",
  },
  {
    name: "11 Motors",
    slug: "11-motors",
    sector: "automotive",
    detail: "Dealership",
    logo: "/clients/11-motors.png",
  },
  {
    name: "Autobox Motors",
    slug: "autobox-motors",
    sector: "automotive",
    detail: "Dealership",
    logo: "/clients/autobox-motors.png",
  },
  {
    name: "Alliance Automotive",
    slug: "alliance-automotive",
    sector: "automotive",
    detail: "Automotive Services",
    logo: "/clients/alliance-automotive.png",
  },
  {
    name: "Posh Autobody",
    slug: "posh-autobody",
    sector: "automotive",
    detail: "Auto Body & Paint",
    logo: "/clients/posh-autobody.png",
  },
  {
    name: "Huawei",
    slug: "huawei",
    sector: "corporate",
    detail: "Technology",
    logo: "/clients/huawei.png",
  },
  {
    name: "Craydel Kenya",
    slug: "craydel-kenya",
    sector: "corporate",
    detail: "EdTech",
    logo: "/clients/craydel-kenya.png",
  },
  {
    name: "Watu Africa",
    slug: "watu-africa",
    sector: "corporate",
    detail: "Fintech & Mobility Finance",
    logo: "/clients/watu-africa.png",
  },
  {
    name: "Durham School",
    slug: "durham-school",
    sector: "education",
    detail: "Education",
    logo: "/clients/durham-school.png",
  },
  {
    name: "Macaash Investments",
    slug: "macaash-investments",
    sector: "real-estate",
    detail: "Real Estate",
    logo: "/clients/macaash-investments.png",
  },
  {
    name: "Stiltz Homelift",
    slug: "stiltz-homelift",
    sector: "real-estate",
    detail: "Home Accessibility",
    logo: "/clients/stiltz-homelift.png",
  },
  {
    name: "Connect Coffee Museum",
    slug: "connect-coffee-museum",
    sector: "hospitality",
    detail: "Coffee & Hospitality",
    logo: "/clients/connect-coffee-museum.png",
  },
  {
    name: "Bao Box",
    slug: "bao-box",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/bao-box.png",
  },
  {
    name: "Slate",
    slug: "slate",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/slate.png",
  },
  {
    name: "Inti",
    slug: "inti",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/inti.png",
  },
  {
    name: "Bambino",
    slug: "bambino",
    sector: "hospitality",
    detail: "Restaurant",
    logo: "/clients/bambino.png",
  },
  {
    name: "Keystone Dental",
    slug: "keystone-dental",
    sector: "healthcare",
    detail: "Dental & Healthcare",
    logo: "/clients/keystone-dental.png",
  },
  {
    name: "Elias Jewelers",
    slug: "elias-jewelers",
    sector: "retail",
    detail: "Luxury Jewellery",
    logo: "/clients/elias-jewelers.png",
  },
  {
    name: "CoffeePump Podcast",
    slug: "coffeepump-podcast",
    sector: "media",
    detail: "Podcast",
    logo: "/clients/coffeepump-podcast.png",
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
