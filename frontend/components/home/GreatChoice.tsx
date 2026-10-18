import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

export default function GreatChoice() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            CleanKart care
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-blue-950 sm:text-4xl">
            Thoughtful cleaning for the places you use every day.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            From a freshly washed car to a comfortable home, choose the service
            you need and let a CleanKart professional take care of the details.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-blue-950">Careful service</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Clear options and service details before you book.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-blue-950">One easy catalogue</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Car, home and furniture cleaning in one place.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
          >
            Explore all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-blue-950 sm:min-h-[390px]">
          <Image
            src="/images/services/solar-panel-cleaning.jpeg"
            alt="CleanKart professional cleaning solar panels"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-lg font-semibold text-white">
            Care for your space, from the floor to the rooftop.
          </p>
        </div>
      </div>
    </section>
  );
}
