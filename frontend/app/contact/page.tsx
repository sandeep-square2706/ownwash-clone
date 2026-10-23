
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const COLORS = {
  navy: "#102C5F",
  blue: "#1769E8",
  yellow: "#F4C542",
  pale: "#F0F6FF",
};

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function useCountUp(
  target: number,
  duration = 1400,
  start = false
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let frame = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}

function Stars() {
  return (
    <div
      className="flex items-center justify-center gap-1"
      aria-label="5 star rating"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-[22px] leading-none text-[#F4B544]"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewStats() {
  const section = useReveal();
  const rating = useCountUp(4.7, 1600, section.visible);

  return (
    <div
      ref={section.ref}
      className="grid gap-5 sm:grid-cols-2"
    >
      {/* Review card */}
      <div
        className={[
          "rounded-2xl border border-[#1769E8]/20 bg-white p-7 text-center",
          "shadow-[0_12px_35px_rgba(16,44,95,0.07)]",
          "transition-all duration-700",
          section.visible
            ? "translate-x-0 opacity-100"
            : "translate-x-16 opacity-0",
        ].join(" ")}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: COLORS.pale }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 13c0 5-3.5 8-8 8s-8-3-8-8a8 8 0 0 1 16 0Z" />
            <path d="M12 3v3" />
            <path d="M8.5 8.5 7 7" />
            <path d="m15.5 8.5 1.5-1.5" />
          </svg>
        </div>

        <div className="mt-5 text-5xl font-extrabold tracking-tight text-slate-950">
          {rating.toFixed(1)}+
        </div>

        <Stars />

        <h3
          className="mt-2 text-xl font-semibold"
          style={{ color: COLORS.blue }}
        >
          Review Customer
        </h3>

        <p className="mx-auto mt-2 max-w-[250px] text-sm leading-6 text-slate-600">
          Real feedback from satisfied CleanKart users
        </p>
      </div>

      {/* Quality card */}
      <div
        className={[
          "rounded-2xl border border-[#1769E8]/20 bg-white p-7 text-center",
          "shadow-[0_12px_35px_rgba(16,44,95,0.07)]",
          "transition-all duration-700 delay-150",
          section.visible
            ? "translate-x-0 opacity-100"
            : "translate-x-16 opacity-0",
        ].join(" ")}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: COLORS.pale }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
          </svg>
        </div>

        <div className="mt-5 text-5xl font-extrabold tracking-tight text-slate-950">
          A+
        </div>

        <Stars />

        <h3
          className="mt-2 text-xl font-semibold"
          style={{ color: COLORS.blue }}
        >
          Quality Score
        </h3>

        <p className="mx-auto mt-2 max-w-[250px] text-sm leading-6 text-slate-600">
          Consistently rated for premium service experience
        </p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const hero = useReveal();
  const formSection = useReveal();
  const officeSection = useReveal();

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    window.setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: COLORS.navy }}
      >
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full"
            style={{ backgroundColor: COLORS.yellow }}
          />
          <div
            className="absolute -bottom-56 left-[-100px] h-[500px] w-[500px] rounded-full"
            style={{ backgroundColor: COLORS.blue }}
          />
        </div>

        <div
          ref={hero.ref}
          className="relative mx-auto flex min-h-[250px] max-w-[1380px] items-center px-5 py-16 sm:px-8 lg:min-h-[300px] lg:px-10"
        >
          <div
            className={[
              "max-w-2xl transition-all duration-700",
              hero.visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            ].join(" ")}
          >
            <div className="mb-4 flex items-center gap-3 text-sm font-medium text-blue-100">
              <span>CleanKart Support</span>
              <span
                className="h-px w-24"
                style={{ backgroundColor: COLORS.yellow }}
              />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Contact{" "}
              <span style={{ color: COLORS.yellow }}>
                CleanKart
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
              Have a question about our cleaning services?
              Need help choosing the right service? We are here
              to help.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT FORM + REVIEW CARDS
      ========================================================== */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div
          ref={formSection.ref}
          className="mx-auto max-w-[1380px]"
        >
          <div className="mb-10 border-t border-slate-200 pt-10">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">

              {/* LEFT SIDE */}
              <div
                className={[
                  "transition-all duration-700",
                  formSection.visible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0",
                ].join(" ")}
              >
                <div className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-600">
                  <span>Get in touch</span>
                  <span
                    className="h-px w-24"
                    style={{ backgroundColor: COLORS.blue }}
                  />
                </div>

                <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Feel free to{" "}
                  <span style={{ color: COLORS.blue }}>
                    contact us!
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  We are here to assist you with your cleaning
                  needs — right at your doorstep. Whether you
                  have a quick question, need help choosing a
                  service, or want to know more about CleanKart,
                  our team is ready to help.
                </p>

                <div className="mt-8">
                  <ReviewStats />
                </div>

                {/* Social */}
                <div className="mt-9 flex items-center gap-3">
                  <span className="mr-1 text-sm text-slate-500">
                    Follow us:
                  </span>

                  <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877F2] text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    f
                  </a>

                  <a
                    href="#"
                    aria-label="Twitter"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1DA1F2] text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    𝕏
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    ◎
                  </a>

                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2] text-sm font-bold text-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    in
                  </a>
                </div>
              </div>

              {/* RIGHT SIDE FORM */}
              <div
                className={[
                  "rounded-3xl border border-slate-200 bg-white p-6",
                  "shadow-[0_18px_50px_rgba(16,44,95,0.08)]",
                  "transition-all duration-700 delay-150",
                  formSection.visible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0",
                ].join(" ")}
              >
                <form onSubmit={handleSubmit}>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-800"
                      >
                        Your name <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your name"
                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-800"
                      >
                        Your email <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10"
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="service"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Service
                    </label>

                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option value="car-washing">
                        Deep Car Washing
                      </option>
                      <option value="car-interior">
                        Car Interior Cleaning
                      </option>
                      <option value="kitchen">
                        Kitchen Cleaning
                      </option>
                      <option value="carpet">
                        Carpet Cleaning
                      </option>
                      <option value="sofa">
                        Sofa Cleaning
                      </option>
                      <option value="bike">
                        Bike Foam Wash
                      </option>
                    </select>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Your message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1769E8] focus:ring-4 focus:ring-[#1769E8]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl px-7 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ backgroundColor: COLORS.blue }}
                  >
                    {submitted ? "Message Sent ✓" : "Send Message"}
                  </button>

                  {submitted && (
                    <p className="mt-3 text-sm font-medium text-emerald-600">
                      Thanks! Your message has been received.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          OFFICE SECTION
      ========================================================== */}
      <section className="border-t border-slate-100 bg-[#F8FAFD] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div
          ref={officeSection.ref}
          className="mx-auto max-w-[1380px]"
        >
          <div
            className={[
              "transition-all duration-700",
              officeSection.visible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0",
            ].join(" ")}
          >
            <div className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-600">
              <span>Visit us</span>
              <span
                className="h-px w-24"
                style={{ backgroundColor: COLORS.blue }}
              />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Our{" "}
              <span style={{ color: COLORS.blue }}>
                Office
              </span>
            </h2>

            <div className="mt-9 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

              {/* OFFICE DETAILS */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                <div className="flex gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: COLORS.pale }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={COLORS.blue}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      India
                    </p>

                    <h3
                      className="mt-1 text-xl font-bold"
                      style={{ color: COLORS.navy }}
                    >
                      CleanKart Service Centre
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Professional home and vehicle cleaning
                      services.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="my-7 h-px bg-slate-200" />

                <div className="space-y-5">

                  <div className="flex gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: COLORS.pale }}
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.blue}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Call us
                      </p>

                      <a
                        href="tel:+919999999999"
                        className="mt-1 block text-base font-bold text-slate-900 hover:text-[#1769E8]"
                      >
                        +91 99999 99999
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: COLORS.pale }}
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={COLORS.blue}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="16"
                          x="2"
                          y="4"
                          rx="2"
                        />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Email
                      </p>

                      <a
                        href="mailto:support@cleankart.in"
                        className="mt-1 block text-base font-bold text-[#1769E8]"
                      >
                        support@cleankart.in
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href="#contact-form"
                  className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: COLORS.blue }}
                >
                  Get directions
                </a>
              </div>

              {/* MAP */}
              <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="absolute inset-0 bg-[#EAF1FA]">

                  {/* Fake map styling so there is no API key requirement */}
                  <div className="absolute inset-0 opacity-70">
                    <div className="absolute left-[8%] top-[20%] h-[2px] w-[90%] rotate-[15deg] bg-white" />
                    <div className="absolute left-[15%] top-[55%] h-[3px] w-[80%] rotate-[-12deg] bg-white" />
                    <div className="absolute left-[35%] top-[5%] h-[110%] w-[3px] rotate-[23deg] bg-white" />
                    <div className="absolute left-[62%] top-[-10%] h-[120%] w-[3px] rotate-[-17deg] bg-white" />

                    <div className="absolute left-[10%] top-[35%] h-32 w-32 rounded-full bg-[#D8E8D8]" />
                    <div className="absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-[#DDECD8]" />
                    <div className="absolute bottom-[8%] left-[35%] h-36 w-52 rounded-full bg-[#DDECD8]" />
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: COLORS.blue }}
                      >
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="absolute left-1/2 top-[70px] -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: COLORS.navy }}
                    >
                      CleanKart
                    </div>
                  </div>

                  <div className="absolute left-5 top-5 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#1769E8] shadow-md">
                    CleanKart Service Centre
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================== */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div
          className="mx-auto max-w-[1380px] overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-10 sm:py-16"
          style={{ backgroundColor: COLORS.navy }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: COLORS.yellow }}
          >
            Need a cleaner space?
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Let CleanKart take care of the cleaning.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Choose a service, select a convenient time, and
            enjoy professional cleaning right at your doorstep.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: COLORS.yellow }}
            >
              Explore Services
            </Link>

            <a
              href="#"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Chat with us
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          FLOATING HELP BUTTON
      ========================================================== */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with CleanKart on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition hover:scale-110 sm:bottom-7 sm:right-7"
      >
        <svg
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-12.7 7.3L3 20l1.2-5A8.4 8.4 0 1 1 21 11.5Z" />
          <path d="M8.5 9.5c.2 2 2 3.8 4 4 .5.1 1-.1 1.3-.5l.5-.6" />
        </svg>
      </a>
    </main>
  );
}
