"use client";

export type CartItem = {
  serviceId: number;
  variantId?: string;
  addonIds?: string[];
  quantity: number;
};

const CART_KEY = "cleankart:cart:v1";
const WISHLIST_KEY = "cleankart:wishlist:v1";
const STORE_EVENT = "cleankart:store-change";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function readCart(): CartItem[] {
  const items = readJSON<unknown>(CART_KEY, []);
  return Array.isArray(items)
    ? items.flatMap((item): CartItem[] => {
        if (
          !item ||
          typeof item !== "object" ||
          typeof (item as Record<string, unknown>).serviceId !== "number" ||
          !Number.isFinite((item as Record<string, unknown>).serviceId) ||
          typeof (item as Record<string, unknown>).quantity !== "number" ||
          !Number.isFinite((item as Record<string, unknown>).quantity)
        ) {
          return [];
        }
        const record = item as Record<string, unknown>;
        const variantId = typeof record.variantId === "string" ? record.variantId : undefined;
        const rawAddonIds = record.addonIds;
        const addonIds: string[] = Array.isArray(rawAddonIds)
          ? rawAddonIds.filter((id: unknown): id is string => typeof id === "string")
          : [];
        return [{
          serviceId: record.serviceId as number,
          variantId,
          addonIds: [...new Set(addonIds)],
          quantity: Math.min(99, Math.max(1, Math.floor(record.quantity as number))),
        }];
      })
    : [];
}

export function readWishlist(): number[] {
  const items = readJSON<unknown>(WISHLIST_KEY, []);
  return Array.isArray(items)
    ? items.filter((item): item is number => typeof item === "number")
    : [];
}

export function addToCart(
  serviceId: number,
  variantId?: string,
  addonIds: string[] = [],
  quantity = 1,
) {
  const items = readCart();
  const normalizedAddons = [...new Set(addonIds)].sort();
  const matchingItem = items.find(
    (item) =>
      item.serviceId === serviceId &&
      item.variantId === variantId &&
      JSON.stringify([...(item.addonIds ?? [])].sort()) === JSON.stringify(normalizedAddons),
  );
  if (matchingItem) matchingItem.quantity = Math.min(99, matchingItem.quantity + quantity);
  else items.push({ serviceId, variantId, addonIds: normalizedAddons, quantity: Math.min(99, Math.max(1, quantity)) });
  writeJSON(CART_KEY, items);
  return items;
}

export function updateCartQuantity(
  serviceId: number,
  variantId: string | undefined,
  quantity: number,
  addonIds: string[] = [],
) {
  const normalizedAddons = [...new Set(addonIds)].sort();
  const items = readCart().map((item) =>
    item.serviceId === serviceId &&
    item.variantId === variantId &&
    JSON.stringify([...(item.addonIds ?? [])].sort()) === JSON.stringify(normalizedAddons)
      ? { ...item, quantity: Math.min(99, Math.max(1, Math.floor(quantity))) }
      : item,
  );
  writeJSON(CART_KEY, items);
  return items;
}

export function removeFromCart(
  serviceId: number,
  variantId?: string,
  addonIds: string[] = [],
) {
  const normalizedAddons = [...new Set(addonIds)].sort();
  const items = readCart().filter(
    (item) =>
      item.serviceId !== serviceId ||
      item.variantId !== variantId ||
      JSON.stringify([...(item.addonIds ?? [])].sort()) !== JSON.stringify(normalizedAddons),
  );
  writeJSON(CART_KEY, items);
  return items;
}

export function toggleWishlist(serviceId: number) {
  const items = readWishlist();
  const updated = items.includes(serviceId)
    ? items.filter((item) => item !== serviceId)
    : [...items, serviceId];
  writeJSON(WISHLIST_KEY, updated);
  return updated;
}

export function subscribeToStore(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(STORE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(STORE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
