import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

const articles = [
  {
    title: "A simple guide to cleaner solar panels",
    excerpt: "Why regular panel care helps keep your rooftop system clear of dust and buildup.",
    image: "/images/services/solar-panel-cleaning.jpeg",
    href: "/blog#solar-care",
    label: "Solar care",
  },
  {
    title: "What to know before cleaning your sofa",
    excerpt: "Understand fabric care, spot treatment and service options.",
    image: "/images/generated/blog-sofa-care.webp",
    href: "/blog#home-textiles",
    label: "Home care",
  },
  {
    title: "How to prepare for a doorstep service",
    excerpt: "A quick checklist to help your appointment run smoothly.",
    image: "/images/generated/blog-booking-guide.webp",
    href: "/blog#booking",
    label: "Booking guide",
  },
];

export default function LatestBlog() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeading eyebrow="Latest updates" title="Our latest" accent="news & blog" />
          <Link
            href="/blog"
            className="mb-1 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-navy)]"
          >
            View all guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.href}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_7px_26px_rgba(16,44,95,0.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(16,44,95,0.13)]"
            >
              <Link href={article.href} className="block">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <BrandedPhoto
                    src={article.image}
                    alt=""
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-blue)]">
                    {article.label}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[var(--brand-navy)]">
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
