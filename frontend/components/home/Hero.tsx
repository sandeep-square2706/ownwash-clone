import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, House, Sparkles } from "lucide-react";
import { formatPrice, getStartingPrice, type Service } from "@/lib/services";
import { loadServerServices } from "@/lib/server-services";

export default async function Hero() {
  let services: Service[] = [];
  try {
    services = await loadServerServices();
  } catch {
    // Keep the hero useful when the optional service API is unavailable.
  }
  const startingPrice = getStartingPrice(services);

  return (
    <>
      <section className="bg-white px-4 pb-7 pt-3 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[440px] max-w-[1380px] overflow-hidden rounded-[28px] bg-[var(--brand-navy)] sm:min-h-[470px]">
          <Image
            src="/images/services/car-exterior-wash.jpeg"
            alt="CleanKart professional washing a car at a customer's home"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#092451]/95 via-[#0d3471]/82 to-[#0d3471]/5" />

          <div className="relative z-10 flex min-h-[440px] max-w-[760px] flex-col justify-center px-6 py-12 text-white sm:min-h-[470px] sm:px-10 lg:px-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-navy)]/50 px-4 py-2 text-sm font-semibold text-[var(--brand-gold)] backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Home · Car · Office Cleaning
            </span>
            <h1 className="mt-5 max-w-[680px] text-[40px] font-bold leading-[1.04] tracking-tight sm:text-[52px] lg:text-[60px]">
              Professional cleaning at your doorstep.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
              Trusted care for your car, home and everyday spaces, delivered with the CleanKart touch.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-6 text-sm font-bold text-[var(--brand-navy)] shadow-lg shadow-black/15 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Book a service
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="text-sm font-semibold text-white/90">
                {startingPrice !== undefined
                  ? `Options from ${formatPrice(startingPrice)}`
                  : "Explore our service options"}
              </span>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/90">
              <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Trained professionals</span>
              <span className="inline-flex items-center gap-2"><House className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Doorstep convenience</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Flexible service options</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="CleanKart service highlights" className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-4 sm:grid-cols-3">
          {[
            ["13", "cleaning services", "Options for the spaces you use every day"],
            ["Home + Car", "care in one place", "Browse home, furniture and vehicle cleaning"],
            ["At your door", "service convenience", "Choose a service and explore available options"],
          ].map(([value, label, description]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_5px_20px_rgba(16,44,95,0.05)] sm:px-6"
            >
              <p className="text-[26px] font-bold leading-none text-[var(--brand-blue)]">{value}</p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--brand-navy)]">{label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
