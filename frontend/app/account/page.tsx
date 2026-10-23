"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  ClipboardList,
  Heart,
  LogOut,
  MapPin,
  Package,
  UserRound,
  Sparkles,
} from "lucide-react";

import {
  clearAuth,
  getCurrentUserData,
  getStoredCustomerName,
} from "@/lib/auth";

import { useRouter } from "next/navigation";

type AccountSection =
  | "dashboard"
  | "addresses"
  | "details";

export default function AccountPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] =
    useState<AccountSection>("dashboard");

  const [customerName, setCustomerName] =
    useState("Customer");

  useEffect(() => {
    const user = getCurrentUserData();

    if (!user) {
      router.push("/login");
      return;
    }

    const storedName =
      getStoredCustomerName(user.email);

    const name =
      storedName ||
      user.username ||
      "Customer";

    setCustomerName(name);
  }, [router]);

  function handleLogout() {
    clearAuth();

    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-[75vh] bg-[#f5f8fd] text-slate-950">

      <div className="mx-auto max-w-[1380px] px-4 py-7 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">
              Home
            </span>

            <span className="text-slate-300">
              ›
            </span>

            <span className="font-medium text-slate-900">
              My account
            </span>
          </div>
        </div>

        {/* Welcome row */}
        <section className="flex items-center gap-4 py-7">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--brand-navy)] shadow-sm ring-1 ring-slate-200">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Welcome back,
            </p>

            <h1 className="text-lg font-bold text-[var(--brand-navy)]">
              {customerName}
            </h1>
          </div>

        </section>

        <section className="grid gap-6 lg:grid-cols-[252px_1fr]">

          {/* LEFT SIDEBAR */}
          <aside>

            <nav className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <AccountMenuItem
                label="Dashboard"
                icon={<UserRound />}
                active={
                  activeSection ===
                  "dashboard"
                }
                onClick={() =>
                  setActiveSection(
                    "dashboard",
                  )
                }
              />

              <AccountMenuItem
                label="Addresses"
                icon={<MapPin />}
                active={
                  activeSection ===
                  "addresses"
                }
                onClick={() =>
                  setActiveSection(
                    "addresses",
                  )
                }
              />

              <AccountMenuItem
                label="Account details"
                icon={<UserRound />}
                active={
                  activeSection ===
                  "details"
                }
                onClick={() =>
                  setActiveSection(
                    "details",
                  )
                }
              />

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 w-full items-center gap-3 border-t border-slate-200 px-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />

                Log out
              </button>

            </nav>

            {/* SIDE CTA */}
            <div className="mt-5 rounded-2xl bg-[var(--brand-navy)] p-5 text-white shadow-lg">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[var(--brand-gold)]">
                <Sparkles className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-base font-bold">
                Need a cleaning service?
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Book your next home or vehicle
                cleaning service in just a few
                clicks.
              </p>

              <a
                href="/services"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[var(--brand-gold)]"
              >
                Browse services

                <ArrowRight className="h-4 w-4" />
              </a>

            </div>

          </aside>

          {/* RIGHT CONTENT */}
          <div className="min-w-0">

            {activeSection ===
              "dashboard" && (
              <DashboardContent
                customerName={
                  customerName
                }
                onOpenAddresses={() =>
                  setActiveSection(
                    "addresses",
                  )
                }
                onOpenDetails={() =>
                  setActiveSection(
                    "details",
                  )
                }
              />
            )}

            {activeSection ===
              "addresses" && (
              <AddressesContent />
            )}

            {activeSection ===
              "details" && (
              <DetailsContent
                customerName={
                  customerName
                }
              />
            )}

          </div>

        </section>

      </div>

    </main>
  );
}


/* -------------------------------------------------------
   LEFT MENU ITEM
------------------------------------------------------- */

function AccountMenuItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center gap-3 border-b border-slate-200 px-4 text-left text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-[var(--brand-blue)]"
          : "text-slate-900 hover:bg-slate-50 hover:text-[var(--brand-blue)]"
      }`}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>

      {label}
    </button>
  );
}


/* -------------------------------------------------------
   DASHBOARD
------------------------------------------------------- */

function DashboardContent({
  customerName,
  onOpenAddresses,
  onOpenDetails,
}: {
  customerName: string;
  onOpenAddresses: () => void;
  onOpenDetails: () => void;
}) {
  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[var(--brand-navy)] via-[#173d7d] to-[var(--brand-blue)] px-7 py-8 text-white shadow-[0_18px_45px_rgba(16,44,95,0.20)] sm:px-8 sm:py-9">

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-gold)]">
            CleanKart Dashboard
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Hello {customerName} 👋
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Manage your cleaning services,
            orders, saved addresses and
            personal details from one place.
          </p>

        </div>

      </section>


      {/* DASHBOARD CARDS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <DashboardCard
          icon={<Package />}
          title="Orders"
          description="View your recent orders and service history."
          action="Open orders"
          href="/orders"
        />

        <DashboardCard
          icon={<Heart />}
          title="Wishlist"
          description="View the cleaning services you have saved."
          action="Open wishlist"
          href="/wishlist"
        />

        <DashboardCard
          icon={<ClipboardList />}
          title="Downloads"
          description="Access your service documents and downloads."
          action="Open downloads"
          href="/downloads"
        />

        <DashboardCard
          icon={<MapPin />}
          title="Addresses"
          description="Manage the addresses used for your cleaning services."
          action="Manage addresses"
          onClick={onOpenAddresses}
        />

        <DashboardCard
          icon={<UserRound />}
          title="Account details"
          description="Update your personal account information."
          action="Open details"
          onClick={onOpenDetails}
        />

        {/* BOOK SERVICE CARD */}
        <div className="group flex min-h-[205px] flex-col rounded-2xl bg-[var(--brand-blue)] p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-[var(--brand-gold)]">
            <Sparkles className="h-5 w-5" />
          </span>

          <h3 className="mt-5 text-xl font-bold">
            Book a service
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-blue-50">
            Browse CleanKart home and vehicle
            cleaning services.
          </p>

          <a
            href="/services"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white"
          >
            Browse services

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

        </div>

      </div>

    </div>
  );
}


/* -------------------------------------------------------
   DASHBOARD CARD
------------------------------------------------------- */

function DashboardCard({
  icon,
  title,
  description,
  action,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--brand-blue)] transition group-hover:bg-blue-100">
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      </span>

      <h3 className="mt-5 text-xl font-bold text-[var(--brand-navy)]">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]">
        {action}

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex min-h-[205px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[205px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      {content}
    </button>
  );
}


/* -------------------------------------------------------
   ADDRESSES
------------------------------------------------------- */

function AddressesContent() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--brand-blue)]">
            <MapPin className="h-6 w-6" />
          </span>

          <div>
            <h2 className="text-2xl font-bold text-[var(--brand-navy)]">
              Addresses
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Manage the addresses used for
              your cleaning services.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-blue)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-navy)]"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Add address
        </button>

      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">

          <MapPin className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-bold text-slate-900">
            No new address
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your saved service addresses
            will appear here.
          </p>

        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-7">

          <Sparkles className="h-7 w-7 text-[var(--brand-blue)]" />

          <h3 className="mt-4 font-bold text-[var(--brand-navy)]">
            Faster bookings
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Save your home, office or vehicle
            location to make your next
            booking quicker.
          </p>

        </div>

      </div>

    </section>
  );
}


/* -------------------------------------------------------
   ACCOUNT DETAILS
------------------------------------------------------- */

function DetailsContent({
  customerName,
}: {
  customerName: string;
}) {
  const user = getCurrentUserData();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      <div className="flex items-start gap-4">

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--brand-blue)]">
          <UserRound className="h-6 w-6" />
        </span>

        <div>
          <h2 className="text-2xl font-bold text-[var(--brand-navy)]">
            Account details
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            View your CleanKart account
            information.
          </p>
        </div>

      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">

        <DetailBox
          label="Full name"
          value={customerName}
        />

        <DetailBox
          label="Email address"
          value={
            user?.email ||
            "Not available"
          }
        />

        <DetailBox
          label="Phone number"
          value={
            user?.phone ||
            "Not added"
          }
        />

        <DetailBox
          label="Account type"
          value={
            user?.role ||
            "Customer"
          }
        />

      </div>

    </section>
  );
}


/* -------------------------------------------------------
   DETAIL BOX
------------------------------------------------------- */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}