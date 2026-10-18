import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock3, MapPin, ShieldCheck } from "lucide-react";

import BookingPanel from "@/components/services/BookingPanel";
import { services, getServiceBySlug } from "@/lib/services";

type ServiceDetailsProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetails({ params }: ServiceDetailsProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service || !service.isActive) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/services" className="transition hover:text-blue-900">
            Services
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-950">{service.name}</span>
        </div>
      </div>

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-slate-200 sm:min-h-[480px]">
            <Image
              src={service.images[0]}
              alt={service.name + " performed by a CleanKart professional"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-blue-950 shadow-sm">
              {service.category}
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">
              CleanKart doorstep service
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              {service.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <InfoPill icon={<Clock3 />} text={service.duration} />
              <InfoPill icon={<MapPin />} text="At your doorstep" />
              <InfoPill icon={<ShieldCheck />} text="Quality assured" />
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-800">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <BookingPanel service={service} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
      <span className="text-cyan-700 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {text}
    </span>
  );
}
