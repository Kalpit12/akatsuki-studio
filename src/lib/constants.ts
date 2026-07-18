export const SITE = {
  name: "Akatsuki Studio",
  tagline: "Creative studio · Nairobi, Kenya",
  description:
    "Akatsuki Studio Kenya crafts cinematic campaigns for brands of every kind — film, photography, and digital experiences that build attention, trust, and identity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://akatsukistudio.co.ke",
  email: "akatsukistudioke@gmail.com",
  phone: "+254 700 000 000",
  social: {
    instagram: "https://instagram.com/akatsukistudioke",
    youtube: "https://youtube.com/@akatsukistudio",
    linkedin: "https://linkedin.com/company/akatsukistudio",
    vimeo: "https://vimeo.com/akatsukistudio",
    behance: "https://behance.net/akatsukistudio",
  },
} as const;

export const PORTFOLIO_PATH = "/portfolio" as const;

export const NAV_LINKS = [
  { href: "/#work", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: PORTFOLIO_PATH, label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

export const STATS = [
  { value: 20_000_000, suffix: "+", label: "Organic Views Generated" },
  { value: 10_000, suffix: "+", label: "Creative Assets Delivered" },
  { value: 25, suffix: "+", label: "Brands Partnered With" },
  { value: 10, suffix: "+", label: "Industries Served" },
] as const;

export const PROCESS_STEPS = [
  { title: "Audit", description: "We identify what's working, what's missing, and where the opportunity lies." },
  { title: "Position", description: "Craft a creative direction your audience instantly understands." },
  { title: "Produce", description: "Premium visual content that elevates perception." },
  { title: "Amplify", description: "Launch across the right platforms with the right messaging." },
  { title: "Optimize", description: "Measure performance and continuously improve." },
  { title: "Repeat", description: "Build a consistent content engine instead of one-off campaigns." },
] as const;
