import Link from "next/link";
import { ArrowRight, BadgeInfo } from "lucide-react";

const terms = [
  {
    title: "Preview use",
    text: "This website demonstrates the CleanKart service catalogue and booking flow. It does not confirm a real cleaning appointment or provide a live service contract.",
  },
  {
    title: "Displayed prices and availability",
    text: "Prices, options, descriptions and availability shown here are frontend preview content. They may be revised before launch and are not a confirmed quote.",
  },
  {
    title: "Payments and bookings",
    text: "No payment processor or booking system is connected. The checkout button only displays a preview message; it does not charge you or create an order.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-blue-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-blue-950 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="flex items-center gap-3 text-blue-200">
            <BadgeInfo className="h-6 w-6" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">CleanKart preview</p>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Terms of use</h1>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            These notes apply to the current demonstration website.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-9">
          <div className="space-y-6">
            {terms.map(({ title, text }) => (
              <section key={title}>
                <h2 className="text-lg font-bold text-blue-950">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
          <Link href="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">
            Browse services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
