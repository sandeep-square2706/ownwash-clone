export default function AboutPage() {
  return (
    <main>
      <section className="bg-[#0C706A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
            About Us
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            About OwnWash
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-teal-50">
            Professional cleaning services designed to make doorstep
            cleaning convenient, reliable and simple.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">
            Professional Cleaning at Your Doorstep
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            OwnWash provides convenient cleaning solutions delivered
            directly to customers. Our platform makes it easier to
            discover services, select a suitable option and schedule
            professional cleaning.
          </p>
        </div>
      </section>
    </main>
  );
}
