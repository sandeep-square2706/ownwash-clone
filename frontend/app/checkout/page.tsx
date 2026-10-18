"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { readCart, subscribeToStore, type CartItem } from "@/lib/client-store";
import { formatPrice, getServiceById } from "@/lib/services";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

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
  const total = rows.reduce(
    (sum, row) => sum + row.unitPrice * row.item.quantity,
    0,
  );

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
          Almost there
        </p>
        <h1 className="mt-2 text-3xl font-bold text-blue-950">Book a service</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review your selection and choose a preferred visit time.
        </p>

        {rows.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-blue-950">Your cart is empty</h2>
            <p className="mt-2 text-sm text-slate-600">
              Add a service before starting a booking.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex rounded-full bg-blue-950 px-6 py-3 text-sm font-bold text-white hover:bg-blue-900"
            >
              Browse services
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <form
              className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <h2 className="text-lg font-bold text-blue-950">Visit details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tell us where and when you would prefer the service.
                </p>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  required
                  autoComplete="name"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="Your name"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Phone number
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    pattern="[0-9+() -]{8,18}"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="Your phone number"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred date
                  <input
                    required
                    type="date"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Visit address
                <textarea
                  required
                  rows={3}
                  autoComplete="street-address"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="House or flat, street, area and city"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Preferred time
                <select
                  required
                  defaultValue=""
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="" disabled>
                    Choose a time slot
                  </option>
                  <option>9:00 AM – 12:00 PM</option>
                  <option>12:00 PM – 3:00 PM</option>
                  <option>3:00 PM – 6:00 PM</option>
                </select>
              </label>

              <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                Frontend preview only. This form does not send or save your details,
                create a real booking, or process payment.
              </p>
              <button
                type="submit"
                className="min-h-12 w-full rounded-full bg-blue-950 px-5 text-sm font-bold text-white transition hover:bg-blue-900"
              >
                Preview booking request
              </button>
              {submitted && (
                <p className="text-sm font-medium text-emerald-700" role="status">
                  Preview complete. No booking was sent or created.
                </p>
              )}
            </form>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950">Your services</h2>
              <div className="mt-4 space-y-4">
                {rows.map(({ item, service, variant, unitPrice }) => (
                  <div key={service.id + "-" + (item.variantId ?? "base")} className="flex gap-3">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={service.images[0]} alt={service.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-blue-950">{service.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {variant ? variant.name + " · " : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-blue-950">
                      {formatPrice(unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="my-5 border-t border-slate-100" />
              <div className="flex justify-between font-bold text-blue-950">
                <span>Estimated total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Service availability and final details are confirmed by the provider.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
