"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import {
  readCart,
  removeFromCart,
  subscribeToStore,
  updateCartQuantity,
  type CartItem,
} from "@/lib/client-store";
import { formatPrice, getServiceById } from "@/lib/services";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeToStore(syncCart);
  }, []);

  const rows = useMemo(
    () =>
      items.flatMap((item) => {
        const service = getServiceById(item.serviceId);
        if (!service) return [];
        const variant = service.variants?.find(
          (option) => option.id === item.variantId,
        );
        const unitPrice =
          variant?.price ?? service.basePrice ?? service.minPrice ?? 0;
        return [{ item, service, variant, unitPrice }];
      }),
    [items],
  );
  const subtotal = rows.reduce(
    (total, row) => total + row.unitPrice * row.item.quantity,
    0,
  );

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Your selection
            </p>
            <h1 className="mt-2 text-3xl font-bold text-blue-950">Your cart</h1>
          </div>
          <Link
            href="/services"
            className="hidden text-sm font-semibold text-blue-900 hover:text-blue-700 sm:block"
          >
            Continue browsing
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-900">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-blue-950">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore the service catalogue and choose what you need.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {rows.map(({ item, service, variant, unitPrice }) => (
                <article
                  key={service.id + "-" + (item.variantId ?? "base")}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-36">
                    <Image
                      src={service.images[0]}
                      alt={service.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={"/services/" + service.slug}
                      className="font-semibold text-blue-950 hover:text-blue-700"
                    >
                      {service.name}
                    </Link>
                    {variant && (
                      <p className="mt-1 text-sm text-slate-500">{variant.name}</p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-blue-900">
                      {formatPrice(unitPrice)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex h-10 items-center rounded-full border border-slate-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            service.id,
                            item.variantId,
                            item.quantity - 1,
                          )
                        }
                        aria-label={"Reduce quantity of " + service.name}
                        className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-blue-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            service.id,
                            item.variantId,
                            item.quantity + 1,
                          )
                        }
                        aria-label={"Increase quantity of " + service.name}
                        className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-blue-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="min-w-20 text-right text-sm font-bold text-blue-950">
                      {formatPrice(unitPrice * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setItems(removeFromCart(service.id, item.variantId))
                      }
                      aria-label={"Remove " + service.name + " from cart"}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-600">
                <span>Doorstep visit</span>
                <span className="font-medium text-emerald-700">Included</span>
              </div>
              <div className="my-5 border-t border-slate-100" />
              <div className="flex justify-between font-bold text-blue-950">
                <span>Estimated total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Continue to booking
              </Link>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Final service options and availability are confirmed during booking.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
