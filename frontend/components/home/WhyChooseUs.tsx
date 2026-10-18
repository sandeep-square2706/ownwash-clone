import {
  BadgeCheck,
  Leaf,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

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
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-cyan-700">
            Why Choose Us?
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
            Why choose our
            <span className="block text-cyan-700">
              Cleaning Solutions
            </span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-blue-900">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-blue-950">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
