"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

type Refund = { id:number; payment_id?:number|string; amount?:number; status?:string; created_at?:string };
export default function RefundsPage() {
  const [data,setData]=useState<Refund[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  async function load(){setLoading(true);try{const x=await apiRequest<any>("/admin/refunds/");setData(Array.isArray(x)?x:(x.results||[]))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  return <section><div className="page-heading"><div><p className="eyebrow">FINANCE</p><h2>Refunds</h2><p>Only backend-confirmed refunds are shown.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["Refund ID","Payment","Amount","Status","Created"]} loading={loading} empty={!loading&&!data.length} colSpan={5}>{data.map(r=><tr key={r.id}><td>#{r.id}</td><td>{r.payment_id??"—"}</td><td>{r.amount!==undefined?`₹${Number(r.amount).toLocaleString("en-IN")}`:"—"}</td><td><StatusBadge value={r.status}/></td><td>{r.created_at||"—"}</td></tr>)}</DataTable></div></section>;
}
