import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    title: "Steam Washing",
    subtitle: "Thick Foam Clean",
    price: "₹599",
    suffix: "Starts",
    features: [
      "Steam Spray",
      "Odour Control",
      "Glass Wipe",
      "Tire Shine",
      "Interior Vacuum",
      "Bacteria Removal",
    ],
  },
  {
    title: "Car Detailing",
    subtitle: "Premium Finish Care",
    price: "₹899",
    suffix: "Starts",
    features: [
      "Exterior Deep Cleaning",
      "Interior Vacuum",
      "Dashboard Polish",
      "Glass Cleaning",
      "Tire Shine",
      "Premium Finish Protection",
    ],
  },
  {
    title: "Foam Washing",
    subtitle: "Tough Dirt Removal",
    price: "₹349",
    suffix: "Only",
    exclusive: true,
    features: [
      "Thick Foam Wash",
      "Exterior Hand Wash",
      "Glass Cleaning",
      "Tire Cleaning",
      "Body Wipe & Dry",
      "Shine Finish",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">

        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-600">
            Pricing Table
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Pricing Model
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`relative overflow-hidden rounded-2xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                plan.exclusive
                  ? "border-teal-500 ring-2 ring-teal-100"
                  : "border-gray-200"
              }`}
            >
              {plan.exclusive && (
                <span className="absolute right-5 top-5 rounded-full bg-teal-700 px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                  EXCLUSIVE
                </span>
              )}

              <h3 className="text-2xl font-bold text-gray-900">
                {plan.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {plan.subtitle}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-black text-teal-700">
                  {plan.price}
                </span>

                <span className="pb-1 text-sm font-medium text-gray-500">
                  {plan.suffix}
                </span>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      <Check className="h-3 w-3" />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-3 text-center text-xs text-gray-400">
                T&C Applied
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}