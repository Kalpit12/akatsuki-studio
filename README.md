# Akatsuki Studio Kenya

A world-class, cinematic creative agency website built with Next.js 15, React 19, GSAP, Lenis, Framer Motion, and React Three Fiber.

## Location

`D:\akatsuki-studio`

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Motion:** GSAP + ScrollTrigger, Lenis, Framer Motion
- **3D:** React Three Fiber + Drei
- **CMS:** Sanity (optional — falls back to local data)
- **Media:** Cloudinary

## Getting Started

```bash
cd D:\akatsuki-studio
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:2001](http://localhost:2001)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Cinematic home with hero, work, reel, services, process, team |
| `/work` | Portfolio grid with video hover previews |
| `/work/[slug]` | Individual case study |
| `/services` | Service capabilities |
| `/about` | Studio story, process, team |
| `/clients` | Client logos, testimonials, awards |
| `/journal` | Insights & articles |
| `/contact` | Premium contact form |

## CMS Setup (Sanity)

1. Create a project at [sanity.io/manage](https://sanity.io/manage)
2. Add credentials to `.env.local`
3. Run `npx sanity dev` from the `sanity/` folder

## Cloudinary

Replace demo asset IDs in `src/lib/cloudinary.ts` with your uploaded media IDs.

## Deploy

Optimized for Vercel:

```bash
npm run build
```

## Design Inspiration

Locomotive, Active Theory, Basic Agency, Resn, Dogstudio, Stink Studios, Buck, Instrument.
