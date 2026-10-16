import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const services = [
  {
    slug: "foam-washing",
    title: "Foam Washing",
    category: "Car Washing",
    price: "₹399",
    description:
      "Professional foam-based exterior cleaning for a fresh and clean vehicle.",
  },
  {
    slug: "interior-deep-cleaning",
    title: "Interior Deep Cleaning",
    category: "Interior",
    price: "₹599 – ₹899",
    description:
      "Deep cleaning for seats, carpets, dashboard and vehicle interiors.",
  },
  {
    slug: "steam-washing",
    title: "Steam Washing",
    category: "Car Washing",
    price: "₹599 – ₹799",
    description:
      "Steam-based cleaning that refreshes your vehicle and helps control odour.",
  },
  {
    slug: "full-car-detailing",
    title: "Full Car Detailing",
    category: "Detailing",
    price: "₹899 – ₹1,599",
    description:
      "Complete interior and exterior detailing for a premium finish.",
  },
  {
    slug: "exterior-deep-cleaning",
    title: "Exterior Deep Cleaning",
    category: "Exterior",
    price: "₹599 – ₹899",
    description:
      "Detailed exterior cleaning to remove stubborn dirt and restore appearance.",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-gray-50">

      {/* Hero */}

      <section className="bg-[#0C706A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
            OwnWash Services
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Professional Cleaning Services
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-teal-50">
            Choose the right cleaning service and book professional
            doorstep service at your convenience.
          </p>

        </div>
      </section>

      {/* Services */}

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Search / Filter */}

          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">

            <div className="flex flex-1 items-center rounded-lg border border-gray-200 px-4">
              <Search className="mr-3 h-5 w-5 text-gray-400" />

              <input
                type="search"
                placeholder="Search services..."
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>

            <select
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none"
              defaultValue="all"
            >
              <option value="all">All Categories</option>
              <option value="Car Washing">Car Washing</option>
              <option value="Interior">Interior</option>
              <option value="Detailing">Detailing</option>
              <option value="Exterior">Exterior</option>
            </select>

          </div>

          {/* Grid */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => (
              <article
                key={service.slug}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Image Placeholder */}

                <div className="aspect-[4/3] bg-gradient-to-br from-teal-700 to-slate-800">
                  <div className="flex h-full items-center justify-center text-sm text-white/70">
                    Service Image
                  </div>
                </div>

                <div className="p-5">

                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                    {service.category}
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Starting from
                      </p>

                      <p className="text-xl font-bold text-teal-700">
                        {service.price}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

    </main>
  );
}