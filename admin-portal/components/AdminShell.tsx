"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import { logout } from "@/lib/api";

const nav = [
  ["dashboard", "Dashboard", "/admin/dashboard"],
  ["calendar", "Bookings", "/admin/bookings"],
  ["users", "Customers", "/admin/customers"],
  ["partner", "Cleaning Partners", "/admin/partners"],
  ["service", "Services & Pricing", "/admin/services"],
  ["offer", "Offers & Discounts", "/admin/offers"],
  ["banner", "Banners", "/admin/banners"],
  ["bell", "Push Notifications", "/admin/notifications"],
  ["report", "Reports & Analytics", "/admin/reports"],
  ["payment", "Payments", "/admin/payments"],
  ["payment", "Refunds", "/admin/refunds"],
  ["review", "Reviews", "/admin/reviews"],
  ["review", "Complaints & Support", "/admin/complaints"],
  ["mail", "Contact Messages", "/admin/contact-messages"],
  ["settings", "Settings", "/admin/settings"],
] as const;

export function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState("Admin");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cleankart_admin_user") || sessionStorage.getItem("cleankart_admin_user");
      if (raw) {
        const user = JSON.parse(raw);
        setName(user.first_name || user.name || user.email || "Admin");
      }
    } catch {}
  }, []);

  return (
    <div className="admin-app">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark small"><span>⌂</span></div>
          <div><b>CleanKart</b><small>Admin Portal</small></div>
        </div>
        <nav>
          {nav.map(([icon, label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href)) ? "active" : ""}
            >
              <Icon name={icon} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={logout}><Icon name="logout" /> Sign out</button>
      </aside>

      {mobileOpen && <button className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
          <div>
            <span className="topbar-kicker">CleanKart Operations</span>
            <h1>{title || "Admin Portal"}</h1>
          </div>
          <div className="topbar-user">
            <div className="avatar">{name.slice(0, 1).toUpperCase()}</div>
            <div><b>{name}</b><small>Administrator</small></div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
