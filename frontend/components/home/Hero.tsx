import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px]">

          <div className="relative min-h-[420px] overflow-hidden rounded-[24px] bg-teal-800">

            {/* Right-side visual placeholder */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[57%]">

              <div className="absolute inset-0 bg-gradient-to-r from-teal-800 via-teal-800/80 to-transparent" />

              {/* Temporary car-wash visual */}
              <div className="h-full w-full bg-gradient-to-br from-slate-600 via-slate-500 to-slate-800">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-white/70">
                    <Sparkles className="mx-auto h-14 w-14" />
                    <p className="mt-3 text-sm">
                      Approved hero image goes here
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-[420px] max-w-[650px] flex-col justify-center px-7 py-12 text-white sm:px-10 lg:px-12">

              {/* Offer */}
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium">
                <span>✨</span>
                Offer Limited Time
              </div>

              {/* Heading */}
              <h1 className="max-w-[600px] text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[52px]">
                Doorstep Car Wash at Just
                <span className="mt-1 block text-5xl sm:text-6xl">
                  ₹699
                </span>
              </h1>

              <p className="mt-4 text-base font-medium sm:text-lg">
                Professional Cleaning at Your Doorstep
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-6">

                <a
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-gray-100"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4" />
                </a>

                <div className="text-sm font-semibold">
                  <span className="mr-1 line-through text-red-400">
                    ₹999
                  </span>
                  Don't miss this limited time offer.
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3">

          <StatCard
            value="2000+"
            label="All Over Rating"
            icon={<BadgeCheck className="h-7 w-7 text-sky-500" />}
          />

          <StatCard
            value="5000+"
            label="Happy Customers"
            icon={
              <div className="flex -space-x-2 text-xl">
                👨🏻 👩🏻 👨🏻
              </div>
            }
          />

          <StatCard
            value="50+"
            label="Cities Available"
            icon={
              <div className="text-2xl">
                📍📍
              </div>
            }
          />

        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-xl transition hover:scale-105"
      >
        ☎
      </a>
    </>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[82px] items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">

      <div>
        <div className="text-3xl font-bold text-teal-700">
          {value}
        </div>

        <div className="mt-1 text-sm font-medium text-gray-800">
          {label}
        </div>
      </div>

      <div>{icon}</div>

    </div>
  );
}