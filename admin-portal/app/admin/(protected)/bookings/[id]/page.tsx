"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import { useParams } from "next/navigation";
import type { Booking } from "@/lib/types";

export default function BookingDetailsPage() {
  const params = useParams<{id:string}>();
  const [data, setData] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { apiRequest<Booking>(`/admin/bookings/${params.id}/`).then(setData).catch(e=>setError(e.message)); }, [params.id]);

  async function action(path:string, status?:string) {
    setBusy(true); setError("");
    try { await apiRequest(`/admin/bookings/${params.id}/`, { method:"PATCH", body: status ? {status} : {} }); const fresh=await apiRequest<Booking>(`/admin/bookings/${params.id}/`); setData(fresh); }
    catch(e:any){setError(e.message)} finally{setBusy(false)}
  }

  return <section>
    <div className="page-heading"><div><button className="back-link" onClick={()=>window.history.back()}><Icon name="back"/> Back to bookings</button><h2>Booking #{params.id}</h2></div>{data && <StatusBadge value={data.status}/>}</div>
    {error && <div className="alert error">{error}</div>}
    {!data ? <div className="panel"><EmptyState title={error ? "Unable to load booking" : "Loading booking…"} /></div> :
      <div className="detail-grid">
        <div className="panel"><h3>Customer Details</h3><div className="detail-list"><div><span>Name</span><b>{data.customer_name || data.customer?.name || "—"}</b></div><div><span>Email</span><b>{data.customer?.email || "—"}</b></div><div><span>Phone</span><b>{data.customer?.phone || "—"}</b></div></div></div>
        <div className="panel"><h3>Service Details</h3><div className="detail-list"><div><span>Service</span><b>{data.service_name || data.service?.name || "—"}</b></div><div><span>Partner</span><b>{data.partner_name || data.partner?.name || "—"}</b></div><div><span>Scheduled</span><b>{data.scheduled_at || [data.date,data.time].filter(Boolean).join(" ") || "—"}</b></div><div><span>Amount</span><b>{data.total_amount ?? data.amount !== undefined ? `₹${Number(data.total_amount ?? data.amount).toLocaleString("en-IN")}` : "—"}</b></div></div></div>
      </div>}
    {data && <div className="action-bar"><button className="secondary-btn" disabled={busy} onClick={()=>action("", "CANCELLED")}>Cancel Booking</button><button className="secondary-btn" disabled={busy} onClick={()=>action("", "COMPLETED")}>Mark Completed</button><button className="primary-btn" disabled={busy} onClick={()=>action("", "CONFIRMED")}>Confirm Booking</button></div>}
  </section>;
}

