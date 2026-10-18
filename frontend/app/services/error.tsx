"use client";

export default function ServiceError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">CleanKart services</p>
        <h1 className="mt-3 text-2xl font-bold text-blue-950">This service could not be loaded</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Check your connection and try again. Your cart and wishlist remain in this browser.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 min-h-11 rounded-full bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
