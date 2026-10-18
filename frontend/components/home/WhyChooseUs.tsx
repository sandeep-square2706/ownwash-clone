import {
  BadgeCheck,
  Leaf,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";

const benefits = [
  {
    title: "Certified Quality",
    description:
      "We follow quality-focused standards to provide safe and reliable cleaning services.",
    icon: BadgeCheck,
  },
  {
    title: "Doorstep Convenience",
    description:
      "Get professional cleaning services at your location without unnecessary travel or waiting.",
    icon: ShieldCheck,
  },
  {
    title: "Trained Experts",
    description:
      "Our trained professionals handle every service with care and attention to detail.",
    icon: UsersRound,
  },
  {
    title: "Eco-Friendly Approach",
    description:
      "Water-saving methods and responsible cleaning products help provide a cleaner experience.",
    icon: Leaf,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-9">
          <HomeSectionHeading eyebrow="Why choose us?" title="Why choose" accent="CleanKart?" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(16,44,95,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(16,44,95,0.1)] sm:p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-blue)] text-white shadow-sm shadow-blue-900/20">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[var(--brand-navy)]">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
