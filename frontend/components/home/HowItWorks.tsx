import {
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Service",
    description:
      "Select the service you need and choose a convenient time.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Confirm Your Booking",
    description:
      "Add your address, choose a preferred time slot and confirm your booking.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "We Arrive",
    description:
      "Our expert arrives with the required equipment and cleaning products.",
    icon: MapPin,
  },
  {
    number: "04",
    title: "Sit Back & Relax",
    description:
      "We clean while you relax and enjoy a spotless experience.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">

        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-blue-700">
            Our Process
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
            How it works
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="relative text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-900">
                <Icon className="h-9 w-9" />
              </div>

              <span className="mt-4 inline-block text-xs font-bold tracking-widest text-blue-700">
                STEP {number}
              </span>

              <h3 className="mt-2 text-lg font-bold text-blue-950">
                {title}
              </h3>

              <p className="mx-auto mt-3 max-w-[240px] text-sm leading-6 text-gray-600">
                {description}
              </p>

              {number !== "04" && (
                <div className="absolute left-[calc(50%+55px)] right-[calc(-50%+55px)] top-10 hidden border-t border-dashed border-blue-100 md:block" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
