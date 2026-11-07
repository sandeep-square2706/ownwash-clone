"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/auth";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setMessage("");
    try {
      setMessage(await verifyEmail(token));
      setVerified(true);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not verify this email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-white px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[520px] rounded-2xl border border-slate-200 p-6 text-center shadow-sm sm:p-9">
        <h1 className="text-2xl font-bold text-[var(--brand-navy)]">Verify your email address</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Confirm your email to activate your Zaapino customer account.
        </p>
        {message ? (
          <p role={verified ? "status" : "alert"} className={`mt-5 rounded-lg px-4 py-3 text-sm ${verified ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
            {message}
          </p>
        ) : null}
        {verified ? (
          <Link href="/login" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[var(--brand-blue)] px-5 text-sm font-bold text-white">
            Continue to login
          </Link>
        ) : token ? (
          <button
            type="button"
            onClick={verify}
            disabled={busy}
            className="mt-6 min-h-11 rounded-lg bg-[var(--brand-blue)] px-5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Verifying..." : "Verify email"}
          </button>
        ) : (
          <p role="alert" className="mt-5 text-sm text-red-700">
            This verification link is missing its token. Request a new link from the signup page.
          </p>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-[70vh]" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
