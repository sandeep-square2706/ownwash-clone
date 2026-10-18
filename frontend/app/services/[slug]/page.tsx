import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CircleHelp, Clock3, MapPin, ShieldCheck, Star, X } from "lucide-react";

import BookingPanel from "@/components/services/BookingPanel";
import ServiceImageCarousel from "@/components/services/ServiceImageCarousel";
import { mockServices, type ServiceFAQ } from "@/lib/services";
import { loadServerServiceBySlug } from "@/lib/server-services";

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

export default async function ServiceDetails({ params }: ServiceDetailsProps) {
  const { slug } = await params;
  const service = await loadServerServiceBySlug(slug);

  if (!service || !service.isActive) notFound();

  const included = service.included ?? service.features;
  const faqs = service.faqs?.length ? service.faqs : previewFAQs;

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

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <ServiceImageCarousel
              images={service.images}
              title={service.name}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              className="aspect-[4/3] rounded-3xl bg-slate-100 sm:aspect-[1.2/1]"
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
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
              CleanKart doorstep service
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              {service.name}
            </h1>
            {service.rating !== undefined && service.reviewCount !== undefined ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="font-semibold text-blue-950">{service.rating.toFixed(1)}</span>
                <span>({service.reviewCount} reviews)</span>
              </p>
            ) : null}
            <p className="mt-4 max-w-xl leading-7 text-slate-600">{service.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
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

            <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-blue-950">Customer reviews</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {service.reviewCount
                      ? `${service.reviewCount} customer reviews`
                      : "Service-specific reviews will appear when bookings are connected."}
                  </p>
                </div>
                <Star className="h-6 w-6 shrink-0 text-blue-500" aria-hidden="true" />
              </div>
              <Link href="/reviews" className="mt-4 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
                Read customer stories
              </Link>
            </section>
          </div>
        </div>
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

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
      <span className="text-blue-700 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {text}
    </span>
  );
}
