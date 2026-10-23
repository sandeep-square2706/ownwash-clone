"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ServiceImageCarousel from "@/components/services/ServiceImageCarousel";
import {
  readWishlist,
  subscribeToStore,
  toggleWishlist,
} from "@/lib/client-store";
import {
  getServiceOriginalPrice,
  getServicePrice,
  type Service,
} from "@/lib/services";

type ServiceCardProps = {
  service: Service;
  listView?: boolean;
};

export default function ServiceCard({
  service,
  listView = false,
}: ServiceCardProps) {
  const [saved, setSaved] = useState(false);

  const detailHref = `/services/${service.slug}`;
  const originalPrice = getServiceOriginalPrice(service);

  useEffect(() => {
    const syncSavedState = () =>
      setSaved(readWishlist().includes(service.id));

    syncSavedState();

    const unsubscribe = subscribeToStore(syncSavedState);

    return unsubscribe;
  }, [service.id]);

  return (
    <article
      className={
        listView
          ? "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg sm:flex-row"
          : "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      }
    >
      <div
        className={
          listView
            ? "relative h-64 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-[320px]"
            : "relative aspect-[1.4/1] bg-slate-100"
        }
      >
        <ServiceImageCarousel
          images={service.images}
          title={service.name}
          href={detailHref}
          sizes={
            listView
              ? "(max-width: 640px) 100vw, 320px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="h-full w-full"
        />

        <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-950 shadow-sm">
          {service.category}
        </span>

        <button
          type="button"
          onClick={() =>
            setSaved(toggleWishlist(service.id).includes(service.id))
          }
          aria-pressed={saved}
          aria-label={`${saved ? "Remove" : "Add"} ${service.name} ${
            saved ? "from" : "to"
          } wishlist`}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Heart
            aria-hidden="true"
            className={
              saved
                ? "h-5 w-5 fill-rose-500 text-rose-500"
                : "h-5 w-5"
            }
          />
        </button>
      </div>

      <div
        className={
          listView
            ? "flex flex-1 flex-col p-5 sm:p-6"
            : "p-5"
        }
      >
        <div className="flex-1">
          <Link
            href={detailHref}
            className="hover:text-blue-800 focus-visible:outline-blue-600"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {service.name}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
            {service.description}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-bold text-blue-950">
              {getServicePrice(service)}
            </p>

            {originalPrice && (
              <del className="text-sm text-slate-400">
                {originalPrice}
              </del>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Select your service options to continue
          </p>
        </div>

        <Link
          href={detailHref}
          className="mt-5 flex min-h-11 items-center justify-between rounded-full bg-[var(--brand-gold)] px-5 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
        >
          <span>Select options</span>

          <Plus
            className="h-4 w-4"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}