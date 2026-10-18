import Link from "next/link";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "How do I choose a service?",
    answer:
      "Browse the service catalogue, open a service to see its description and options, then add the option you need to your cart.",
  },
  {
    question: "Why does a service show a price range?",
    answer:
      "Some services have options based on vehicle or item size. Choose an option on the service page to see its price.",
  },
  {
    question: "Can I save a service for later?",
    answer:
      "Yes. Tap the heart on a service card to add it to your wishlist. Your saved list is kept in this browser.",
  },
  {
    question: "How do I prepare a booking?",
    answer:
      "Add the services you need to your cart, then continue to the booking form to enter your preferred details.",
  },
  {
    question: "Are online payments available?",
    answer:
      "This frontend preview does not process payments. Payment options can be enabled after the secure backend flow is connected.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            Help centre
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Quick answers about services, pricing and the frontend booking flow.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {questions.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-blue-950">
                {question}
                <ChevronDown className="h-5 w-5 shrink-0 text-blue-700 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                {answer}
              </p>
            </details>
          ))}
          <p className="pt-5 text-center text-sm text-slate-600">
            Still need help?{" "}
            <Link href="/contact" className="font-semibold text-blue-900 underline underline-offset-2">
              Contact CleanKart
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
