"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


type Dash = {
  total_bookings?: number; total_revenue?: number; active_customers?: number; active_partners?: number;
  booking_trend?: { date: string; bookings: number; revenue: number }[];
  status_counts?: Record<string, number>;
};

export default function DashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest<Dash>("/admin/dashboard/").then(setData).catch(e => setError(e.message)); }, []);

  const cards = [
    ["Total Bookings", data?.total_bookings, "calendar"],
    ["Total Revenue", data?.total_revenue !== undefined ? `₹${Number(data.total_revenue).toLocaleString("en-IN")}` : undefined, "payment"],
    ["Active Customers", data?.active_customers, "users"],
    ["Active Partners", data?.active_partners, "partner"]
  ];

  return <section>
    <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h2>Welcome back</h2><p>Live operational metrics from the CleanKart database.</p></div><span className="live-dot">● Live DB</span></div>
    {error && <div className="alert error">{error}</div>}
    <div className="stat-grid">{cards.map(([label, value, icon]) => <div className="stat-card" key={String(label)}><div className="stat-icon"><Icon name={String(icon)} /></div><div><span>{label}</span><strong>{value ?? "—"}</strong></div></div>)}</div>

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
  </section>;
}

