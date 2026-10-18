"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

import { addToCart, readWishlist, subscribeToStore, toggleWishlist } from "@/lib/client-store";
import { formatPrice, getAddonTotal, type Service } from "@/lib/services";

export default function BookingPanel({ service }: { service: Service }) {
  const [variantId, setVariantId] = useState(service.variants?.[0]?.id ?? "");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const selectedVariant = service.variants?.find((variant) => variant.id === variantId);
  const basePrice = selectedVariant?.price ?? service.basePrice ?? service.minPrice ?? 0;
  const originalBasePrice = selectedVariant?.originalPrice ?? service.originalPrice;
  const unitPrice = basePrice + getAddonTotal(service, selectedAddonIds);
  const lineTotal = unitPrice * quantity;
  const originalLineTotal = (originalBasePrice ?? basePrice) * quantity + getAddonTotal(service, selectedAddonIds) * quantity;

  useEffect(() => {
    const syncSavedState = () => setSaved(readWishlist().includes(service.id));
    syncSavedState();
    return subscribeToStore(syncSavedState);
  }, [service.id]);

  function handleAdd() {
    addToCart(service.id, selectedVariant?.id, selectedAddonIds, quantity);
    setAdded(true);
  }

  function toggleAddon(addonId: string) {
    setSelectedAddonIds((selected) =>
      selected.includes(addonId)
        ? selected.filter((id) => id !== addonId)
        : [...selected, addonId],
    );
    setAdded(false);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-950">Choose your service</p>
          <p className="mt-1 text-xs text-slate-500">Preview pricing · no booking is created</p>
        </div>
        <button
          type="button"
          onClick={() => setSaved(toggleWishlist(service.id).includes(service.id))}
          aria-pressed={saved}
          aria-label={`${saved ? "Remove" : "Add"} ${service.name} ${saved ? "from" : "to"} wishlist`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Heart className={saved ? "h-5 w-5 fill-rose-500 text-rose-500" : "h-5 w-5"} aria-hidden="true" />
        </button>
      </div>

      {service.variants?.length ? (
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-slate-600">Select size or vehicle</span>
          <select
            value={variantId}
            onChange={(event) => {
              setVariantId(event.target.value);
              setAdded(false);
            }}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {service.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} · {formatPrice(variant.price)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          Doorstep service, scheduled at a time that works for you.
        </p>
      )}

      {service.addons?.length ? (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-blue-950">Optional add-ons</legend>
          <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200 px-3">
            {service.addons.map((addon) => (
              <label key={addon.id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAddonIds.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="min-w-0 flex-1 text-slate-700">{addon.name}</span>
                <span className="shrink-0 font-semibold text-blue-950">+{formatPrice(addon.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">Quantity</span>
        <div className="flex h-10 items-center rounded-full border border-slate-200">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            aria-label={`Reduce ${service.name} quantity`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-blue-950 hover:bg-blue-50"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold text-blue-950" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            aria-label={`Increase ${service.name} quantity`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-blue-950 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">Preview total</span>
        <span className="text-right">
          <span className="block text-2xl font-bold text-blue-950">{formatPrice(lineTotal)}</span>
          {originalLineTotal > lineTotal ? (
            <span className="mt-1 block text-xs text-slate-500">
              <del>{formatPrice(originalLineTotal)}</del>
              <span className="ml-2 font-semibold text-cyan-800">
                Save {formatPrice(originalLineTotal - lineTotal)}
              </span>
            </span>
          ) : null}
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        Add to cart
      </button>
      {added && (
        <div className="mt-3 rounded-xl bg-blue-50 px-3 py-3 text-center text-sm text-[var(--brand-navy)]" role="status">
          Added to this browser’s preview cart. Your selection is not a confirmed booking.
          <Link href="/cart" className="ml-1 font-semibold underline underline-offset-2">
            View cart
          </Link>
        </div>
      )}
      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        Final price and availability will be checked by the booking service when connected.
      </p>
    </div>
  );
}
