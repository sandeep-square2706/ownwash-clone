"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import useServiceCatalog from "@/hooks/useServiceCatalog";
import { readCart, readWishlist, subscribeToStore } from "@/lib/client-store";
import { getFeaturedServices, getServicePrice } from "@/lib/services";

const navItems = [
  ["Home", "/"],
  ["Services", "/services"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
  ["Franchise", "/franchise"],
  ["Reviews", "/reviews"],
];

export default function Navbar() {
  const pathname = usePathname();
  const { services: catalog } = useServiceCatalog();
  const featuredServices = getFeaturedServices(catalog);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topServicesOpen, setTopServicesOpen] = useState(false);
  const [mobileTopOpen, setMobileTopOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const syncCounts = () => {
      setCartCount(readCart().reduce((total, item) => total + item.quantity, 0));
      setWishlistCount(readWishlist().length);
    };
    syncCounts();
    return subscribeToStore(syncCounts);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="hidden border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600 sm:block">
        <div className="mx-auto flex h-7 max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <Link href="/account" className="transition hover:text-[var(--brand-blue)]">My account</Link>
            <Link href="/wishlist" className="transition hover:text-[var(--brand-blue)]">Wishlist</Link>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span>English</span>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto flex min-h-[78px] max-w-[1380px] items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="CleanKart home">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/75 bg-white p-0.5 shadow-sm sm:h-14 sm:w-14">
              <Image
                src="/images/logo/cleankart-logo.png"
                alt=""
                width={56}
                height={56}
                priority
                className="h-full w-full object-contain"
              />
            </span>
            <span className="leading-none">
              <span className="block text-[22px] font-black tracking-tight sm:text-[25px]">
                Clean<span className="text-[var(--brand-gold)]">Kart</span>
              </span>
              <span className="mt-1.5 hidden text-[10px] tracking-[0.025em] text-blue-100 sm:block">
                Home · Car · Office Cleaning Services
              </span>
            </span>
          </Link>

          <form action="/services" method="get" role="search" className="hidden min-w-0 flex-1 md:block">
            <div className="flex h-11 items-center rounded-xl border border-white/20 bg-white/10 transition focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20">
              <input
                type="search"
                name="q"
                placeholder="Search for services, categories or care..."
                aria-label="Search cleaning services"
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-blue-100/75"
              />
              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-9 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/15"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="ml-auto hidden shrink-0 items-center gap-4 lg:flex">
            <Link href="/account" className="flex items-center gap-2 transition hover:text-[var(--brand-gold)]">
              <UserRound className="h-6 w-6" aria-hidden="true" />
              <span className="leading-tight"><span className="block text-[10px] text-blue-100">Sign in</span><span className="block text-xs font-semibold">Account</span></span>
            </Link>
            <CountLink href="/wishlist" label="Wishlist" count={wishlistCount}>
              <Heart className="h-6 w-6" />
            </CountLink>
            <CountLink href="/cart" label="Cart" count={cartCount}>
              <ShoppingCart className="h-6 w-6" />
            </CountLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="ml-auto rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <form action="/services" method="get" role="search" className="border-t border-white/10 px-4 py-2.5 md:hidden">
          <label className="flex h-10 items-center rounded-lg border border-white/20 bg-white/10 px-3 text-white focus-within:ring-2 focus-within:ring-white/20">
            <Search className="mr-2 h-4 w-4 shrink-0 text-blue-100" aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Search services"
              aria-label="Search services"
              className="w-full bg-transparent text-sm outline-none placeholder:text-blue-100/75"
            />
          </label>
        </form>
      </div>

      <nav aria-label="Main navigation" className="hidden h-12 border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex h-full max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center gap-7">
            {navItems.map(([name, href]) => (
              <NavLink
                key={href}
                href={href}
                active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
              >
                {name}
              </NavLink>
            ))}
          </div>

          <div className="relative flex h-full items-center" onMouseLeave={() => setTopServicesOpen(false)}>
            <button
              type="button"
              onClick={() => setTopServicesOpen((open) => !open)}
              aria-expanded={topServicesOpen}
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[var(--brand-blue)]"
            >
              Top Services
              <ChevronDown className="h-4 w-4" />
            </button>
            {topServicesOpen && (
              <div className="absolute right-0 top-full z-50 w-[340px] rounded-b-2xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl">
                {featuredServices.map((service) => (
                  <Link
                    key={service.id}
                    href={"/services/" + service.slug}
                    onClick={() => setTopServicesOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-blue-50"
                  >
                    <span className="text-sm font-semibold">{service.name}</span>
                    <span className="text-xs font-medium text-[var(--brand-blue)]">{getServicePrice(service)}</span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  onClick={() => setTopServicesOpen(false)}
                  className="mt-2 flex items-center justify-between rounded-xl bg-[var(--brand-blue)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View all services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col">
            {navItems.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  "border-b border-slate-100 px-3 py-3 text-sm font-semibold " +
                  (pathname === href ? "text-[var(--brand-blue)]" : "text-slate-800")
                }
              >
                {name}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileTopOpen((open) => !open)}
              aria-expanded={mobileTopOpen}
              className="flex items-center justify-between px-3 py-3 text-left text-sm font-semibold text-slate-800"
            >
              Top Services
              <ChevronDown className="h-4 w-4" />
            </button>
            {mobileTopOpen && (
              <div className="rounded-xl bg-slate-50 p-2">
                {featuredServices.map((service) => (
                  <Link
                    key={service.id}
                    href={"/services/" + service.slug}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-800"
                  >
                    {service.name}
                    <span className="text-xs text-[var(--brand-blue)]">{getServicePrice(service)}</span>
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center gap-5 px-3 py-4">
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
                <UserRound className="h-4 w-4" /> Account
              </Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
                <Heart className="h-4 w-4" /> Wishlist ({wishlistCount})
              </Link>
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
                <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function CountLink({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label + ", " + count + " items"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10"
    >
      {children}
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand-gold)] px-1 text-[10px] font-bold text-[var(--brand-navy)]">
        {count}
      </span>
    </Link>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "relative flex h-full items-center text-sm font-semibold transition " +
        (active ? "text-[var(--brand-blue)]" : "text-slate-700 hover:text-[var(--brand-blue)]")
      }
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-gold)]" />}
    </Link>
  );
}
