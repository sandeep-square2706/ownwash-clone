"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { addToCart } from "@/lib/client-store";
import { formatPrice, type Service } from "@/lib/services";

export default function BookingPanel({ service }: { service: Service }) {
  const [variantId, setVariantId] = useState(service.variants?.[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const selectedVariant = service.variants?.find(
    (variant) => variant.id === variantId,
  );
  const price = selectedVariant?.price ?? service.basePrice ?? service.minPrice ?? 0;

  function handleAdd() {
    addToCart(service.id, selectedVariant?.id);
    setAdded(true);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-blue-950">Choose your service</p>
      {service.variants?.length ? (
        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-slate-600">
            Select size or vehicle
          </span>
          <select
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
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

      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">Service price</span>
        <span className="text-2xl font-bold text-blue-950">
          {formatPrice(price)}
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        <ShoppingCart className="h-4 w-4" />
        {added ? "Added to cart" : "Add to cart"}
      </button>
      {added && (
        <p className="mt-3 text-center text-sm text-emerald-700" role="status">
          Added.{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-2">
            View your cart
          </Link>
        </p>
      )}
    </div>
  );
}
