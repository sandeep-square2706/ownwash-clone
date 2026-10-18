import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function CleanKartPromise() {
  return (
    <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-[1380px] overflow-hidden rounded-[24px] bg-[var(--brand-navy)] text-white shadow-[0_16px_44px_rgba(16,44,95,0.16)] lg:grid-cols-[0.95fr_1.1fr_0.8fr]">
        <div className="relative min-h-[205px] lg:min-h-[270px]">
          <Image
            src="/images/services/sofa-steam-cleaning.jpeg"
            alt="CleanKart professional cleaning a living room sofa"
            fill
            sizes="(max-width: 1024px) 100vw, 32vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[var(--brand-navy)]/20" />
        </div>
        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 lg:px-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-gold)]">The CleanKart difference</p>
          <h2 className="mt-2 text-[27px] font-bold leading-tight sm:text-[32px]">Good care, right at your doorstep.</h2>
          <ul className="mt-4 grid gap-2 text-sm text-blue-50 sm:grid-cols-2 lg:grid-cols-1">
            {["Home and vehicle cleaning", "Clear service options", "Flexible time preferences"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[var(--brand-blue)]"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center px-6 pb-7 sm:px-8 lg:justify-center lg:p-5">
          <Link
            href="/services"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-[var(--brand-gold)]"
          >
            Explore services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
