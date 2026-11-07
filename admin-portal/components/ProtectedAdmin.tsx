"use client";

import { useEffect, useState } from "react";
import { logout } from "@/lib/api";

export function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cleankart_admin_access_token") || sessionStorage.getItem("cleankart_admin_access_token");
    const raw = localStorage.getItem("cleankart_admin_user") || sessionStorage.getItem("cleankart_admin_user");
    if (!token || !raw) {
      window.location.replace("/admin/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "ADMIN") {
        logout();
        return;
      }
      setReady(true);
    } catch {
      logout();
    }
  }, []);

  if (!ready) return <main className="boot-screen">Checking admin access…</main>;
  return <>{children}</>;
}
