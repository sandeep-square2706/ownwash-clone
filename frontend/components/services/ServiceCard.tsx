"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Plus } from "lucide-react";

import {
  addToCart,
  readWishlist,
  subscribeToStore,
  toggleWishlist,
} from "@/lib/client-store";
import { getServicePrice, type Service } from "@/lib/services";

type ServiceCardProps = {
  service: Service;
  listView?: boolean;
};

export default function ServiceCard({
  service,
  listView = false,
}: ServiceCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const syncSavedState = () => setSaved(readWishlist().includes(service.id));
    syncSavedState();
    return subscribeToStore(syncSavedState);
  }, [service.id]);

  function handleWishlist() {
    setSaved(toggleWishlist(service.id).includes(service.id));
  }

  function handleAddToCart() {
    addToCart(service.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  const hasOptions = Boolean(service.variants?.length);

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
            ? "relative h-64 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-[320px]"
            : "relative aspect-[1.4/1] overflow-hidden bg-slate-100"
        }
      >
        <Link
          href={"/services/" + service.slug}
          aria-label={"View " + service.name}
        >
          <Image
            src={service.images[imageIndex]}
            alt={service.name + " cleaning service"}
            fill
            sizes={
              listView
                ? "(max-width: 640px) 100vw, 320px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-950 shadow-sm">
          {service.category}
        </span>

        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={saved}
          aria-label={
            (saved ? "Remove " : "Add ") +
            service.name +
            (saved ? " from" : " to") +
            " wishlist"
          }
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:text-rose-600"
        >
          <Heart
            className={
              saved
                ? "h-5 w-5 fill-rose-500 text-rose-500"
                : "h-5 w-5"
            }
          />
        </button>

        {service.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-blue-950/70 px-2.5 py-1.5">
            {service.images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setImageIndex(index)}
                aria-label={"Show photo " + (index + 1)}
                aria-pressed={imageIndex === index}
                className={
                  imageIndex === index
                    ? "h-2 w-2 rounded-full bg-blue-500"
                    : "h-2 w-2 rounded-full bg-white/70"
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className={listView ? "flex flex-1 flex-col p-5 sm:p-6" : "p-5"}>
        <div className="flex-1">
          <Link
            href={"/services/" + service.slug}
            className="hover:text-blue-800"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {service.name}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
            {service.description}
          </p>
          <p className="mt-4 text-xl font-bold text-blue-950">
            {getServicePrice(service)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {hasOptions
              ? "Price depends on the selected option"
              : "Doorstep service"}
          </p>
        </div>

        {hasOptions ? (
          <Link
            href={"/services/" + service.slug}
            className="mt-5 flex min-h-11 items-center justify-between rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <span>Select options</span>
            <Plus className="h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-5 flex min-h-11 items-center justify-between rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <span>{added ? "Added to cart" : "Add to cart"}</span>
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  );
}
