import Link from "next/link";
import {
  Armchair,
  Car,
  CookingPot,
  Home,
  Layers3,
  Sparkles,
} from "lucide-react";

const serviceLinks = [
  { title: "Foam Wash", slug: "foam-washing", icon: Car },
  { title: "Kitchen Cleaning", slug: "kitchen-cleaning", icon: CookingPot },
  { title: "Interior Deep Cleaning", slug: "interior-deep-cleaning", icon: Sparkles },
  { title: "Carpet Cleaning", slug: "carpet-cleaning", icon: Layers3 },
  { title: "Sofa-Dry Cleaning", slug: "sofa-dry-cleaning", icon: Armchair },
  { title: "House Cleaning", slug: "house-cleaning", icon: Home },
];

export default function AddOns() {
  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-9 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
            More ways to refresh
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
            Find the right service for your space
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {serviceLinks.map(({ title, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={"/services/" + slug}
              className="group flex min-h-[155px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-blue-900 transition group-hover:bg-blue-950 group-hover:text-cyan-300">
                <Icon className="h-7 w-7" />
              </span>
              <span className="mt-4 text-sm font-bold text-blue-950">{title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
