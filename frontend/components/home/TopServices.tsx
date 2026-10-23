import Link from "next/link";
import { Armchair, ArrowRight, Droplets, House, Car, Wind, type LucideIcon } from "lucide-react";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

const shortcuts: {
  title: string;
  slug: string;
  image: string;
  generated?: boolean;
  icon: LucideIcon;
}[] = [
  { title: "House Cleaning", slug: "house-cleaning", image: "home-cleaning.webp", generated: true, icon: House },
  { title: "Car Washing", slug: "foam-washing", image: "car-washing.webp", generated: true, icon: Car },
  { title: "Sofa Cleaning", slug: "sofa-dry-cleaning", image: "sofa-cleaning.jpeg", icon: Armchair },
  { title: "AC Cleaning", slug: "ac-services", image: "ac-cleaning.webp", generated: true, icon: Wind },
  { title: "Water Tank Cleaning", slug: "water-tank-cleaning", image: "water-tank-cleaning.webp", generated: true, icon: Droplets },
];

export default function TopServices() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeading eyebrow="Our top services" title="Book trusted home and car" accent="help" />
          <Link
            href="/services"
            className="mb-1 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[var(--brand-blue)] transition hover:text-[var(--brand-navy)]"
          >
            View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {shortcuts.map(({ title, slug, image, generated, icon: Icon }) => (
            <Link
              key={slug}
              href={"/services/" + slug}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_5px_20px_rgba(16,44,95,0.045)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_28px_rgba(16,44,95,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
            >
              <div className="relative flex aspect-[1.55] items-center justify-center overflow-hidden rounded-xl bg-[#eaf2fc]">
                {image ? (
                  <BrandedPhoto
                    src={(generated ? "/images/generated/" : "/images/services/") + image}
                    alt={title}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <Icon className="h-12 w-12 text-[var(--brand-blue)]" aria-hidden="true" />
                )}
              </div>
              <span className="flex min-h-11 items-center justify-center gap-2 px-2 text-center text-sm font-semibold text-slate-900">
                {title}
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand-blue)]" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
