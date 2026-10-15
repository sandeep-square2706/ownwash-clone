import {
  Car,
  Home,
  Armchair,
  CookingPot,
  Layers3,
  Sparkles,
} from "lucide-react";

const addOns = [
  {
    title: "Deep Washing",
    icon: Car,
  },
  {
    title: "Kitchen Cleaning",
    icon: CookingPot,
  },
  {
    title: "Interior Cleaning",
    icon: Sparkles,
  },
  {
    title: "Carpet Cleaing",
    icon: Layers3,
  },
  {
    title: "Sofa-Dry Cleaning",
    icon: Armchair,
  },
  {
    title: "Home Cleaning",
    icon: Home,
  },
];

export default function AddOns() {
  return (
    <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        <div className="mb-9 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Add-ons to Elevate Your Clean
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {addOns.map(({ title, icon: Icon }) => (
            <button
              key={title}
              type="button"
              className="group flex min-h-[155px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-900">
                {title}
              </h3>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}