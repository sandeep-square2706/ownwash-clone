"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Percent } from "lucide-react";

type HomeOffer = {
  id: number;
  name: string;
  description: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: string | number;
  minimum_order?: string | number;
};

const API_URL = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

function isHomeOffer(value: unknown): value is HomeOffer {
  if (!value || typeof value !== "object") return false;
  const offer = value as Partial<HomeOffer>;
  return (
    typeof offer.id === "number" &&
    typeof offer.name === "string" &&
    typeof offer.code === "string" &&
    (offer.type === "PERCENTAGE" || offer.type === "FIXED_AMOUNT") &&
    (typeof offer.value === "number" || typeof offer.value === "string") &&
    (offer.minimum_order === undefined ||
      typeof offer.minimum_order === "number" ||
      typeof offer.minimum_order === "string")
  );
}

function discountLabel(offer: HomeOffer) {
  const value = Number(offer.value);
  return offer.type === "PERCENTAGE" ? `${value}% off` : `₹${value} off`;
}

export default function FirstOrderOfferBanner() {
  const [offers, setOffers] = useState<HomeOffer[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/offers/`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Offers request failed (${response.status}).`);
        return response.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || !data.every(isHomeOffer)) {
          throw new Error("The offers endpoint returned an invalid response.");
        }
        if (active) setOffers(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => { active = false; };
  }, []);

  const banners: (HomeOffer | null)[] = [null, ...offers];

  return (
    <section aria-label="Current offers" className="bg-white px-4 pb-2 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-3">
        {banners.map((offer) => (
          <div
            key={offer?.id ?? "first-order-offer"}
            className="flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#092451] via-[#114b98] to-[#1477f8] px-5 py-5 text-white shadow-lg sm:flex-row sm:items-center sm:px-8 sm:py-6"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gold)] text-[var(--brand-navy)]">
                <Percent className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                  {offer ? "Limited-time offer" : "New customer offer"}
                </p>
                <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                  {offer ? `${offer.name} · ${discountLabel(offer)}` : "Get 50% off your first booking"}
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  {offer
                    ? `${offer.description ? `${offer.description} ` : ""}${Number(offer.minimum_order) > 0 ? `On orders of ₹${Number(offer.minimum_order).toLocaleString("en-IN")} or more. ` : ""}Use code ${offer.code} at checkout.`
                    : "Automatically applied to your service subtotal at checkout."}
                </p>
              </div>
            </div>
            <Link
              href="/services"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ))}
        {loadError ? (
          <p className="text-center text-xs text-slate-500" role="status">
            Additional promotions could not be loaded right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}
