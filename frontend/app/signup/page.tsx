"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { submitAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    const form = new FormData(
      event.currentTarget,
    );

    const full_name = String(
      form.get("full_name") || "",
    ).trim();

    const email = String(
      form.get("email") || "",
    )
      .trim()
      .toLowerCase();

    const phone = String(
      form.get("phone") || "",
    ).trim();

    const password = String(
      form.get("password") || "",
    );

    if (!full_name) {
      setMessage(
        "Please enter your full name.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!email) {
      setMessage(
        "Please enter your email address.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      setMessage(
        "Please enter a password.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await submitAuth("register", {
        full_name,
        email,
        phone,
        password,
      });

      router.push("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-white px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[520px]">

        {/* Tabs */}
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/login"
            className="text-[30px] font-bold leading-none text-slate-400 transition hover:text-[var(--brand-blue)]"
          >
            Login
          </Link>

          <span className="text-[30px] font-bold leading-none text-[var(--brand-navy)]">
            Register
          </span>
        </div>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-[500px] text-center text-sm leading-6 text-slate-700">
          There are many advantages to creating
          an account: the payment process is
          faster, shipment tracking is possible
          and much more.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-full-name"
              className="block text-sm font-medium text-slate-900"
            >
              Full name{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              id="signup-full-name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-slate-900"
            >
              Email address{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="signup-phone"
              className="block text-sm font-medium text-slate-900"
            >
              Phone number{" "}
              <span className="text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-slate-900"
            >
              Password{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <div className="relative mt-2">
              <input
                id="signup-password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg bg-[var(--brand-navy)] text-white transition hover:bg-[var(--brand-blue)]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Password must contain at least
              8 characters.
            </p>
          </div>

          {/* Privacy */}
          <p className="text-sm leading-6 text-slate-700">
            Your personal data will be used to
            support your experience throughout
            this website, to manage access to
            your account, and for other purposes
            described in our{" "}
            <Link
              href="/privacy"
              className="font-medium text-[var(--brand-blue)] hover:underline"
            >
              privacy policy
            </Link>
            .
          </p>

          {/* Error */}
          {message && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {message}
            </div>
          )}

          {/* Register */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-[var(--brand-blue)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-navy)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Create your CleanKart account and
          manage your cleaning services in one
          place.
        </p>
      </div>
    </main>
  );
}