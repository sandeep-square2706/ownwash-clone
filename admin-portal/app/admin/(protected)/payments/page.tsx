"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Payment,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Payment>){return Array.isArray(p)?p:p.results}
export default function PaymentsPage(){
 const [data,setData]=useState<Payment[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Payment>>("/admin/payments/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">FINANCE</p><h2>Payments & Refunds</h2><p>View payment records and trigger refund actions through the API.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["Payment ID","Booking","Amount","Method","Status","Created","Action"]} loading={loading} empty={!loading&&!data.length} colSpan={7}>{data.map(p=><tr key={p.id}><td>#{p.id}</td><td>{p.booking_id||"—"}</td><td>{p.amount!==undefined?`₹${Number(p.amount).toLocaleString("en-IN")}`:"—"}</td><td>{p.method||"—"}</td><td><StatusBadge value={p.status}/></td><td>{p.created_at||"—"}</td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/payments/${p.id}`)}>View</button></td></tr>)}</DataTable></div></section>
}

