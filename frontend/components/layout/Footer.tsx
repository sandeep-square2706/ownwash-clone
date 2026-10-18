"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const exploreLinks = [
  ["Services", "/services"],
  ["About CleanKart", "/about"],
  ["Frequently asked questions", "/faq"],
  ["Customer reviews", "/reviews"],
  ["Privacy overview", "/privacy"],
  ["Terms of use", "/terms"],
];

const accountLinks = [
  ["Your account", "/account"],
  ["Wishlist", "/wishlist"],
  ["Cart", "/cart"],
  ["Contact us", "/contact"],
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-blue-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/images/cleankart-logo.png" alt="" width={56} height={56} className="h-14 w-14 object-contain" />
            <span className="text-2xl font-black tracking-tight">
              Clean<span className="text-blue-300">Kart</span>
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
          <h2 className="text-base font-bold">Stay connected</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            Get occasional cleaning tips and CleanKart service updates.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-300/30"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="mt-2 text-xs leading-5 text-blue-200" role="status">
              Signup preview only. Your email was not sent or saved.
            </p>
          )}
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
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
            <Link href={href} className="transition hover:text-blue-100">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
