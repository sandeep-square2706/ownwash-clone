"use client";

import { useState } from "react";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { services } from "@/lib/services";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
            We’re here to help
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Contact CleanKart</h1>
          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Tell us what you need cleaned and where you’re located. We’ll help you
            find the right service.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-3xl bg-blue-950 p-6 text-white sm:p-8">
            <h2 className="text-2xl font-bold">How can we help?</h2>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Ask about a service, a booking option or a partnership enquiry.
            </p>
            <div className="mt-8 space-y-5">
              <ContactNote
                icon={<MessageCircle />}
                title="Service questions"
                text="Share the service you’re considering and we’ll point you in the right direction."
              />
              <ContactNote
                icon={<MapPin />}
                title="Your location"
                text="Include your city or area so the team can understand your request."
              />
              <ContactNote
                icon={<Mail />}
                title="Message"
                text="Use the form to prepare your enquiry for the CleanKart team."
              />
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-blue-950">Send an enquiry</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Your name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="Name"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="you@example.com"
                />
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Service
                <select
                  name="service"
                  defaultValue=""
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="">Choose a service (optional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.slug}>
                      {service.name}
                    </option>
                  ))}
                  <option value="partnership">Franchise or partnership</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Your message
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="Tell us how we can help"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 min-h-12 rounded-full bg-blue-950 px-6 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              Prepare enquiry
            </button>
            {submitted && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900" role="status">
                This frontend preview doesn’t send messages yet. Your enquiry details were not transmitted.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactNote({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-blue-100">{text}</p>
      </div>
    </div>
  );
}
