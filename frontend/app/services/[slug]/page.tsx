import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, CircleHelp, Clock3, MapPin, ShieldCheck, X } from "lucide-react";

import BookingPanel from "@/components/services/BookingPanel";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceInformationTabs from "@/components/services/ServiceInformationTabs";
import ServiceImageCarousel from "@/components/services/ServiceImageCarousel";
import {
  getServiceOriginalPrice,
  getServicePrice,
  mockServices,
  type Service,
  type ServiceFAQ,
} from "@/lib/services";
import { loadServerServiceBySlug, loadServerServices } from "@/lib/server-services";

type ServiceDetailsProps = {
  params: Promise<{ slug: string }>;
};

const previewFAQs: ServiceFAQ[] = [
  {
    question: "Can I book this service now?",
    answer: "This site is a frontend preview. A live booking service will check availability before confirming an appointment.",
  },
  {
    question: "Is the price final?",
    answer: "Prices shown here are preview values. The connected booking service will confirm the final price, options and availability.",
  },
];

export function generateStaticParams() {
  return mockServices.filter((service) => service.isActive).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await loadServerServiceBySlug(slug);
    if (!service) return { title: "Service not found | CleanKart" };
    return {
      title: service.name,
      description: service.description,
      openGraph: {
        title: service.name,
        description: service.description,
        type: "website",
      },
    };
  } catch {
    return { title: "Services", description: "Explore CleanKart doorstep cleaning services." };
  }
}

export default function ServiceDetails(props: ServiceDetailsProps) {
  return (
    <Suspense fallback={<ServiceDetailsLoading />}>
      <ServiceDetailsContent {...props} />
    </Suspense>
  );
}

async function ServiceDetailsContent({ params }: ServiceDetailsProps) {
  const { slug } = await params;
  const service = await loadServerServiceBySlug(slug);

  if (!service || !service.isActive) notFound();

  const included = service.included ?? service.features;
  const faqs = service.faqs?.length ? service.faqs : previewFAQs;
  const originalPrice = getServiceOriginalPrice(service);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-900">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/services" className="transition hover:text-blue-900">Services</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page" className="font-medium text-blue-950">{service.name}</span>
        </nav>
      </div>

      <section className="px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <ServiceImageCarousel
              images={service.images}
              title={service.name}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              className="aspect-[4/3] rounded-3xl bg-slate-100 sm:aspect-[1.2/1]"
              showThumbnails
            />
            <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-blue-950">What’s included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-base font-bold text-blue-950">Not included</h3>
                {service.excluded?.length ? (
                  <ul className="mt-3 space-y-2">
                    {service.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                        <X className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Any exclusions will be shown with the live service details before booking.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold text-slate-500">
              {service.category} <span className="mx-2 text-slate-300">·</span>
              SKU: CK-{String(service.id).padStart(4, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-xl border-t border-slate-200 pt-4 leading-7 text-slate-600">
              {service.description}
            </p>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-extrabold text-blue-950">{getServicePrice(service)}</p>
              {originalPrice ? <del className="text-base text-slate-400">{originalPrice}</del> : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <InfoPill icon={<Clock3 />} text={service.duration} />
              <InfoPill icon={<MapPin />} text="At your doorstep" />
              <InfoPill icon={<ShieldCheck />} text="Quality assured" />
            </div>
            <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-900">
              Availability is checked before a live booking is confirmed. This preview does not reserve a time slot.
            </p>

            <div className="mt-6">
              <BookingPanel service={service} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ServiceInformationTabs service={service} />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <Suspense fallback={<RelatedServicesLoading />}>
          <RelatedServicesSection service={service} />
        </Suspense>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <CircleHelp className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold text-blue-950">Frequently asked questions</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-blue-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceDetailsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-24 animate-pulse rounded bg-slate-200" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

async function RelatedServicesSection({ service }: { service: Service }) {
  const catalog = await loadServerServices().catch(() => mockServices.filter((item) => item.isActive));
  const relatedServices = getRelatedServices(service, catalog);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Keep exploring</p>
          <h2 className="mt-1 text-2xl font-bold text-blue-950">Related services</h2>
        </div>
        <Link href="/services" className="text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
          View all services
        </Link>
      </div>
      {relatedServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {relatedServices.map((relatedService) => (
            <ServiceCard key={relatedService.id} service={relatedService} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          More services will appear here as they are added to the catalogue.
        </p>
      )}
    </div>
  );
}

function RelatedServicesLoading() {
  return (
    <div className="mx-auto max-w-7xl" aria-label="Loading related services">
      <div className="mb-5 h-9 w-56 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-white shadow-sm" />
        ))}
      </div>
    </div>
  );
}

function getRelatedServices(service: Service, catalog: Service[]) {
  const usedImages = new Set(service.images);
  const candidates = catalog
    .filter((candidate) => candidate.isActive && candidate.id !== service.id)
    .sort((left, right) => Number(right.category === service.category) - Number(left.category === service.category));
  const related: Service[] = [];

  for (const candidate of candidates) {
    const uniqueImages = candidate.images.filter((image) => !usedImages.has(image));
    if (uniqueImages.length === 0) continue;
    related.push({ ...candidate, images: uniqueImages });
    uniqueImages.forEach((image) => usedImages.add(image));
    if (related.length === 6) break;
  }

  return related;
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
      <span className="text-blue-700 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {text}
    </span>
  );
}
