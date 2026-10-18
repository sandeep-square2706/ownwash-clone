"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, MapPin, ShieldCheck } from "lucide-react";

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">CleanKart partnerships</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Bring CleanKart to your community.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Tell us where you’d like to work with CleanKart. This preview prepares an enquiry form only; it does not submit or store your details.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-blue-950">What happens next</h2>
            <ol className="mt-5 space-y-5">
              <PartnerStep number="01" title="Share your interest" text="Tell us your city and the kind of partnership you’re exploring." />
              <PartnerStep number="02" title="Discuss the opportunity" text="A CleanKart team member can follow up after partner enquiries are connected." />
              <PartnerStep number="03" title="Secure onboarding" text="Identity and bank documents should only be collected through a verified, protected partner portal." />
            </ol>
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-blue-50 p-4 text-xs leading-5 text-blue-950">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
              This page does not request PAN, Aadhaar, driving licence or bank documents.
            </p>
          </aside>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-blue-950">Partner interest form</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Fields stay in this page and are cleared when you leave.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Your name
                <input required name="name" autoComplete="name" placeholder="Full name" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Email address
                <input required type="email" name="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Mobile number
                <input required type="tel" name="phone" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="tel-national" placeholder="10-digit mobile number" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                City or service area
                <span className="relative mt-2 block">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input required name="city" autoComplete="address-level2" placeholder="City or area" className="h-12 w-full rounded-xl border border-slate-200 pl-9 pr-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </span>
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold text-slate-700">What are you interested in?</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {[
                    ["local-partner", "Local service partner"],
                    ["franchise", "Franchise opportunity"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 hover:bg-blue-50/50">
                      <input type="radio" name="partnershipType" value={value} defaultChecked={value === "local-partner"} className="h-4 w-4 accent-blue-600" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                A little about your experience <span className="font-normal text-slate-500">(optional)</span>
                <textarea name="experience" rows={4} placeholder="Tell us about your local service or business experience" className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
            </div>

            <button type="submit" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Prepare enquiry <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {submitted && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900" role="status">
                Partner enquiries are not connected yet. Nothing was sent or saved; please contact CleanKart when you’re ready to share your details.
              </p>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Prefer a general question? <Link href="/contact" className="font-semibold text-blue-700 underline underline-offset-2">Contact CleanKart</Link>.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function PartnerStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{number}</span>
      <div>
        <h3 className="text-sm font-bold text-blue-950">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">{text}</p>
      </div>
    </li>
  );
}
