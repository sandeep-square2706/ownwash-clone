"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Booking, ListResponse } from "@/lib/types";

function rows(payload: ListResponse<Booking>) { return Array.isArray(payload) ? payload : payload.results; }

export default function BookingsPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  async function load() { setLoading(true); try { setData(rows(await apiRequest<ListResponse<Booking>>("/admin/bookings/"))); } catch(e:any) { setError(e.message); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const filtered = data.filter(x => `${x.id} ${x.customer_name || x.customer?.name || ""} ${x.service_name || x.service?.name || ""}`.toLowerCase().includes(search.toLowerCase()));

  return <section>
    <div className="page-heading"><div><p className="eyebrow">OPERATIONS</p><h2>Bookings</h2><p>Search, inspect and update real customer bookings.</p></div><button className="primary-btn" onClick={() => window.location.assign("/admin/bookings/new")}><Icon name="plus"/> Add Booking</button></div>
    {error && <div className="alert error">{error}</div>}
    <div className="toolbar"><div className="search-box"><Icon name="search"/><input placeholder="Search bookings…" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="secondary-btn" onClick={load}>Refresh</button></div>
    <div className="panel"><DataTable headers={["Booking ID","Customer","Service","Date & Time","Status","Amount","Action"]} loading={loading} empty={!loading && filtered.length===0} colSpan={7}>
      {filtered.map(b => <tr key={String(b.id)}><td><b>#{b.id}</b></td><td>{b.customer_name || b.customer?.name || "—"}</td><td>{b.service_name || b.service?.name || "—"}</td><td>{b.scheduled_at || [b.date,b.time].filter(Boolean).join(" ") || "—"}</td><td><StatusBadge value={b.status}/></td><td>{(b.total_amount ?? b.amount) !== undefined ? `₹${Number(b.total_amount ?? b.amount).toLocaleString("en-IN")}` : "—"}</td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/bookings/${b.id}`)}>View</button></td></tr>)}
    </DataTable></div>
  </section>;
}

