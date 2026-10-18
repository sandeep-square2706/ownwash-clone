"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Saktikant Das",
    service: "Car Washing",
    initials: "SD",
    review:
      "CleanKart's doorstep car washing service is convenient and professional. The team arrived on time and cleaned the car very well.",
  },
  {
    name: "Saket",
    service: "Foam Washing",
    initials: "SK",
    review:
      "CleanKart's foam washing made the car spotless. The team cleaned difficult areas carefully and the service was convenient at home.",
  },
  {
    name: "Anjali",
    service: "Sofa Dry Cleaning",
    initials: "AN",
    review:
      "The sofa dry cleaning service was impressive. Stains were removed effectively and the service was completed on time at home.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const previous = () => {
    setActive((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const next = () => {
    setActive((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              Testimonials
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-950 sm:text-4xl">
              What customers say
            </h2>
          </div>

          {/* Arrows */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition hover:bg-blue-950 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition hover:bg-blue-950 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${
                index === active ? "ring-1 ring-blue-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-900">
                  {testimonial.initials}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {testimonial.service}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                “{testimonial.review}”
              </p>
            </article>
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={previous}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
