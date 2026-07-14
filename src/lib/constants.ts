export const SITE = {
  name: "Akatsuki Studio",
  tagline: "Hospitality & automotive creative · Nairobi, Kenya",
  description:
    "Akatsuki Studio Kenya crafts cinematic campaigns for hospitality and automotive brands — film, photography, and digital experiences that fill rooms and move metal.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://akatsukistudio.co.ke",
  email: "akatsukistudioke@gmail.com",
  phone: "+254 700 000 000",
  address: "Westlands, Nairobi, Kenya",
  social: {
    instagram: "https://instagram.com/akatsukistudioke",
    youtube: "https://youtube.com/@akatsukistudio",
    linkedin: "https://linkedin.com/company/akatsukistudio",
    vimeo: "https://vimeo.com/akatsukistudio",
    behance: "https://behance.net/akatsukistudio",
  },
} as const;

export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/clients", label: "Clients" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
] as const;

export const STATS = [
  { value: 20_000_000, suffix: "+", label: "Organic Views Generated" },
  { value: 10_000, suffix: "+", label: "Creative Assets Delivered" },
  { value: 25, suffix: "+", label: "Brands Partnered With" },
  { value: 10, suffix: "+", label: "Industries Served" },
] as const;

export const PROCESS_STEPS = [
  { title: "Discover", description: "Immersion into guests, drivers, and what makes them choose you." },
  { title: "Strategy", description: "Demand-led direction — rooms filled, metal moved." },
  { title: "Concept", description: "Stories built for the stay and the drive." },
  { title: "Production", description: "On-property and on-road shoots with cinematic craft." },
  { title: "Post", description: "Grade, sound, and cutdowns for every booking channel." },
  { title: "Launch", description: "Rollout engineered for direct bookings and dealership traffic." },
] as const;
