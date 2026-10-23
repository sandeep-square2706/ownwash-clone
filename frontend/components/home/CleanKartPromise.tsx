import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const highlights = [
  "Home and vehicle care",
  "Service options in one place",
  "Choose a convenient time",
  "Explore details before booking",
];

export default function CleanKartPromise() {
  return (
    <section className="bg-white px-4 py-7 sm:px-6 lg:px-8">
      <div
        className="relative mx-auto grid max-w-[1380px] items-center gap-5 overflow-hidden rounded-[24px] border border-blue-950/20 bg-[#092454] p-6 text-white shadow-[0_18px_50px_rgba(10,35,80,0.2)] sm:grid-cols-[minmax(0,1fr)_190px] sm:p-8 lg:grid-cols-[220px_1px_minmax(0,1fr)_auto_230px] lg:gap-7 lg:px-10 lg:py-7"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 78% 10%, rgba(35,174,255,.3), transparent 42%), radial-gradient(circle at 12% 18%, rgba(94,207,255,.18) 0 1px, transparent 1.5px), linear-gradient(118deg, #082252, #0d3d83 58%, #061a42)",
          backgroundSize: "auto, 22px 22px, auto",
        }}
      >
        <div className="flex items-center gap-4 sm:col-span-full lg:col-span-1 lg:flex-col lg:items-start lg:gap-3">
          <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white p-1 shadow-lg">
            <Image src="/images/logo/cleankart-logo.png" alt="CleanKart logo" width={60} height={60} className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">The CleanKart promise</p>
            <h2 className="mt-1 text-[24px] font-black leading-tight sm:text-[28px]">Care that comes to you</h2>
          </div>
        </div>

        <div className="hidden h-full min-h-32 bg-white/35 lg:block" aria-hidden="true" />

        <ul className="grid gap-x-6 gap-y-3 text-sm font-semibold text-blue-50 sm:grid-cols-2 lg:grid-cols-1">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[var(--brand-blue)] shadow-sm">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/services"
          className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-[var(--brand-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:col-start-1 lg:col-start-auto"
        >
          Explore services <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="relative flex h-[180px] items-end justify-center self-end sm:h-[245px] sm:row-span-2 sm:col-start-2 sm:row-start-2 lg:col-start-auto lg:row-span-1 lg:row-start-auto">
          <Image
            src="/images/generated/promo-worker-branded.webp"
            alt="CleanKart team member in a navy uniform with the CleanKart logo"
            fill
            sizes="(max-width: 1024px) 190px, 230px"
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
