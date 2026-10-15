import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Play,
} from "lucide-react";

export default function GreatChoice() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
              Great Choice
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              See why Ownwash is
              <span className="block text-teal-700">
                India’s go-to for doorstep car washing.
              </span>
            </h2>

            <p className="mt-5 max-w-3xl leading-7 text-gray-600">
              You care about your car, and so do we. Ownwash makes
              doorstep car washing convenient, professional and
              hassle-free, with trained cleaners coming directly to
              your location.
            </p>

            {/* Videos */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <VideoCard />
              <VideoCard />
            </div>
          </div>

          {/* Customer Support */}
          <aside className="rounded-2xl bg-teal-800 p-7 text-white">
            <h3 className="text-2xl font-bold">
              Customer Support
            </h3>

            <div className="mt-7 space-y-6">
              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-sm text-teal-200">Mobile :</p>
                  <a
                    href="tel:+917286082860"
                    className="font-semibold hover:underline"
                  >
                    72860 82860
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-sm text-teal-200">Email :</p>
                  <a
                    href="mailto:support@ownwash.com"
                    className="font-semibold hover:underline"
                  >
                    support@ownwash.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-sm text-teal-200">
                    Registred Address
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    At: 305, Satguru Parinay,
                    <br />
                    Vijay Nagar, Indore,
                    <br />
                    Madhya Pradesh - 452010
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock3 className="mt-1 h-5 w-5 shrink-0" />

                <div>
                  <p className="text-sm text-teal-200">
                    Service Time
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    Tuesday - Sunday : 07 : 00 AM - 05 : 00 PM
                    <br />
                    Monday (Only as per your special Request)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="font-semibold">Stay connected</p>

              <div className="mt-4 flex gap-3">
                {["f", "◎", "▶"].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-bold transition hover:bg-white hover:text-teal-800"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function VideoCard() {
  return (
    <div className="group relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-teal-800">
      <div className="flex h-full items-center justify-center">
        <button
          type="button"
          aria-label="Play Ownwash video"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-700 shadow-xl transition group-hover:scale-110"
        >
          <Play className="ml-1 h-6 w-6 fill-current" />
        </button>
      </div>
    </div>
  );
}