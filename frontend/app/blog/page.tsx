import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: "car-care",
    category: "Vehicle care",
    title: "A simple routine for a fresher car interior",
    summary:
      "Small habits between professional cleans can help keep your cabin comfortable and tidy.",
    image: "/images/services/car-interior-cleaning.jpeg",
  },
  {
    id: "home-textiles",
    category: "Home care",
    title: "How to look after sofas and carpets",
    summary:
      "Learn when routine vacuuming is enough and when upholstery needs a deeper refresh.",
    image: "/images/services/sofa-steam-cleaning.jpeg",
  },
  {
    id: "booking",
    category: "Booking guide",
    title: "What to prepare before a doorstep clean",
    summary:
      "A few quick steps can help your cleaning visit start smoothly and stay on schedule.",
    image: "/images/services/kitchen-cleaning.jpeg",
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
                <Image src={article.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
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
