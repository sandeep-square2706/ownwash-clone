import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, MapPin, Sparkles } from "lucide-react";

const topics = [
  { title: "Local service opportunity", icon: MapPin },
  { title: "Cleaning-focused business", icon: Sparkles },
  { title: "Talk with the CleanKart team", icon: Handshake },
];

export default function FranchiseCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-3xl bg-blue-950 text-white lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            Partner with CleanKart
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
            Interested in bringing doorstep cleaning to your city?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
            Tell us about your area and your interest in building a local
            cleaning-services business with CleanKart.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {topics.map(({ title, icon: Icon }) => (
              <span
                key={title}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white"
              >
                <Icon className="h-4 w-4 text-blue-500" />
                {title}
              </span>
            ))}
          </div>
          <Link
            href="/franchise"
            className="mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Explore partnership
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[260px] lg:min-h-[360px]">
          <Image
            src="/images/services/solar-panel-cleaning.jpeg"
            alt="CleanKart professional at work"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
