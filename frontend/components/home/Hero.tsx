import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, House, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <>
      <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[500px] max-w-[1380px] overflow-hidden rounded-[28px] bg-blue-950 sm:min-h-[560px]">
          <Image
            src="/images/services/car-exterior-wash.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/75 to-blue-950/10" />

          <div className="relative z-10 flex min-h-[500px] max-w-3xl flex-col justify-center px-6 py-14 text-white sm:min-h-[560px] sm:px-12 lg:px-16">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-500" />
              CLEAN HOME. CLEAN RIDE. MORE TIME FOR YOU.
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Professional cleaning, brought to your doorstep.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
              Book trusted care for your car, home and everyday spaces with CleanKart.
              Choose a service, pick an option and we’ll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Explore services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm font-medium text-white/85">
                Starting at ₹199
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-blue-500" />
                Trained professionals
              </span>
              <span className="inline-flex items-center gap-2">
                <House className="h-4 w-4 text-blue-500" />
                Doorstep convenience
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-500" />
                Flexible service slots
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-3 sm:grid-cols-3">
          {[
            ["13", "doorstep services"],
            ["Car", "care and detailing"],
            ["Home", "cleaning and upkeep"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm"
            >
              <span className="text-lg font-bold text-blue-950">{value}</span>
              <span className="text-sm text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
