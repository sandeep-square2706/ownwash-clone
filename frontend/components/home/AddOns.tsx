import Link from "next/link";

import HomeSectionHeading from "@/components/home/HomeSectionHeading";
import BrandedPhoto from "@/components/ui/BrandedPhoto";

const serviceLinks = [
  { title: "Bathroom Cleaning", slug: "house-cleaning", image: "bathroom-cleaning.jpeg" },
  { title: "Kitchen Cleaning", slug: "kitchen-cleaning", image: "kitchen-cleaning.jpeg" },
  { title: "Car Interior Cleaning", slug: "interior-deep-cleaning", image: "car-interior-cleaning.jpeg" },
  { title: "Carpet Cleaning", slug: "carpet-cleaning", image: "carpet-cleaning.jpeg" },
  { title: "Sofa-Dry Cleaning", slug: "sofa-dry-cleaning", image: "sofa-cleaning.jpeg" },
  { title: "Bike Foam Wash", slug: "foam-washing", image: "bike-foam-wash.jpeg" },
];

export default function AddOns() {
  return (
    <section className="bg-[#f6f9fe] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-8">
          <HomeSectionHeading eyebrow="Our top services" title="Add-ons to elevate your" accent="clean" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {serviceLinks.map(({ title, slug, image }) => (
            <Link
              key={title}
              href={"/services/" + slug}
              className="group text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-blue)]"
            >
              <div className="relative aspect-[1.32] overflow-hidden rounded-2xl bg-slate-200 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <BrandedPhoto
                  src={"/images/services/" + image}
                  alt={title}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <span className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 transition group-hover:text-[var(--brand-blue)]">
                {title}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
