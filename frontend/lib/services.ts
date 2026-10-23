import {
  getServiceById,
  getServiceBySlug,
  mockServices,
  topServiceSlugs,
  type Service,
} from "@/lib/mock-services";
import { mockCheckoutSettings } from "@/lib/mock-checkout";

export type { Service, ServiceAddon, ServiceFAQ, ServiceVariant } from "@/lib/mock-services";
export { getServiceById, getServiceBySlug, mockServices, topServiceSlugs };

// Kept for local cart and wishlist previews. Network-backed pages use loadServices.
export const services = mockServices;

function getAPIBase() {
  return process.env.NEXT_PUBLIC_CLEANKART_API_URL?.replace(/\/+$/, "");
}

async function requestAPIAt<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CleanKart service request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

async function requestAPI<T>(path: string): Promise<T> {
  const base = getAPIBase();
  if (!base) throw new Error("CleanKart API URL is not configured.");
  return requestAPIAt<T>(`${base}${path}`);
}

function isServiceList(value: unknown): value is Service[] {
  if (!Array.isArray(value)) return false;
  return value.every((item: unknown) => {
    if (!item || typeof item !== "object") return false;
    const service = item as Partial<Service>;
    return (
      typeof service.id === "number" &&
      typeof service.name === "string" &&
      typeof service.slug === "string" &&
      typeof service.category === "string" &&
      Array.isArray(service.images) &&
      Array.isArray(service.features)
    );
  });
}

export async function loadServices(): Promise<Service[]> {
  const base = getAPIBase();
  if (!base) return mockServices.filter((service) => service.isActive);

  const apiOrigin = new URL(base).origin;
  let nextUrl: string | null = `${base}/services/`;
  const visitedPages = new Set<string>();
  const services: Service[] = [];

  while (nextUrl) {
    const pageUrl: string = new URL(nextUrl, `${base}/`).toString();
    if (new URL(pageUrl).origin !== apiOrigin) {
      throw new Error("CleanKart returned a service page outside the configured API host.");
    }
    if (visitedPages.has(pageUrl)) {
      throw new Error("CleanKart returned a repeated service page link.");
    }
    visitedPages.add(pageUrl);

    const payload = await requestAPIAt<
      Service[] | { results: Service[]; next?: string | null }
    >(pageUrl);
    if (Array.isArray(payload)) {
      if (!isServiceList(payload)) throw new Error("CleanKart returned an invalid service list.");
      services.push(...payload);
      nextUrl = null;
      continue;
    }

    if (!payload || !isServiceList(payload.results)) {
      throw new Error("CleanKart returned an invalid service list.");
    }
    services.push(...payload.results);

    if (payload.next === undefined || payload.next === null || payload.next === "") {
      nextUrl = null;
    } else if (typeof payload.next === "string") {
      nextUrl = new URL(payload.next, pageUrl).toString();
    } else {
      throw new Error("CleanKart returned an invalid service page link.");
    }
  }

  return services.filter((service) => service.isActive);
}

export async function loadServiceBySlug(slug: string): Promise<Service | undefined> {
  if (!getAPIBase()) return getServiceBySlug(slug);

  try {
    const service = await requestAPI<Service>(`/services/${encodeURIComponent(slug)}/`);
    if (
      typeof service?.id !== "number" ||
      service.slug !== slug ||
      typeof service.name !== "string"
    ) {
      throw new Error("CleanKart returned an invalid service record.");
    }
    return service.isActive ? service : undefined;
  } catch (error) {
    if (error instanceof Error && error.message.includes("(404)")) return undefined;
    throw error;
  }
}

export function getFeaturedServices(serviceList: Service[] = mockServices) {
  const bySlug = new Map(serviceList.map((service) => [service.slug, service]));
  return topServiceSlugs
    .map((slug) => bySlug.get(slug))
    .filter((service): service is Service => Boolean(service?.isActive));
}

export function formatPrice(price: number) {
  return "₹" + price.toLocaleString("en-IN");
}

export function getServicePrice(service: Service) {
  const prices = service.variants?.map((variant) => variant.price);
  const startingPrice = prices?.length
    ? Math.min(...prices)
    : service.minPrice ?? service.basePrice;

  if (startingPrice === undefined) return "Price on request";
  return formatPrice(startingPrice);
}

export function getServiceOriginalPrice(service: Service) {
  if (service.variants?.length) {
    const lowestPricedVariant = service.variants.reduce((lowest, variant) =>
      variant.price < lowest.price ? variant : lowest,
    );
    return lowestPricedVariant.originalPrice === undefined
      ? undefined
      : formatPrice(lowestPricedVariant.originalPrice);
  }
  return service.originalPrice === undefined ? undefined : formatPrice(service.originalPrice);
}

export function getAddonTotal(service: Service, addonIds: string[] = []) {
  const selected = new Set(addonIds);
  return (service.addons ?? []).reduce(
    (total, addon) => total + (selected.has(addon.id) ? addon.price : 0),
    0,
  );
}

export function getStartingPrice(serviceList: Service[]) {
  const prices = serviceList.flatMap((service) => {
    const variantPrices = service.variants?.map((variant) => variant.price);
    return variantPrices?.length
      ? variantPrices
      : [service.basePrice ?? service.minPrice].filter((price): price is number => price !== undefined);
  });
  return prices.length ? Math.min(...prices) : undefined;
}

export function getPreviewConvenienceFee() {
  return mockCheckoutSettings.convenienceFee;
}
