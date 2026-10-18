import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import { loadServerServices } from "@/lib/server-services";
import type { Service } from "@/lib/services";

const shortcutSlugs = [
  "house-cleaning",
  "foam-washing",
  "furniture-cleaning",
  "kitchen-cleaning",
  "carpet-cleaning",
];

export default async function TopServices() {
  let services: Service[] = [];
  try {
    services = await loadServerServices();
  } catch {
    // The page can still render without the optional service API.
  }

  const shortcuts = shortcutSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is Service => Boolean(service?.images?.[0]));

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeading eyebrow="Our top services" title="Book trusted home and car" accent="care" />
          <Link
            href="/services"
            className="mb-1 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--brand-blue)] transition hover:text-[var(--brand-navy)]"
          >
            View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {shortcuts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {shortcuts.map((service) => (
              <Link
                key={service.id}
                href={"/services/" + service.slug}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_5px_20px_rgba(16,44,95,0.045)] transition duration-200 hover:-translate-y-1 hover:border-[var(--brand-blue)]/40 hover:shadow-[0_12px_28px_rgba(16,44,95,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
              >
                <div className="relative aspect-[1.55] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <span className="flex min-h-11 items-center justify-center gap-2 px-2 text-center text-sm font-semibold text-slate-900">
                  {service.slug === "foam-washing" ? "Car Washing" : service.name}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600" role="status">
            Service shortcuts will appear when the catalogue is available.
          </p>
        )}
      </div>
    </section>
  );
}
