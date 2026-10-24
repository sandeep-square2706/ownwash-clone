"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = {
  name: string;
  service: string;
  text: string;
  rating: number;
  avatar: string;
};

const customerReviews: Review[] = [
  {
    name: "Sakthikant Das",
    service: "Car Washing",
    text: "CleanKart's doorstep car washing service is super convenient. The team arrived on time, used quality products, and cleaned my car perfectly without any mess. Very professional service.",
    rating: 5,
    avatar: "👨🏻‍💼",
  },
  {
    name: "Anjali",
    service: "Sofa Dry Cleaning",
    text: "I booked CleanKart for sofa dry cleaning and was really impressed. The stains were removed properly and the sofa looked fresh again. Great service and very convenient.",
    rating: 5,
    avatar: "👩🏻",
  },
  {
    name: "Sameer",
    service: "Water Tank Cleaning",
    text: "The CleanKart team did a thorough job cleaning our water tank. Everything was handled professionally and there was no mess left behind. Highly recommended.",
    rating: 5,
    avatar: "👨🏻‍💼",
  },
  {
    name: "Kavita",
    service: "AC Service",
    text: "The AC service was excellent. The team cleaned the filters properly and checked everything carefully. My AC is working much better now and the service was hassle-free.",
    rating: 5,
    avatar: "👩🏻",
  },
  {
    name: "Deepak",
    service: "Car Detailing",
    text: "I opted for full car detailing from CleanKart. They cleaned the interiors, polished the body and made my car look fresh again. Worth every rupee for the quality.",
    rating: 5,
    avatar: "👨🏻‍💼",
  },
  {
    name: "Saket",
    service: "Foam Washing",
    text: "The foam washing service made my car look spotless. The team used good quality products and cleaned even the difficult areas. Great doorstep service.",
    rating: 5,
    avatar: "👨🏻‍💼",
  },
];

const featuredStories = [
  {
    title: "Why Customers Choose CleanKart for Doorstep Cleaning",
    text: "Professional cleaning at your doorstep saves time and makes regular home and vehicle maintenance much easier.",
    name: "CleanKart Customer",
    rating: 5,
  },
  {
    title: "CleanKart Car Detailing Service Exceeded Expectations",
    text: "From interior cleaning to exterior detailing, our customers appreciate having professional vehicle care without visiting a workshop.",
    name: "CleanKart Customer",
    rating: 5,
  },
  {
    title: "A Better Way to Keep Your Home Clean",
    text: "With multiple cleaning services available in one place, CleanKart makes it easier to take care of your home whenever you need it.",
    name: "CleanKart Customer",
    rating: 5,
  },
  {
    title: "Professional Service Right at Your Doorstep",
    text: "Convenience, quality and clear service options are at the heart of the CleanKart experience.",
    name: "CleanKart Customer",
    rating: 5,
  },
  {
    title: "Making Everyday Cleaning Easier",
    text: "CleanKart brings practical cleaning solutions together so customers can spend less time arranging cleaning and more time enjoying their space.",
    name: "CleanKart Customer",
    rating: 5,
  },
  {
    title: "Quality Cleaning You Can Count On",
    text: "Our goal is simple: provide dependable cleaning services with professional care and a smooth customer experience.",
    name: "CleanKart Customer",
    rating: 5,
  },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div
      className="flex items-center gap-1 text-[#f4b63f]"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="text-[19px] leading-none"
          aria-hidden="true"
        >
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(16,44,95,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(16,44,95,0.14)]">
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-[#f4c542]/10 transition duration-300 group-hover:scale-125" />

      <div className="pointer-events-none absolute -bottom-7 -right-7 h-24 w-24 rounded-full border-[8px] border-[#f4c542]/10" />

      <div className="relative">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#e8f3ff] text-[39px] shadow-[0_4px_12px_rgba(16,44,95,0.16)]">
            {review.avatar}
          </div>

          <div>
            <h3 className="text-[20px] font-bold text-[#117c79]">
              {review.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {review.service}
            </p>
          </div>
        </div>

        <p className="mt-5 min-h-[108px] text-[15px] leading-6 text-slate-700">
          {review.text}
        </p>

        <div className="mt-4">
          <Stars rating={review.rating} />
        </div>
      </div>
    </article>
  );
}

export default function ReviewsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const API_URL = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "").replace(/\/api$/, "");

  const [reviews, setReviews] = useState<Review[]>(customerReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Load approved reviews from Django
   */
  useEffect(() => {
    async function loadApprovedReviews() {
      try {
        const response = await fetch(`${API_URL}/api/reviews/approved/`);

        if (!response.ok) {
          throw new Error("Could not load reviews.");
        }

        const data = await response.json();

        const backendReviews: Review[] = data.map(
          (review: {
            id: number;
            name: string;
            service: string;
            rating: number;
            text: string;
            avatar?: string;
          }) => ({
            name: review.name,
            service: review.service || "CleanKart Service",
            text: review.text,
            rating: review.rating,
            avatar: review.avatar || "👤",
          }),
        );

        setReviews([...backendReviews, ...customerReviews]);
      } catch {
        setReviews(customerReviews);
      }
    }

    loadApprovedReviews();
  }, [API_URL]);

  /*
   * Submit review to Django
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("rating", String(rating));

    try {
      const response = await fetch(`${API_URL}/api/reviews/`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Could not submit your review. Please try again.",
        );
      }

      setSubmitted(true);
      form.reset();
      setRating(5);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit your review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * Pagination
   */
  const reviewsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(reviews.length / reviewsPerPage),
  );

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const currentReviews = reviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  function goToPage(page: number) {
    const safePage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(safePage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#17366d]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-blue-100">
              <span>CleanKart Reviews</span>

              <span
                className="h-px w-24 bg-[#f4c542]"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hear from our
              <span className="block text-[#f4c542]">
                happy customers.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Real experiences from customers who trust CleanKart for
              professional home and vehicle cleaning services.
            </p>
          </div>
        </div>

        <div className="h-1.5 bg-[#f4c542]" />
      </section>

      {/* =========================================================
          REVIEWS INTRO
      ========================================================= */}

      <section className="px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-slate-600">
              <span>Customer feedback</span>

              <span
                className="h-px w-24 bg-[#1769e8]"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#102c5f] sm:text-4xl lg:text-5xl">
              Honest feedback
              <span className="text-[#1769e8]"> matters.</span>
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Every customer experience helps us improve. Here are some of the
              experiences our customers have shared about CleanKart services.
            </p>
          </div>

          {/* Review cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {currentReviews.map((review, index) => (
              <ReviewCard
                key={`${review.name}-${review.service}-${index}`}
                review={review}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          REVIEW + ABOUT SECTION
      ========================================================= */}

      <section className="bg-[#f5f8fd] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Review form */}

          <div className="overflow-hidden rounded-[18px] bg-[#102c5f] p-2 shadow-[0_14px_35px_rgba(16,44,95,0.16)]">
            <div className="rounded-[14px] bg-white p-6 sm:p-8">
              <h2 className="text-center text-3xl font-extrabold text-[#102c5f] sm:text-4xl">
                Please submit
                <span className="block text-[#1769e8]">
                  your review
                </span>
              </h2>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                    ✓
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-green-800">
                    Thank you for your review!
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-700">
                    Your feedback has been received and is waiting for
                    approval. We appreciate you taking the time to share your
                    CleanKart experience.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError("");
                    }}
                    className="mt-5 rounded-full bg-[#1769e8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#102c5f]"
                  >
                    Submit another review
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-6"
                >
                  <p className="text-sm text-slate-700">
                    <span className="text-red-500">*</span> Required
                  </p>

                  {/* Rating */}

                  <div className="mt-6">
                    <label className="block text-sm font-bold text-slate-800">
                      Star rating{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          aria-label={`Give ${star} star${
                            star > 1 ? "s" : ""
                          }`}
                          className={`text-3xl leading-none transition hover:scale-110 ${
                            star <= rating
                              ? "text-[#f4b63f]"
                              : "text-slate-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}

                  <div className="mt-6">
                    <label
                      htmlFor="review-title"
                      className="sr-only"
                    >
                      Review title
                    </label>

                    <input
                      id="review-title"
                      name="reviewTitle"
                      type="text"
                      required
                      placeholder="Title for Review"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1769e8] focus:ring-4 focus:ring-[#1769e8]/10"
                    />
                  </div>

                  {/* Name */}

                  <div className="mt-4">
                    <label
                      htmlFor="review-name"
                      className="sr-only"
                    >
                      Full Name
                    </label>

                    <input
                      id="review-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Full Name"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1769e8] focus:ring-4 focus:ring-[#1769e8]/10"
                    />
                  </div>

                  {/* Email */}

                  <div className="mt-4">
                    <label
                      htmlFor="review-email"
                      className="sr-only"
                    >
                      Email
                    </label>

                    <input
                      id="review-email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email Address"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1769e8] focus:ring-4 focus:ring-[#1769e8]/10"
                    />
                  </div>

                  {/* Service */}

                  <div className="mt-4">
                    <label
                      htmlFor="review-service"
                      className="sr-only"
                    >
                      Service
                    </label>

                    <input
                      id="review-service"
                      name="service"
                      type="text"
                      placeholder="Service Used"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1769e8] focus:ring-4 focus:ring-[#1769e8]/10"
                    />
                  </div>

                  {/* Review content */}

                  <div className="mt-4">
                    <label
                      htmlFor="review-content"
                      className="sr-only"
                    >
                      Your review
                    </label>

                    <textarea
                      id="review-content"
                      name="review_text"
                      required
                      rows={7}
                      placeholder="What do you think about us?"
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1769e8] focus:ring-4 focus:ring-[#1769e8]/10"
                    />
                  </div>

                  {/* Photo */}

                  <div className="mt-5">
                    <label
                      htmlFor="review-photo"
                      className="block text-sm font-bold text-slate-800"
                    >
                      Photo
                    </label>

                    <input
                      id="review-photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#eaf2ff] file:px-4 file:py-2 file:font-semibold file:text-[#1769e8] hover:file:bg-[#dceaff]"
                    />
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 w-full rounded-xl bg-[#f4c542] px-6 py-3.5 text-sm font-extrabold text-[#102c5f] transition hover:-translate-y-0.5 hover:bg-[#eeb72a] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting..." : "Add Testimonial"}
                  </button>

                  {submitError && (
                    <p className="mt-3 text-sm text-red-600">
                      {submitError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Information */}

          <div className="rounded-[18px] bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-slate-600">
              <span>Why your feedback matters</span>

              <span
                className="h-px w-20 bg-[#1769e8]"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-[#102c5f] sm:text-4xl">
              CleanKart reviews:
              <span className="block text-[#1769e8]">
                customers come first.
              </span>
            </h2>

            <div className="mt-7 space-y-5 text-[15px] leading-7 text-slate-600">
              <p>
                At CleanKart, customer satisfaction is at the heart of what we
                do. We want every service experience to be convenient,
                professional and worth recommending.
              </p>

              <p>
                Whether you booked a car wash, home cleaning, sofa cleaning,
                kitchen cleaning or another service, your experience helps us
                understand what we are doing well and where we can improve.
              </p>

              <p>
                We believe honest feedback helps us maintain high standards
                across every service. Your review can also help other customers
                choose the right cleaning service for their needs.
              </p>

              <p>
                Thank you for choosing CleanKart and taking the time to share
                your experience with us.
              </p>
            </div>

            {/* Small stats */}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#1769e8]/15 bg-[#f5f9ff] p-5 text-center">
                <div className="text-3xl font-extrabold text-[#102c5f]">
                  4.7+
                </div>

                <div className="mt-1 text-sm font-semibold text-[#1769e8]">
                  Customer Rating
                </div>
              </div>

              <div className="rounded-2xl border border-[#f4c542]/30 bg-[#fffaf0] p-5 text-center">
                <div className="text-3xl font-extrabold text-[#102c5f]">
                  5★
                </div>

                <div className="mt-1 text-sm font-semibold text-[#1769e8]">
                  Quality Focus
                </div>
              </div>

              <div className="rounded-2xl border border-[#102c5f]/10 bg-slate-50 p-5 text-center">
                <div className="text-3xl font-extrabold text-[#102c5f]">
                  24/7
                </div>

                <div className="mt-1 text-sm font-semibold text-[#1769e8]">
                  Easy Booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CUSTOMER STORIES
      ========================================================= */}

      <section className="px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-slate-600">
              <span>More customer experiences</span>

              <span
                className="h-px w-24 bg-[#1769e8]"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#102c5f] sm:text-4xl">
              More reasons to choose
              <span className="text-[#1769e8]"> CleanKart.</span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredStories.map((story) => (
              <article
                key={story.title}
                className="relative min-h-[250px] overflow-hidden rounded-[16px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute left-5 top-1 text-[90px] font-serif leading-none text-slate-100">
                  “
                </div>

                <div className="relative">
                  <h3 className="min-h-[72px] text-[21px] font-bold leading-7 text-[#117c79]">
                    {story.title}
                  </h3>

                  <p className="mt-4 text-[15px] leading-6 text-slate-700">
                    {story.text}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-600">
                      {story.name}
                    </span>

                    <Stars rating={story.rating} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PAGINATION
      ========================================================= */}

      <section className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#1769e8] hover:text-[#1769e8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-bold transition ${
                  currentPage === page
                    ? "bg-[#102c5f] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#1769e8] hover:text-[#1769e8]"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#1769e8] hover:text-[#1769e8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </section>
    </main>
  );
}