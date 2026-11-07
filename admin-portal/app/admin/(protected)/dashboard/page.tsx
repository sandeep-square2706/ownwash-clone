"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { EmptyState } from "@/components/DataTable";
import { Icon } from "@/components/Icons";


type Dash = {
  total_bookings?: number; total_revenue?: number; active_customers?: number; active_partners?: number;
  partner_logins?: number;
  booking_trend?: { date: string; bookings: number; revenue: number }[];
  status_counts?: Record<string, number>;
};

const portalRequirements = [
  {
    title: "1. Login and Dashboard",
    points: [
      "Secure admin login and role-based access.",
      "Total bookings, revenue, customers, partners, and service status.",
      "Daily, weekly, and monthly analytics.",
    ],
    variant: "dashboard",
  },
  {
    title: "2. Booking Management",
    points: [
      "View all bookings and customer details.",
      "Assign or reassign cleaning partners.",
      "Cancel, refund, reschedule, and update booking status.",
    ],
    variant: "bookings",
  },
  {
    title: "3. Services and Pricing",
    points: [
      "Add, edit, activate, or deactivate services.",
      "Change prices, service duration, descriptions, and add-ons.",
      "Publish changes directly to the customer website.",
    ],
    variant: "services",
  },
  {
    title: "4. Customer and Cleaning Partner Management",
    points: [
      "View customer profiles, bookings, and complaints.",
      "Track partner availability, assigned jobs, check-in/out, and completion status.",
      "Manage partner onboarding, ratings, documents, and suspensions.",
    ],
    variant: "partners",
  },
  {
    title: "5. Banners, Offers and Discounts",
    points: [
      "Upload website banners and set their display order.",
      "Create coupon codes, percentage discounts, and fixed-amount offers.",
      "Set start/end dates, usage limits, and eligible services.",
      "Publish or remove promotions without developer intervention.",
    ],
    variant: "offers",
  },
  {
    title: "6. Push Notifications",
    points: [
      "Send announcements, offers, booking updates, and reminders.",
      "Target all customers or selected customer groups.",
      "Schedule notifications and track delivery performance.",
    ],
    variant: "notifications",
  },
] as const;

export default function DashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest<Dash>("/admin/dashboard/").then(setData).catch(e => setError(e.message)); }, []);

  const cards = [
    ["Total Bookings", data?.total_bookings, "calendar"],
    ["Total Revenue", data?.total_revenue !== undefined ? `₹${Number(data.total_revenue).toLocaleString("en-IN")}` : undefined, "payment"],
    ["Active Customers", data?.active_customers, "users"],
    ["Active Partners", data?.active_partners, "partner"],
    ["Partner Logins", data?.partner_logins, "users"]
  ];

  return <section>
    <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h2>Welcome back</h2><p>Live operational metrics from the Zaapino database.</p></div><span className="live-dot">● Live DB</span></div>
    {error && <div className="alert error">{error}</div>}
    <div className="stat-grid dashboard-stat-grid">{cards.map(([label, value, icon]) => <div className="stat-card" key={String(label)}><div className="stat-icon"><Icon name={String(icon)} /></div><div><span>{label}</span><strong>{value ?? "—"}</strong></div></div>)}</div>

    <div className="grid-2">
      <div className="panel"><div className="panel-head"><div><h3>Bookings Trend</h3><p>Only server-provided dates and values are rendered.</p></div></div>
        {!data?.booking_trend?.length ? <EmptyState title="No booking trend yet" /> :
          <div className="trend-list">{data.booking_trend.map(x => <div className="trend-row" key={x.date}><span>{x.date}</span><b>{x.bookings} bookings</b><span>₹{Number(x.revenue).toLocaleString("en-IN")}</span></div>)}</div>}
      </div>
      <div className="panel"><div className="panel-head"><div><h3>Booking Status</h3><p>Current counts from the API.</p></div></div>
        {!data?.status_counts || Object.keys(data.status_counts).length === 0 ? <EmptyState title="No bookings yet" /> :
          <div className="status-list">{Object.entries(data.status_counts).map(([k,v]) => <div key={k}><span>{k.replaceAll("_"," ")}</span><b>{v}</b></div>)}</div>}
      </div>
    </div>

    <section className="requirements-section">
      <h2 className="requirements-header">Complete admin portal requirements</h2>
      {portalRequirements.map((item, index) => (
        <div key={item.title} className={`feature-row ${index % 2 === 1 ? "feature-row--reverse" : ""}`}>
          <div className={`feature-visual feature-visual--${item.variant}`} aria-hidden="true">
            {item.variant === "dashboard" && (
              <div className="mock-window mock-window--dashboard">
                <div className="mock-toolbar" />
                <div className="mock-grid">
                  <div className="mock-card mock-card--wide" />
                  <div className="mock-card mock-card--small" />
                  <div className="mock-chart" />
                </div>
              </div>
            )}
            {item.variant === "bookings" && (
              <div className="mock-window mock-window--bookings">
                <div className="mock-toolbar" />
                <div className="mock-table">
                  <span /> <span /> <span /> <span />
                  <span /> <span /> <span /> <span />
                </div>
                <div className="mock-phone" />
              </div>
            )}
            {item.variant === "services" && (
              <div className="mock-window mock-window--services">
                <div className="mock-square" />
              </div>
            )}
            {item.variant === "partners" && (
              <div className="mock-window mock-window--partners">
                <div className="mock-square" />
              </div>
            )}
            {item.variant === "offers" && (
              <div className="mock-window mock-window--offers">
                <div className="mock-square" />
              </div>
            )}
            {item.variant === "notifications" && (
              <div className="mock-window mock-window--notifications">
                <div className="mock-toolbar" />
                <div className="mock-notification" />
              </div>
            )}
          </div>

          <div className="feature-copy">
            <h3>{item.title}</h3>
            <ul>
              {item.points.map(point => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  </section>;
}
