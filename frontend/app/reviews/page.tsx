import type { Metadata } from "next";
import Link from "next/link";
import Testimonials from "@/components/home/Testimonials";

export const metadata: Metadata = {
  title: "Customer reviews",
  description: "See how CleanKart will present verified customer feedback after service bookings are connected.",
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-blue-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            Verified customer feedback
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Reviews are coming soon</h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Customer reviews will appear here after CleanKart bookings and review collection are connected.
          </p>
        </div>
      </section>
      <Testimonials />
      <div className="px-4 pb-14 text-center">
        <Link
          href="/services"
          className="inline-flex min-h-12 items-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700"
        >
          Explore services
        </Link>
      </div>
    </main>
  );
}
