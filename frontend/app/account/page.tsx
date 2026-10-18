"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ClipboardList, Heart, MapPin, ShieldCheck, UserRound } from "lucide-react";

export default function AccountPage() {
  const [attemptedSignIn, setAttemptedSignIn] = useState(false);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">CleanKart account</p>
        <h1 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">Your account</h1>
        <p className="mt-3 max-w-2xl leading-6 text-slate-600">
          Sign in to manage bookings, saved services and your details when account access is connected.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-blue-950">Sign in or create an account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use your mobile number to get started once secure sign-in is available.
            </p>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                setAttemptedSignIn(true);
              }}
            >
              <label htmlFor="account-phone" className="text-sm font-semibold text-slate-700">
                Mobile number
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="account-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  placeholder="10-digit mobile number"
                  className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
            {attemptedSignIn && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900" role="status">
                Sign-in is not connected yet. No OTP was sent and your number was not saved.
              </p>
            )}
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              Your details will only be used after secure account services are connected.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <AccountCard
              icon={<ClipboardList />}
              title="My bookings"
              description="Confirmed appointments and service history will appear here."
              action="Browse services"
              href="/services"
            />
            <AccountCard
              icon={<Heart />}
              title="Saved services"
              description="Keep services you may want to book in one place."
              action="Open wishlist"
              href="/wishlist"
            />
            <AccountCard
              icon={<MapPin />}
              title="Saved addresses"
              description="Add an address during checkout when live booking is enabled."
              action="Start a booking"
              href="/services"
            />
            <AccountCard
              icon={<UserRound />}
              title="Personal details"
              description="Your profile settings will be available after sign-in is connected."
              action="Contact support"
              href="/contact"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function AccountCard({
  icon,
  title,
  description,
  action,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <h2 className="mt-4 text-lg font-bold text-blue-950">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
        {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
