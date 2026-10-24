"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    const token = localStorage.getItem("cleankart_admin_access_token");
    window.location.replace(token ? "/admin/dashboard" : "/admin/login");
  }, []);
  return <main className="boot-screen">Loading CleanKart Admin…</main>;
}
