"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Banner,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Banner>){return Array.isArray(p)?p:p.results}
export default function BannersPage(){
 const [data,setData]=useState<Banner[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Banner>>("/admin/banners/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">CONTENT</p><h2>Banners Management</h2><p>Manage live promotional banners and placements.</p></div><button className="primary-btn" onClick={()=>window.location.assign("/admin/banners/new")}><Icon name="plus"/> Add Banner</button></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["Banner","Placement","Status","Action"]} loading={loading} empty={!loading&&!data.length} colSpan={4}>{data.map(b=><tr key={b.id}><td><b>{b.title}</b></td><td>{b.placement||"—"}</td><td><StatusBadge value={b.is_active===undefined?"—":b.is_active?"Active":"Inactive"}/></td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/banners/${b.id}`)}>Edit</button></td></tr>)}</DataTable></div></section>
}

