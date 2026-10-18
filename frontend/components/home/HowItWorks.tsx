import {
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";

const steps = [
  {
    number: "01",
    title: "Choose Service",
    description:
      "Select the service you need and choose a convenient time.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Confirm Your Booking",
    description:
      "Add your address, choose a preferred time slot and confirm your booking.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "We Arrive",
    description:
      "Our expert arrives with the required equipment and cleaning products.",
    icon: MapPin,
  },
  {
    number: "04",
    title: "Sit Back & Relax",
    description:
      "We clean while you relax and enjoy a spotless experience.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-8">
          <HomeSectionHeading eyebrow="Our process" title="Here’s how it" accent="works" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="relative flex min-h-[285px] flex-col items-center rounded-xl border border-[#e3eaf4] bg-[#f0f6f7] px-5 pb-6 pt-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute right-4 top-4 text-xs font-bold tracking-[0.16em] text-[var(--brand-blue)]">
                {number}
              </span>
              <div className="flex h-[126px] w-full items-center justify-center">
                <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-blue-100 bg-white text-[var(--brand-blue)] shadow-sm">
                  <Icon className="h-9 w-9" aria-hidden="true" />
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Step {number}</span>
              <h3 className="mt-2 text-lg font-bold text-[var(--brand-navy)]">
                {title}
              </h3>
              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-6 text-slate-700">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
