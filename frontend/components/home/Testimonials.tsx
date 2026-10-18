import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Customer feedback
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
            Verified reviews are on the way
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Once CleanKart bookings are live, customers will be able to share feedback about the service they received.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-blue-950">Reviews tied to completed services</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This preview does not publish sample names, ratings or testimonials as customer feedback.
            </p>
          </article>
          <article className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-blue-950">Choose a service to explore</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse the current service catalogue and compare options in the frontend preview.
              </p>
            </div>
            <Link href="/services" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700">
              Explore services
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
