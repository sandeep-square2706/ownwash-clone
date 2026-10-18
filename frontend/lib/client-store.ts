"use client";

export type CartItem = {
  serviceId: number;
  variantId?: string;
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
    ? items.filter(
        (item): item is CartItem =>
          typeof item?.serviceId === "number" &&
          typeof item?.quantity === "number",
      )
    : [];
}

export function readWishlist(): number[] {
  const items = readJSON<unknown>(WISHLIST_KEY, []);
  return Array.isArray(items)
    ? items.filter((item): item is number => typeof item === "number")
    : [];
}

export function addToCart(serviceId: number, variantId?: string) {
  const items = readCart();
  const matchingItem = items.find(
    (item) => item.serviceId === serviceId && item.variantId === variantId,
  );
  if (matchingItem) matchingItem.quantity += 1;
  else items.push({ serviceId, variantId, quantity: 1 });
  writeJSON(CART_KEY, items);
  return items;
}

export function updateCartQuantity(
  serviceId: number,
  variantId: string | undefined,
  quantity: number,
) {
  const items = readCart().map((item) =>
    item.serviceId === serviceId && item.variantId === variantId
      ? { ...item, quantity: Math.max(1, quantity) }
      : item,
  );
  writeJSON(CART_KEY, items);
  return items;
}

export function removeFromCart(serviceId: number, variantId?: string) {
  const items = readCart().filter(
    (item) => item.serviceId !== serviceId || item.variantId !== variantId,
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
