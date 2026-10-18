import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

export const metadata: Metadata = {
  title: "Cleaning tips",
  description: "Practical CleanKart guides for vehicle care, furniture cleaning and a fresher home.",
};

const articles = [
  {
    id: "solar-care",
    category: "Solar care",
    title: "A simple guide to cleaner solar panels",
    summary:
      "Why regular panel care helps keep your rooftop system clear of dust and buildup.",
    image: "/images/services/solar-panel-cleaning.jpeg",
  },
  {
    id: "home-textiles",
    category: "Home care",
    title: "How to look after sofas and carpets",
    summary:
      "Learn when routine vacuuming is enough and when upholstery needs a deeper refresh.",
    image: "/images/generated/blog-sofa-care.webp",
  },
  {
    id: "booking",
    category: "Booking guide",
    title: "What to prepare before a doorstep clean",
    summary:
      "A few quick steps can help your cleaning visit start smoothly and stay on schedule.",
    image: "/images/generated/blog-booking-guide.webp",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            The CleanKart journal
          </p>
          <h1 className="mt-2 text-4xl font-bold text-blue-950">Simple care, made easier.</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Practical ideas for keeping your car, home and everyday spaces feeling fresh.
          </p>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              id={article.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                <BrandedPhoto src={article.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  {article.category}
                </p>
                <h2 className="mt-3 text-xl font-bold leading-snug text-blue-950">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
                >
                  Explore services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
