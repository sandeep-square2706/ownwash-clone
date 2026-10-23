"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { submitAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      await submitAuth("login", {
        email: String(form.get("email") || "")
          .trim()
          .toLowerCase(),
        password: String(form.get("password") || ""),
      });

      router.push("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not sign in. Please try again.",
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
          <span className="text-[30px] font-bold leading-none text-[var(--brand-navy)]">
            Login
          </span>

          <Link
            href="/signup"
            className="text-[30px] font-bold leading-none text-slate-400 transition hover:text-[var(--brand-blue)]"
          >
            Register
          </Link>
        </div>

        {/* Description */}
        <p className="mx-auto mt-10 max-w-[500px] text-center text-sm leading-6 text-slate-700">
          If you have an account, sign in with your email address.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-slate-900"
            >
              Username or email address{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-900"
            >
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-2">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-14 text-sm text-slate-900 outline-none transition focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/15"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
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
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-slate-300 text-[var(--brand-blue)] focus:ring-[var(--brand-blue)]"
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() =>
                setMessage(
                  "Password reset will be available soon.",
                )
              }
              className="text-sm font-medium text-[var(--brand-blue)] hover:underline"
            >
              Lost your password?
            </button>
          </div>

          {/* Error */}
          {message && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {message}
            </div>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-[var(--brand-blue)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-navy)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Small CleanKart note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Secure sign-in powered by CleanKart.
        </p>
      </div>
    </main>
  );
}