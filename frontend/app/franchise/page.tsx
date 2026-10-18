import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Handshake, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Build a local service team",
    text: "Bring dependable doorstep cleaning to homes and businesses in your area.",
  },
  {
    icon: Handshake,
    title: "Work with the CleanKart brand",
    text: "Create a consistent customer experience with a recognizable service identity.",
  },
  {
    icon: Sparkles,
    title: "Offer services people need",
    text: "Choose from vehicle care, home cleaning and everyday maintenance services.",
  },
];

export default function FranchisePage() {
  return (
    <main className="bg-slate-50">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[390px] max-w-6xl overflow-hidden rounded-3xl bg-blue-950">
          <Image
            src="/images/services/solar-panel-cleaning.jpeg"
            alt="CleanKart team member caring for rooftop solar panels"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/75 to-blue-950/15" />
          <div className="relative z-10 flex min-h-[390px] max-w-2xl flex-col justify-center px-7 py-10 text-white sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Grow with CleanKart
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Bring trusted cleaning to your community.
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-white/85">
              We are exploring local franchise partnerships for convenient vehicle,
              home and business care.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Enquire about a partnership <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            A cleaner way to grow
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-950">
            A service business with room to make a difference.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-blue-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
          This page is an informational frontend preview. Franchise availability,
          terms and commercial details have not been published yet.
        </p>
      </section>
    </main>
  );
}
