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
  ["Franchise opportunities", "/franchise"],
  ["Partner with CleanKart", "/partner"],
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
    <footer className="bg-[var(--brand-navy)] text-white">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="CleanKart home">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/75 bg-white p-0.5">
              <Image src="/images/logo/cleankart-logo.png" alt="" width={56} height={56} className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-[26px] font-black leading-none tracking-tight">
                Clean<span className="text-[var(--brand-gold)]">Kart</span>
              </span>
              <span className="mt-1.5 block text-[10px] text-blue-100">Home · Car · Office Cleaning Services</span>
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
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-blue-200 focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
            />
            <button type="submit" className="rounded-xl bg-[var(--brand-gold)] px-3 text-sm font-bold text-[var(--brand-navy)] transition hover:bg-amber-300">
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
        <div className="border-t border-white/10 bg-[#0b2450] px-4 py-4 text-center text-xs text-blue-100">
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
