import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { getServicePrice, type Service } from "@/lib/services";
import { loadServerServices } from "@/lib/server-services";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

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
    <section className="bg-[#f6f9fe] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9">
          <HomeSectionHeading eyebrow="Pricing table" title="Our" accent="pricing model" />
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
                className="flex flex-col rounded-2xl border border-slate-200 border-t-4 border-t-[var(--brand-blue)] bg-white p-6 shadow-[0_7px_24px_rgba(16,44,95,0.07)] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(16,44,95,0.13)] sm:p-7"
              >
                <p className="inline-flex w-fit rounded-full bg-[#fff5d6] px-3 py-1 text-xs font-bold text-[#8a6500]">{service.category}</p>
                <h3 className="mt-3 text-2xl font-bold text-[var(--brand-navy)]">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{plan.subtitle}</p>
                <p className="mt-6 text-3xl font-black text-[var(--brand-blue)]">
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
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--brand-blue)]">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={"/services/" + service.slug}
                  className="mt-7 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300"
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
