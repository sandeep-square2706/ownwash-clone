import Link from "next/link";
import { ArrowRight, Droplets } from "lucide-react";

const exploreLinks = [
  ["Services", "/services"],
  ["About CleanKart", "/about"],
  ["Frequently asked questions", "/faq"],
  ["Customer reviews", "/reviews"],
];

const accountLinks = [
  ["Your account", "/account"],
  ["Wishlist", "/wishlist"],
  ["Cart", "/cart"],
  ["Contact us", "/contact"],
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-blue-950">
              <Droplets className="h-6 w-6" />
            </span>
            <span className="text-2xl font-black tracking-tight">
              Clean<span className="text-cyan-300">Kart</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100">
            Doorstep cleaning for your car, home and everyday spaces. Pick a service
            that fits your day and book with ease.
          </p>
        </div>

        <FooterLinks title="Explore" links={exploreLinks} />
        <FooterLinks title="Your CleanKart" links={accountLinks} />

        <div>
          <h2 className="text-base font-bold">Need a hand?</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            Our team can help you choose a service or answer a booking question.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
          >
            Contact CleanKart
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-blue-100">
        © 2026 CleanKart. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h2 className="text-base font-bold">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-blue-100">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="transition hover:text-cyan-200">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
