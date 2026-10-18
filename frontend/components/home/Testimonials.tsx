import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <HomeSectionHeading eyebrow="Customer reviews" title="Honest feedback" accent="matters" />
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Once CleanKart bookings are live, customers will be able to share feedback about the service they received.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-blue-100 bg-[#f6f9fe] p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--brand-blue)] shadow-sm">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-[var(--brand-navy)]">Reviews tied to completed services</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This preview does not publish sample names, ratings or testimonials as customer feedback.
            </p>
          </article>
          <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_7px_24px_rgba(16,44,95,0.06)] sm:p-8">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--brand-blue)]">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-[var(--brand-navy)]">Choose a service to explore</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse the current service catalogue and compare options in the frontend preview.
              </p>
            </div>
            <Link href="/services" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300">
              Explore services
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
