import Image from "next/image";
import Link from "next/link";

const highlights = [
  { title: "Car washing", slug: "foam-washing", image: "car-exterior-wash.jpeg", alt: "CleanKart professional washing a car" },
  { title: "Kitchen cleaning", slug: "kitchen-cleaning", image: "kitchen-cleaning.jpeg", alt: "CleanKart professional cleaning a kitchen hob" },
  { title: "Sofa cleaning", slug: "sofa-dry-cleaning", image: "sofa-steam-cleaning.jpeg", alt: "CleanKart professional deep cleaning a sofa" },
];

export default function ServiceHighlights() {
  return (
    <section aria-label="CleanKart service photo highlights" className="bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1380px] gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Link
            key={item.title}
            href={"/services/" + item.slug}
            className="group relative aspect-[1.7] overflow-hidden rounded-2xl bg-slate-200 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
          >
            <Image
              src={"/images/services/" + item.image}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08224d]/80 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-md bg-[var(--brand-navy)]/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
