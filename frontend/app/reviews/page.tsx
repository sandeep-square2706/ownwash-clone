const reviews = [
  {
    name: "Saktikant Das",
    service: "Car Washing",
  },
  {
    name: "Saket",
    service: "Foam Washing",
  },
  {
    name: "Anjali",
    service: "Sofa Dry Cleaning",
  },
];

export default function ReviewsPage() {
  return (
    <main className="bg-gray-50">

      <section className="bg-[#0C706A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
            Reviews
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            What Our Clients Says?
          </h1>

        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">

          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="text-yellow-500">
                ★★★★★
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                Customer review content will be connected to the
                backend review system.
              </p>

              <div className="mt-6">
                <p className="font-bold text-gray-900">
                  {review.name}
                </p>

                <p className="text-sm text-gray-500">
                  {review.service}
                </p>
              </div>
            </article>
          ))}

        </div>
      </section>

    </main>
  );
}