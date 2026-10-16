import {
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type ServiceDetailsProps = {
  params: Promise<{
    slug: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| Service data
|--------------------------------------------------------------------------
*/

const services = {
  "foam-washing": {
    name: "Foam Washing",
    category: "Car Washing",
    price: "₹399",
    description:
      "Professional foam-based exterior cleaning that helps remove dirt and leaves your vehicle looking fresh and clean.",
  },

  "interior-deep-cleaning": {
    name: "Interior Deep Cleaning",
    category: "Interior Cleaning",
    price: "₹599 – ₹899",
    description:
      "Deep interior cleaning for seats, carpets, dashboard and other areas of your vehicle.",
  },

  "steam-washing": {
    name: "Steam Washing",
    category: "Car Washing",
    price: "₹599 – ₹799",
    description:
      "Steam-based vehicle cleaning designed to refresh your car and help control odour and bacteria.",
  },

  "full-car-detailing": {
    name: "Full Car Detailing",
    category: "Car Detailing",
    price: "₹899 – ₹1,599",
    description:
      "Complete interior and exterior detailing for a premium and polished vehicle finish.",
  },

  "exterior-deep-cleaning": {
    name: "Exterior Deep Cleaning",
    category: "Exterior Cleaning",
    price: "₹599 – ₹899",
    description:
      "Detailed exterior cleaning that helps remove stubborn dirt and restore your vehicle's appearance.",
  },
} as const;

type ServiceSlug = keyof typeof services;

/*
|--------------------------------------------------------------------------
| Static service pages
|--------------------------------------------------------------------------
|
| These pages will be generated during `next build`.
|--------------------------------------------------------------------------
*/

export function generateStaticParams() {
  return [
    {
      slug: "foam-washing",
    },
    {
      slug: "interior-deep-cleaning",
    },
    {
      slug: "steam-washing",
    },
    {
      slug: "full-car-detailing",
    },
    {
      slug: "exterior-deep-cleaning",
    },
  ];
}

/*
|--------------------------------------------------------------------------
| Service Detail Page
|--------------------------------------------------------------------------
*/

export default async function ServiceDetails({
  params,
}: ServiceDetailsProps) {
  const { slug } = await params;

  const service = services[slug as ServiceSlug];

  /*
  |--------------------------------------------------------------------------
  | Fallback
  |--------------------------------------------------------------------------
  */

  if (!service) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
            <ShieldCheck className="h-10 w-10 text-teal-700" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Service Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The service you are looking for is currently unavailable.
          </p>

          <a
            href="/services"
            className="mt-7 inline-flex rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800"
          >
            View All Services
          </a>

        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">

      {/* =========================================================
          BREADCRUMB
      ========================================================== */}

      <div className="border-b bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-sm text-gray-500">

          <a
            href="/"
            className="transition hover:text-teal-700"
          >
            Home
          </a>

          <span className="mx-2">/</span>

          <a
            href="/services"
            className="transition hover:text-teal-700"
          >
            Service
          </a>

          <span className="mx-2">/</span>

          <span className="font-medium text-gray-900">
            {service.name}
          </span>

        </div>
      </div>

      {/* =========================================================
          MAIN SERVICE SECTION
      ========================================================== */}

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">

          {/* =====================================================
              SERVICE IMAGE
          ====================================================== */}

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="aspect-square bg-gradient-to-br from-teal-700 via-teal-800 to-slate-800">

              <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white/80">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck className="h-10 w-10" />
                </div>

                <p className="mt-5 text-lg font-semibold">
                  {service.name}
                </p>

                <p className="mt-2 text-sm text-white/60">
                  Service image coming soon
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              SERVICE DETAILS
          ====================================================== */}

          <div className="flex flex-col justify-center">

            {/* Category */}

            <p className="text-sm font-bold uppercase tracking-[2px] text-teal-700">
              {service.category}
            </p>

            {/* Title */}

            <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              {service.name}
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
              {service.description}
            </p>

            {/* Price */}

            <div className="mt-7">

              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Starting From
              </p>

              <div className="mt-1 text-3xl font-bold text-teal-700">
                {service.price}
              </div>

            </div>

            {/* =================================================
                FEATURES
            ================================================== */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <Feature
                icon={<Check />}
                text="Professional service"
              />

              <Feature
                icon={<Clock3 />}
                text="Convenient scheduling"
              />

              <Feature
                icon={<MapPin />}
                text="Doorstep service"
              />

              <Feature
                icon={<ShieldCheck />}
                text="Quality assured"
              />

            </div>

            {/* =================================================
                BOOKING CARD
            ================================================== */}

            <div className="mt-9 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

              <h2 className="font-bold text-gray-900">
                Select Service
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose this service and continue with your booking.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-teal-700 px-6 py-3.5 font-bold text-white transition hover:bg-teal-800"
              >
                Book Now
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          SERVICE INFORMATION
      ========================================================== */}

      <section className="border-t bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-700">
              OwnWash Service
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Professional Cleaning at Your Doorstep
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Get convenient professional cleaning services at your
              doorstep. Select a suitable service, choose your preferred
              schedule and continue with your booking.
            </p>

          </div>

        </div>
      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Feature Component
|--------------------------------------------------------------------------
*/

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        {icon}
      </div>

      <span className="text-sm font-medium text-gray-700">
        {text}
      </span>

    </div>
  );
}