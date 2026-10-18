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

async function requestAPI<T>(path: string): Promise<T> {
  const base = getAPIBase();
  if (!base) throw new Error("CleanKart API URL is not configured.");

  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CleanKart service request failed (${response.status}).`);
  }
  return (await response.json()) as T;
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
  if (!getAPIBase()) return mockServices.filter((service) => service.isActive);

  const payload = await requestAPI<Service[] | { results: Service[] }>("/api/services/");
  const list = Array.isArray(payload) ? payload : payload.results;
  if (!isServiceList(list)) {
    throw new Error("CleanKart returned an invalid service list.");
  }
  return list.filter((service) => service.isActive);
}

export async function loadServiceBySlug(slug: string): Promise<Service | undefined> {
  if (!getAPIBase()) return getServiceBySlug(slug);

  try {
    const service = await requestAPI<Service>(`/api/services/${encodeURIComponent(slug)}/`);
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
  const minimum = prices?.length
    ? Math.min(...prices)
    : service.minPrice ?? service.basePrice;
  const maximum = prices?.length
    ? Math.max(...prices)
    : service.maxPrice ?? service.basePrice;

  if (minimum === undefined || maximum === undefined) return "Price on request";
  return minimum === maximum
    ? formatPrice(minimum)
    : formatPrice(minimum) + " – " + formatPrice(maximum);
}

export function getServiceOriginalPrice(service: Service) {
  if (service.variants?.length) {
    if (service.variants.some((variant) => variant.originalPrice === undefined)) return undefined;
    const prices = service.variants.map((variant) => variant.originalPrice as number);
    const minimum = Math.min(...prices);
    const maximum = Math.max(...prices);
    return minimum === maximum
      ? formatPrice(minimum)
      : `${formatPrice(minimum)} – ${formatPrice(maximum)}`;
  }
  return service.originalPrice === undefined ? undefined : formatPrice(service.originalPrice);
}

export function getServiceSavings(service: Service) {
  const differences = service.variants?.length
    ? service.variants.map((variant) =>
        variant.originalPrice === undefined ? undefined : variant.originalPrice - variant.price,
      )
    : service.originalPrice === undefined
      ? []
      : [service.originalPrice - (service.basePrice ?? service.minPrice ?? 0)];

  if (!differences.length || differences.some((difference) => difference === undefined || difference <= 0)) {
    return undefined;
  }
  return differences.every((difference) => difference === differences[0])
    ? differences[0]
    : undefined;
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
