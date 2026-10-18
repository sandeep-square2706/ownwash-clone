import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BookAffordable() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-3xl bg-blue-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
            <Sparkles className="h-4 w-4" />
            Good care, made simple
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
            A spotless space is a few taps away.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            Choose from vehicle, home and furniture cleaning, then select the
            service option that works for you.
          </p>
          <Link
            href="/services"
            className="mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Find your service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[260px] lg:min-h-[370px]">
          <Image
            src="/images/services/sofa-steam-cleaning.jpeg"
            alt="CleanKart professional refreshing a sofa"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 to-transparent lg:from-blue-950/10" />
        </div>
      </div>
    </section>
  );
}
