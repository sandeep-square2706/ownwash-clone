"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


type Report = { total_bookings?:number; total_revenue?:number; active_customers?:number; active_partners?:number; daily?:{date:string;bookings:number;revenue:number}[] };
export default function ReportsPage(){
 const [data,setData]=useState<Report|null>(null),[error,setError]=useState("");
 useEffect(()=>{apiRequest<Report>("/admin/reports/").then(setData).catch(e=>setError(e.message))},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">ANALYTICS</p><h2>Reports & Analytics</h2><p>Server-generated reporting only. No seeded or sample figures.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="stat-grid">{[["Total Bookings",data?.total_bookings],["Revenue",data?.total_revenue!==undefined?`₹${Number(data.total_revenue).toLocaleString("en-IN")}`:undefined],["Customers",data?.active_customers],["Partners",data?.active_partners]].map(([k,v])=><div className="stat-card" key={String(k)}><div><span>{k}</span><strong>{v??"—"}</strong></div></div>)}</div><div className="panel"><h3>Daily Report</h3>{!data?.daily?.length?<EmptyState title="No report data yet"/>:<DataTable headers={["Date","Bookings","Revenue"]} empty={false} colSpan={3}>{data.daily.map(x=><tr key={x.date}><td>{x.date}</td><td>{x.bookings}</td><td>₹{Number(x.revenue).toLocaleString("en-IN")}</td></tr>)}</DataTable>}</div></section>
}

