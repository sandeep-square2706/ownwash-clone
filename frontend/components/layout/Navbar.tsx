"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* =========================
          MAIN TEAL HEADER
      ========================== */}
      <div className="bg-[#0C706A] text-white">
        <div className="mx-auto flex h-[58px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-12">

          {/* LOGO */}
          <Link
            href="/"
            className="flex w-[220px] shrink-0 flex-col justify-center"
          >
            <div className="text-[30px] font-black leading-none tracking-[-1.5px]">
              Ownwash
              <sup className="ml-0.5 align-top text-[8px]">®</sup>
            </div>

            <div className="ml-[40px] mt-0.5 text-[7px] tracking-[0.8px] text-white/90">
              The Art of Detailing
            </div>
          </Link>

          {/* SEARCH */}
          <div className="hidden flex-1 px-3 md:block">
            <div className="flex h-[44px] items-center rounded-[8px] border border-white/20 bg-[#1F7B76] px-4">

              <input
                type="search"
                placeholder="Search for products, categories or brands..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white"
              />

              <Search className="ml-3 h-[24px] w-[24px] shrink-0 text-white" />
            </div>
          </div>

          {/* ACCOUNT / WISHLIST / CART */}
          <div className="hidden shrink-0 items-center gap-5 lg:flex">

            {/* Account */}
            <Link
              href="/account"
              className="flex items-center gap-2"
            >
              <UserRound className="h-[25px] w-[25px]" />

              <div className="leading-none">
                <div className="text-[10px] text-white/80">
                  Sign In
                </div>

                <div className="mt-0.5 text-[13px] font-semibold">
                  Account
                </div>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative"
            >
              <Heart className="h-[25px] w-[25px]" />

              <span className="absolute -right-[7px] -top-[7px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative"
            >
              <ShoppingCart className="h-[25px] w-[25px]" />

              <span className="absolute -right-[7px] -top-[7px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                0
              </span>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="ml-auto rounded-md p-2 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* MOBILE SEARCH */}
        <div className="border-t border-white/10 px-4 py-2.5 md:hidden">
          <div className="flex h-10 items-center rounded-md bg-white px-3">
            <Search className="mr-2 h-4 w-4 text-gray-500" />

            <input
              type="search"
              placeholder="Search for products, categories or brands..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* =========================
          WHITE NAVIGATION
      ========================== */}
      <nav className="hidden h-[44px] border-b border-gray-200 bg-white lg:block">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-12">

          {/* LEFT NAVIGATION */}
          <div className="flex h-full items-center gap-[30px]">

            <NavLink
              href="/"
              active
            >
              Home
            </NavLink>

            <NavLink href="/services">
              Service
            </NavLink>

            <NavLink href="/about">
              About Us
            </NavLink>

            <NavLink href="/contact">
              Contact
            </NavLink>

            <NavLink href="/franchise">
              Franchise
            </NavLink>

            <NavLink href="/reviews">
              Review
            </NavLink>
          </div>

          {/* TOP SERVICES */}
          <button
            type="button"
            className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 transition hover:text-[#0C706A]"
          >
            Top Services
            <ChevronDown className="h-[16px] w-[16px]" />
          </button>
        </div>
      </nav>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      {mobileMenuOpen && (
        <nav className="border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col">

            {[
              ["Home", "/"],
              ["Service", "/services"],
              ["About Us", "/about"],
              ["Contact", "/contact"],
              ["Franchise", "/franchise"],
              ["Review", "/reviews"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-gray-100 px-3 py-3 text-sm font-semibold text-gray-800 transition hover:bg-teal-50 hover:text-[#0C706A]"
              >
                {name}
              </Link>
            ))}

            <button
              type="button"
              className="flex items-center justify-between px-3 py-3 text-left text-sm font-semibold text-gray-800"
            >
              Top Services
              <ChevronDown className="h-4 w-4" />
            </button>

          </div>
        </nav>
      )}
    </header>
  );
}


/* =================================
   NAVIGATION LINK
================================= */

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex h-full items-center text-[14px] font-semibold transition ${
        active
          ? "text-[#2A9D96]"
          : "text-gray-900 hover:text-[#0C706A]"
      }`}
    >
      {children}

      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2A9D96]" />
      )}
    </Link>
  );
}