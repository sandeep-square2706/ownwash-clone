import type { NextConfig } from "next";

const partnerPortalOrigin =
  process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL?.trim().replace(/\/+$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3002" : "");

const nextConfig: NextConfig = {
  async redirects() {
    if (!partnerPortalOrigin) return [];

    return [
      {
        source: "/partner",
        destination: `${partnerPortalOrigin}/partner`,
        permanent: false,
      },
      {
        source: "/partner/:path*",
        destination: `${partnerPortalOrigin}/partner/:path*`,
        permanent: false,
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
