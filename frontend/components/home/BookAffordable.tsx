import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BookAffordable() {
  return (
    <section className="bg-white px-0 py-2 sm:py-3">
      <div className="bg-[var(--brand-navy)] px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="border-l-[3px] border-[var(--brand-gold)] pl-3 text-lg font-bold leading-tight sm:text-[22px]">
            <span className="text-[var(--brand-gold)]">Book affordable services:</span>
            <span className="ml-2 text-white">Save time and money with CleanKart.</span>
          </p>
          <Link
            href="/services"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book a service <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
