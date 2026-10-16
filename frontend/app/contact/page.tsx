import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-gray-50">

      <section className="bg-[#0C706A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Contact Us
          </h1>

        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">

          <div className="rounded-2xl bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Customer Support
            </h2>

            <div className="mt-7 space-y-6">

              <ContactItem
                icon={<Phone />}
                title="Mobile"
                value="72860 82860"
              />

              <ContactItem
                icon={<Mail />}
                title="Email"
                value="support@ownwash.com"
              />

              <ContactItem
                icon={<MapPin />}
                title="Registered Address"
                value="At: 305, Satguru Parinay, Vijay Nagar, Indore, Madhya Pradesh - 452010"
              />

            </div>

          </div>

          <form className="rounded-2xl bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <div className="mt-6 space-y-4">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-teal-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-teal-600"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-teal-600"
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-teal-600"
              />

              <button
                type="button"
                className="w-full rounded-lg bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800"
              >
                Send Message
              </button>

            </div>

          </form>

        </div>
      </section>

    </main>
  );
}

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}