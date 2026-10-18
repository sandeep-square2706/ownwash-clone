import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "A few ways to keep your car feeling fresh",
    excerpt: "Simple habits that help between professional cleaning visits.",
    image: "/images/services/car-interior-cleaning.jpeg",
    href: "/blog#car-care",
    label: "Car care",
  },
  {
    title: "What to know before cleaning your sofa",
    excerpt: "Understand fabric care, spot treatment and service options.",
    image: "/images/services/sofa-steam-cleaning.jpeg",
    href: "/blog#home-textiles",
    label: "Home care",
  },
  {
    title: "How to prepare for a doorstep service",
    excerpt: "A quick checklist to help your appointment run smoothly.",
    image: "/images/services/kitchen-cleaning.jpeg",
    href: "/blog#booking",
    label: "Booking guide",
  },
];

export default function LatestBlog() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Tips & guides
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
              A little know-how goes a long way
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700"
          >
            View all guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.href}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={article.href} className="block">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {article.label}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-blue-950">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
