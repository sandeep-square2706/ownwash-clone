import Link from "next/link";
import { ArrowRight, HardDrive, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Details entered in forms",
    text: "Contact and checkout forms are frontend previews. Submitting them only changes the message shown in your browser; the details are not sent to CleanKart.",
  },
  {
    title: "Cart and wishlist",
    text: "Your selected services and wishlist are stored in this browser so the preview can remember them between pages. You can clear them from the cart or your browser storage.",
  },
  {
    title: "Payments and subscriptions",
    text: "Payments and newsletter signup are not connected. This preview does not collect card or UPI credentials, take payment, or save an email subscription.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-blue-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-blue-950 px-6 py-10 text-white sm:px-10 sm:py-12">
          <div className="flex items-center gap-3 text-blue-200">
            <ShieldCheck className="h-6 w-6" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">CleanKart preview</p>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Privacy overview</h1>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            This page explains what the current frontend preview does with information you enter.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
            <p>CleanKart is currently a frontend-only preview. A complete privacy policy will be published before any live booking or data collection is enabled.</p>
          </div>
          <div className="mt-7 space-y-6">
            {sections.map(({ title, text }) => (
              <section key={title}>
                <h2 className="text-lg font-bold text-blue-950">{title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">
            Contact CleanKart <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
