import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { getFeaturedServices, type Service } from "@/lib/services";
import { loadServerServices } from "@/lib/server-services";

export default async function TopServices() {
  let featuredServices: Service[] = [];
  try {
    featuredServices = getFeaturedServices(await loadServerServices());
  } catch {
    // Keep the home page usable if the optional catalog API is unavailable.
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[2px] text-blue-700">
              Professional Cleaning
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
              Popular services
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Trusted doorstep care for your car, home and everyday spaces.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 transition hover:text-blue-700"
          >
            Explore all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredServices.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600" role="status">
            Popular services will appear here when the catalogue is available.
          </p>
        )}
      </div>
    </section>
  );
}
