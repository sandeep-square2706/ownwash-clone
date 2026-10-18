import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

const partnershipPoints = ["Local service opportunity", "A cleaning-focused business", "Talk with the CleanKart team"];

export default function FranchiseCTA() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-2xl bg-[#fff8e8] p-4 sm:p-6 lg:grid-cols-[290px_1fr_auto] lg:items-center lg:gap-6 lg:p-5">
        <div className="relative aspect-[1.55] overflow-hidden rounded-xl bg-slate-200 lg:aspect-[1.45]">
          <BrandedPhoto
            src="/images/generated/franchise-partner.webp"
            alt="CleanKart service storefront and franchise location"
            sizes="(max-width: 1024px) 100vw, 290px"
            className="object-cover"
          />
        </div>
        <div className="py-5 lg:py-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-blue)]">Partner with CleanKart</p>
          <h2 className="mt-2 max-w-2xl text-[26px] font-bold leading-tight text-slate-950 sm:text-[32px]">
            Start a doorstep cleaning business with CleanKart.
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-800">
            {partnershipPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/franchise"
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[var(--brand-gold)] px-5 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
        >
          Become a partner <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
