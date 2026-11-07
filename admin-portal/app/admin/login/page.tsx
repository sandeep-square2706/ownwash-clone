"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("cleankart_admin_access_token");
    if (token) window.location.replace("/admin/dashboard");
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await apiRequest<any>("/auth/login/", {
        method: "POST",
        body: { email: email.trim(), password }
      });

      const user = data?.user ?? data?.data?.user;
      const access = data?.access ?? data?.data?.access;
      const refresh = data?.refresh ?? data?.data?.refresh;

      if (!access || !user) {
        throw new Error("The server returned an incomplete login response.");
      }
      if (user.role !== "ADMIN") {
        throw new Error("This account is not authorized for the Zaapino Admin Portal.");
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("cleankart_admin_access_token", access);
      if (refresh) storage.setItem("cleankart_admin_refresh_token", refresh);
      storage.setItem("cleankart_admin_user", JSON.stringify(user));
      window.location.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Image src="/images/logo/zaapino-logo-transparent.png" alt="Zaapino" width={56} height={56} priority />
          </div>
          <div>
            <strong>Zaapino</strong>
            <small>Admin Portal</small>
          </div>
        </div>

        <div className="login-heading">
          <p className="eyebrow">SECURE ADMIN ACCESS</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage Zaapino operations.</p>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zaapino.com"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <span className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          <div className="form-row between">
            <label className="check-label">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <span className="muted-link">Contact your administrator</span>
          </div>

          {error && <div className="alert error">{error}</div>}

          <button className="primary-btn full" disabled={busy}>
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="login-note">Only accounts with the Django <b>ADMIN</b> role can access this portal.</p>
      </section>
    </main>
  );
}
