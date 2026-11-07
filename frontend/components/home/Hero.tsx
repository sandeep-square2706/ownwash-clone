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
      <section className="bg-white px-4 pb-7 pt-3 sm:px-6 lg:px-[4.5vw]">
        <div className="relative min-h-[280px] w-full overflow-hidden rounded-[24px] bg-[var(--brand-navy)] sm:min-h-[400px] sm:rounded-[28px] lg:min-h-[470px]">
          <Image
            src="/images/team/zaapino-car-wash.png"
            alt="Zaapino professional washing a car at a customer's home"
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#092451]/95 via-[#0d3471]/82 to-[#0d3471]/5" />

          <div className="relative z-10 flex min-h-[280px] max-w-[620px] flex-col justify-center px-5 py-6 text-white sm:min-h-[400px] sm:px-10 sm:py-10 lg:min-h-[470px] lg:px-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-navy)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--brand-gold)] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Home · Car · Office Cleaning
            </span>
            <h1 className="mt-3 max-w-[580px] text-[30px] font-bold leading-[1.04] tracking-tight sm:mt-5 sm:text-[52px] lg:text-[60px]">
              Professional cleaning at your doorstep.
            </h1>
            <p className="mt-2 max-w-[310px] text-sm leading-5 text-blue-50 sm:mt-4 sm:max-w-[500px] sm:text-lg sm:leading-7">
              Trusted care for your car, home and everyday spaces, delivered with the Zaapino touch.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
              <Link
                href="/services"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] shadow-lg shadow-black/15 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-12 sm:px-6"
              >
                Book a service
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="text-xs font-semibold text-white/90 sm:text-sm">
                {startingPrice !== undefined
                  ? `Options from ${formatPrice(startingPrice)}`
                  : "Explore our service options"}
              </span>
            </div>
            <div className="mt-7 hidden flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/90 sm:flex">
              <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Trained professionals</span>
              <span className="inline-flex items-center gap-2"><House className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Doorstep convenience</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--brand-gold)]" aria-hidden="true" />Flexible service options</span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
