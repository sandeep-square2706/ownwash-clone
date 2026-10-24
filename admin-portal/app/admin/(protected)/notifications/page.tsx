"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Notification,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Notification>){return Array.isArray(p)?p:p.results}
export default function NotificationsPage(){
 const [data,setData]=useState<Notification[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Notification>>("/admin/notifications/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">CUSTOMER COMMUNICATION</p><h2>Push Notifications</h2><p>Send Firebase push notifications through the backend notification service.</p></div><button className="primary-btn" onClick={()=>window.location.assign("/admin/notifications/new")}><Icon name="plus"/> Send Notification</button></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["Title","Audience","Created","Status","Action"]} loading={loading} empty={!loading&&!data.length} colSpan={5}>{data.map(n=><tr key={n.id}><td><b>{n.title}</b><div className="subtext">{n.message||""}</div></td><td>{n.audience||"—"}</td><td>{n.created_at||"—"}</td><td><StatusBadge value={n.status}/></td><td><button className="link-btn">View</button></td></tr>)}</DataTable></div></section>
}

