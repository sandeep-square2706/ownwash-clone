import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { getServicePrice, type Service } from "@/lib/services";
import { loadServerServices } from "@/lib/server-services";

const featuredPlans = [
  {
    slug: "foam-washing",
    subtitle: "A quick refresh for your vehicle",
  },
  {
    slug: "interior-deep-cleaning",
    subtitle: "A detailed cabin clean",
  },
  {
    slug: "sofa-dry-cleaning",
    subtitle: "Fabric care for your living space",
  },
];

export default async function Pricing() {
  let services: Service[] = [];
  try {
    services = await loadServerServices();
  } catch {
    // The catalog section below explains the empty state if the API is down.
  }

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-blue-700">
            Clear starting prices
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
            Choose the care you need
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            See service options and pricing before you add anything to your cart.
          </p>
        </div>

        {services.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredPlans.map((plan) => {
              const service = services.find((item) => item.slug === plan.slug);
              if (!service) return null;
              return (
              <article
                key={service.id}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7"
              >
                <p className="text-sm font-semibold text-blue-700">{service.category}</p>
                <h3 className="mt-2 text-2xl font-bold text-blue-950">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{plan.subtitle}</p>
                <p className="mt-6 text-3xl font-black text-blue-950">
                  {getServicePrice(service)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {service.variants?.length ? "Choose an option to confirm price" : "Fixed service price"}
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-700"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={"/services/" + service.slug}
                  className="mt-7 flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  View service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600" role="status">
            Pricing will be available when the service catalogue is connected.
          </p>
        )}
      </div>
    </section>
  );
}
