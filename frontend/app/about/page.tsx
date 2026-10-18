import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Sparkles } from "lucide-react";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

export const metadata: Metadata = {
  title: "About CleanKart",
  description: "Learn about CleanKart’s doorstep cleaning service vision for homes, vehicles and everyday spaces.",
};

const values = [
  {
    title: "Clear choices",
    text: "Service descriptions, options and starting prices are easy to compare.",
    icon: BadgeCheck,
  },
  {
    title: "Care for your space",
    text: "Every booking is built around the home, vehicle or furniture you want refreshed.",
    icon: Sparkles,
  },
  {
    title: "Doorstep convenience",
    text: "Explore services designed to fit around your day and your location.",
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            About CleanKart
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            A simpler way to care for the places you call yours.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100">
            CleanKart brings vehicle and home cleaning services together in one
            easy-to-use doorstep catalogue.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-950">Clean, made convenient</h2>
            <p className="mt-4 leading-7 text-slate-600">
              From a foam wash to a refreshed sofa, the service catalogue helps
              you find the right kind of care, compare options and prepare a
              booking from home.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
            >
              Browse the catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-slate-100">
            <BrandedPhoto
              src="/images/generated/home-cleaning.webp"
              alt="CleanKart professional providing home cleaning at a customer’s residence"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-blue-950">What guides us</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {values.map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-blue-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
