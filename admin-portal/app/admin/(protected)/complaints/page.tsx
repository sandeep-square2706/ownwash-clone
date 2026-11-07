"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

type Complaint={id:number;customer_name?:string;booking_id?:number|string;subject?:string;status?:string;created_at?:string};
export default function ComplaintsPage(){
 const [data,setData]=useState<Complaint[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);try{const x=await apiRequest<any>("/admin/complaints/");setData(Array.isArray(x)?x:(x.results||[]))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">SUPPORT</p><h2>Complaints & Support</h2><p>Handle customer complaints and service issues from the real database.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["ID","Customer","Booking","Subject","Status","Created","Action"]} loading={loading} empty={!loading&&!data.length} colSpan={7}>{data.map(c=><tr key={c.id}><td>#{c.id}</td><td>{c.customer_name||"—"}</td><td>{c.booking_id??"—"}</td><td>{c.subject||"—"}</td><td><StatusBadge value={c.status}/></td><td>{c.created_at||"—"}</td><td><button className="link-btn">View</button></td></tr>)}</DataTable></div></section>
}
