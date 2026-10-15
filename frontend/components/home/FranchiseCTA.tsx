import { ArrowRight, HandCoins, Headphones, TrendingUp } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: HandCoins,
    title: "Low Investment",
  },
  {
    icon: TrendingUp,
    title: "High Returns",
  },
  {
    icon: Headphones,
    title: "Full Support",
  },
];

export default function FranchiseCTA() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        <div className="overflow-hidden rounded-3xl bg-gray-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">

            <div className="px-7 py-12 sm:px-10 lg:px-14">
              <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-400">
                Franchise Opportunity
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                Start Your Own Cleaning Business with OwnWash
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300">
                Build your own cleaning business with a proven service model,
                professional support and an opportunity to grow.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {benefits.map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <Icon className="h-4 w-4 text-teal-400" />
                    {title}
                  </div>
                ))}
              </div>

              <Link
                href="/franchise"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-500"
              >
                Become A Franchie Partner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hidden min-h-[330px] bg-gradient-to-br from-teal-800 via-teal-700 to-gray-900 lg:block">
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-white/80">
                  <TrendingUp className="mx-auto h-20 w-20" />
                  <p className="mt-4 text-sm">
                    Franchise image coming soon
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}