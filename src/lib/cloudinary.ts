/**
 * Demo media library — Pexels + Coverr CDN assets for cinematic agency demos.
 * Swap for Cloudinary uploads in production.
 */

const pxImg = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const pxVid = (id: number, file: string) =>
  `https://videos.pexels.com/video-files/${id}/${file}`;

const coverr = (slug: string) =>
  `https://cdn.coverr.co/videos/${slug}/1080p.mp4`;

/** Cloudinary helpers kept for production swap-in */
export function cldVideo(
  publicId: string,
  opts: { width?: number; quality?: string } = {},
) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const { width = 1920, quality = "auto" } = opts;
  return `https://res.cloudinary.com/${cloud}/video/upload/q_${quality},w_${width},c_fill,f_auto/${publicId}.mp4`;
}

export function cldImage(
  publicId: string,
  opts: { width?: number; quality?: string } = {},
) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";
  const { width = 1600, quality = "auto" } = opts;
  return `https://res.cloudinary.com/${cloud}/image/upload/q_${quality},w_${width},c_fill,f_auto/${publicId}.jpg`;
}

export const MEDIA = {
  /** Hero — Vishh254 bike chase */
  hero: "/Personal Vids/chase-scene.mp4",
  heroPoster: "/Personal Vids/chase-scene.jpg",

  /** About studio — homepage who-we-are (Huawei Product Launch Africa) */
  about: "/huawei-about.mp4",
  aboutPoster: "/huawei-about.jpg",

  /** About page — physical studio / the floor */
  studioTour: "/the-floor.mp4",
  studioTourPoster: pxImg(2034335),

  /** Contact / CTA — Kyra Platinum Imports (client still) */
  contactImage: "/Kyra/kyra-still-01.jpg",

  /** Footer atmosphere */
  footer: pxVid(1409899, "1409899-uhd_2560_1440_25fps.mp4"),
  footerPoster: pxImg(189296),

  /** Horizontal reel cuts — local compressed studio productions */
  reel: [
    {
      video: "/Connect Coffee/connect-coffee-tour.mp4",
      poster: "/Connect Coffee/connect-coffee-tour.jpg",
      label: "Connect Coffee",
    },
    {
      video: pxVid(3571264, "3571264-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(258154, 1280),
      label: "Lifestyle Light",
    },
    {
      video: "/Autobox/autobox-x6.mp4",
      poster: "/Autobox/autobox-x6.jpg",
      label: "Autobox",
    },
    {
      video: "/11 Motors/11-motors-gle53.mp4",
      poster: "/11 Motors/11-motors-gle53.jpg",
      label: "11 Motors",
    },
    {
      video: "/BTS Vids/bts-suction.mp4",
      poster: "/BTS Vids/bts-suction.jpg",
      label: "BTS",
    },
    {
      video: pxVid(5752729, "5752729-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(2034335, 1280),
      label: "Lobby Hour",
    },
  ],

  services: {
    campaigns: {
      video: coverr("coverr-man-working-on-a-laptop-in-an-office-5625"),
      poster: pxImg(271624),
    },
    automotive: {
      video: coverr("coverr-drone-shot-of-a-highway-at-sunset-5633"),
      poster: pxImg(1545743),
    },
    events: {
      video: pxVid(5752729, "5752729-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(2034335),
    },
    seo: {
      video: coverr("coverr-man-working-on-a-laptop-in-an-office-5625"),
      poster: pxImg(3802510),
    },
    social: {
      video: coverr("coverr-woman-posing-for-a-photoshoot-5638"),
      poster: pxImg(258154),
    },
    cinematic: {
      video: pxVid(3571264, "3571264-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(189296),
    },
    websites: {
      video: pxVid(3195394, "3195394-uhd_2560_1440_25fps.mp4"),
      poster: pxImg(1402787),
    },
  },

  /** Studio / on-location atmosphere */
  studio: [
    pxImg(2034335, 1400),
    pxImg(258154, 1400),
    pxImg(1545743, 1400),
    pxImg(271624, 1400),
    pxImg(3802510, 1400),
    pxImg(1267320, 1400),
  ],

  /** Team portraits */
  team: [
    pxImg(2379004, 800),
    pxImg(2182970, 800),
    pxImg(1239291, 800),
    pxImg(1516680, 800),
  ],

  /** Project covers */
  projects: {
    elias: {
      video: "/elias-jewellery-campaign.mp4",
      poster: "/elias-jewellery-campaign.jpg",
      gallery: [
        "/elias-jewellery-campaign.jpg",
        pxImg(1454171),
        pxImg(1191531),
        pxImg(6044266),
      ],
    },
    resort: {
      video: pxVid(3571264, "3571264-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(258154),
      gallery: [pxImg(258154), pxImg(271624), pxImg(2034335), pxImg(189296)],
    },
    automotive: {
      video: coverr("coverr-drone-shot-of-a-highway-at-sunset-5633"),
      poster: pxImg(1545743),
      gallery: [pxImg(1545743), pxImg(1402787), pxImg(3802510), pxImg(112460)],
    },
    lodge: {
      video: coverr("coverr-slow-motion-of-a-chef-cooking-5584"),
      poster: pxImg(2096983),
      gallery: [pxImg(2096983), pxImg(1267320), pxImg(261102), pxImg(941861)],
    },
    motors: {
      video: pxVid(2169880, "2169880-uhd_2560_1440_30fps.mp4"),
      poster: pxImg(3802510),
      gallery: [pxImg(3802510), pxImg(244206), pxImg(210019), pxImg(2365572)],
    },
  },
} as const;
