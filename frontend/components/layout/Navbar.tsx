"use client";

import Link from "next/link";
import Image from "next/image";
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

import { readCart, readWishlist, subscribeToStore } from "@/lib/client-store";
import useServiceCatalog from "@/hooks/useServiceCatalog";
import { getFeaturedServices, getServicePrice } from "@/lib/services";

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

  const navItems = [
    ["Home", "/"],
    ["Services", "/services"],
    ["About", "/about"],
    ["Contact", "/contact"],
    ["Franchise", "/franchise"],
    ["Reviews", "/reviews"],
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-white text-blue-950">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="CleanKart home">
            <Image src="/images/logo/cleankart-logo.png" alt="" width={52} height={52} priority className="h-12 w-12 object-contain" />
            <span>
              <span className="block text-[25px] font-black leading-none tracking-tight">
                Clean<span className="text-blue-600">Kart</span>
              </span>
              <span className="mt-1 block text-[10px] tracking-[0.08em] text-slate-500">
                Home · Car · Office Cleaning Services
              </span>
            </span>
          </Link>

          <form
            action="/services"
            method="get"
            className="hidden min-w-0 flex-1 md:block"
            role="search"
          >
            <label className="flex h-11 items-center rounded-xl border border-blue-100 bg-blue-50/60 px-4 text-slate-700 focus-within:ring-2 focus-within:ring-blue-200">
              <Search className="mr-3 h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="search"
                name="q"
                placeholder="Search cleaning services"
                aria-label="Search cleaning services"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </label>
          </form>

          <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
            <Link href="/account" className="flex items-center gap-2 hover:text-blue-700">
              <UserRound className="h-5 w-5" />
              <span className="text-sm font-semibold">Account</span>
            </Link>
            <CountLink href="/wishlist" label="Wishlist" count={wishlistCount}>
              <Heart className="h-5 w-5" />
            </CountLink>
            <CountLink href="/cart" label="Cart" count={cartCount}>
              <ShoppingCart className="h-5 w-5" />
            </CountLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="ml-auto rounded-lg p-2 text-blue-950 transition hover:bg-blue-50 lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <form action="/services" method="get" className="border-t border-blue-100 px-4 py-3 md:hidden">
          <label className="flex h-10 items-center rounded-xl border border-blue-100 bg-blue-50/60 px-3 text-slate-700">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search services"
              aria-label="Search services"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </form>
      </div>

      <nav className="hidden h-12 border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
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

          <div
            className="relative flex h-full items-center"
            onMouseLeave={() => setTopServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setTopServicesOpen((open) => !open)}
              aria-expanded={topServicesOpen}
              className="flex items-center gap-2 text-sm font-semibold text-blue-950 transition hover:text-blue-700"
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
                    <span className="text-xs font-medium text-blue-900">
                      {getServicePrice(service)}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  onClick={() => setTopServicesOpen(false)}
                  className="mt-2 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
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
        <nav className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col">
            {navItems.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  "border-b border-slate-100 px-3 py-3 text-sm font-semibold " +
                  (pathname === href ? "text-blue-700" : "text-slate-800")
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
                    <span className="text-xs text-blue-900">
                      {getServicePrice(service)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center gap-5 px-3 py-4">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-950"
              >
                <UserRound className="h-4 w-4" /> Account
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-950"
              >
                <Heart className="h-4 w-4" /> Wishlist ({wishlistCount})
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-950"
              >
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
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-blue-50"
    >
      {children}
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
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
        (active ? "text-blue-950" : "text-slate-600 hover:text-blue-900")
      }
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
    </Link>
  );
}
