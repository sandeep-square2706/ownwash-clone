import type { MetadataRoute } from "next";

import { mockServices } from "@/lib/services";
import { getSiteUrl } from "@/lib/site-url";
import { loadServerServices } from "@/lib/server-services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  let services = mockServices;
  try {
    services = await loadServerServices();
  } catch {
    // Keep the static service URLs available while the optional API is offline.
  }

  const routes = [
    "/",
    "/services",
    "/about",
    "/reviews",
    "/faq",
    "/contact",
    "/franchise",
    "/partner",
    ...services.filter((service) => service.isActive).map((service) => `/services/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/services" ? 0.9 : 0.6,
  }));
}
