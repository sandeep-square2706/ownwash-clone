import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Foam Washing",
    description:
      "Professional foam-based exterior cleaning that removes dirt while giving your vehicle a fresh shine.",
    price: "₹399",
    category: "Car Washing",
  },
  {
    title: "Interior Deep Cleaning",
    description:
      "Deep interior cleaning for seats, carpets, dashboard and other areas of your car.",
    price: "₹599 – ₹899",
    category: "Interior",
  },
  {
    title: "Steam Washing",
    description:
      "Steam-powered cleaning designed to refresh your vehicle while helping remove odour and bacteria.",
    price: "₹599 – ₹799",
    category: "Car Washing",
  },
  {
    title: "Full Car Detailing",
    description:
      "Complete interior and exterior detailing for a premium, polished vehicle finish.",
    price: "₹899 – ₹1,599",
    category: "Detailing",
  },
  {
    title: "Exterior Deep Cleaning",
    description:
      "Detailed exterior cleaning to remove stubborn dirt and restore your vehicle's appearance.",
    price: "₹599 – ₹899",
    category: "Exterior",
  },
];

export default function TopServices() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">

        {/* Heading */}
        <div className="mb-9 text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-600">
            Professional Cleaning
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Top Services
          </h2>
        </div>

        {/* Services */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              price={service.price}
              category={service.category}
            />
          ))}
        </div>

      </div>
    </section>
  );
}