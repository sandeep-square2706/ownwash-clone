import { ArrowRight, Clock3, IndianRupee, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BookAffordable() {
  return (
    <section className="bg-teal-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        <div className="overflow-hidden rounded-3xl bg-[#0C706A] text-white">
          <div className="grid lg:grid-cols-2">

            {/* CONTENT */}
            <div className="flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-14">
              <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
                Book Affordable Services:
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Save Time and Money with Us!
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-teal-50 sm:text-base">
                Professional cleaning services delivered to your doorstep,
                making it easier to keep your vehicle and spaces clean.
              </p>

              <div className="mt-7">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
                >
                  Book a services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* VISUAL PLACEHOLDER */}
            <div className="relative min-h-[300px] bg-gradient-to-br from-teal-700 to-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 px-8">
                  <Feature icon={<Clock3 />} text="Save Time" />
                  <Feature icon={<IndianRupee />} text="Affordable" />
                  <Feature icon={<ShieldCheck />} text="Trusted" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex min-w-[80px] flex-col items-center text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
        {icon}
      </div>

      <span className="mt-3 text-xs font-semibold">
        {text}
      </span>
    </div>
  );
}