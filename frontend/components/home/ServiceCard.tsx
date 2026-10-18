import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

type ServiceCardProps = {
  title: string;
  description: string;
  price: string;
  category: string;
};

export default function ServiceCard({
  title,
  description,
  price,
  category,
}: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-700 to-slate-700">
        <div className="flex h-full items-center justify-center text-center text-white/70">
          <div>
            <p className="text-sm font-medium">Service Image</p>
            <p className="mt-1 text-xs">Asset coming soon</p>
          </div>
        </div>

        <button
          type="button"
          aria-label={"Add " + title + " to wishlist"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:text-red-500"
        >
          <Heart className="h-5 w-5" />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700">
          {category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-xl font-bold text-blue-700">{price}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
