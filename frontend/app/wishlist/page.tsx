"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import {
  readWishlist,
  subscribeToStore,
} from "@/lib/client-store";
import { getServiceById } from "@/lib/services";

export default function WishlistPage() {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    const syncWishlist = () => setSavedIds(readWishlist());
    syncWishlist();
    return subscribeToStore(syncWishlist);
  }, []);

  const savedServices = useMemo(
    () =>
      savedIds
        .map((id) => getServiceById(id))
        .filter((service) => service !== undefined),
    [savedIds],
  );

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
          Saved for later
        </p>
        <h1 className="mt-2 text-3xl font-bold text-blue-950">Your wishlist</h1>

        {savedServices.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-blue-950">
              No saved services yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tap the heart on a service to keep it here.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-full bg-blue-950 px-6 py-3 text-sm font-bold text-white hover:bg-blue-900"
            >
              Explore services
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
