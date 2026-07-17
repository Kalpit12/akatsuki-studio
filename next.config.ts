import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/work",
        destination: "/",
        permanent: true,
      },
      {
        source: "/work/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/clients",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/clients/:slug",
        destination: "/portfolio/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "cdn.coverr.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
