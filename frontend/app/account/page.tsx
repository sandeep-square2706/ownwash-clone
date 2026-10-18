import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
          CleanKart
        </p>
        <h1 className="mt-3 text-3xl font-bold text-blue-950">Your account</h1>
        <p className="mt-3 leading-6 text-slate-600">
          Sign-in and account management are not connected in this frontend preview.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-blue-950 px-6 text-sm font-bold text-white hover:bg-blue-900"
        >
          Explore services
        </Link>
      </div>
    </main>
  );
}
