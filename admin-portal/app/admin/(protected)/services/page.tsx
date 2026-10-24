"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Service,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Service>){return Array.isArray(p)?p:p.results}
export default function ServicesPage(){
 const [data,setData]=useState<Service[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Service>>("/admin/services/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 const filtered=data.filter(x=>`${x.name} ${x.category||""}`.toLowerCase().includes(search.toLowerCase()));
 return <section><div className="page-heading"><div><p className="eyebrow">CATALOG</p><h2>Services & Pricing</h2><p>Manage the real CleanKart service catalog and prices.</p></div><button className="primary-btn" onClick={()=>window.location.assign("/admin/services/new")}><Icon name="plus"/> Add Service</button></div>{error&&<div className="alert error">{error}</div>}<div className="toolbar"><div className="search-box"><Icon name="search"/><input placeholder="Search services…" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="secondary-btn" onClick={load}>Refresh</button></div><div className="panel"><DataTable headers={["Service","Category","Price","Duration","Status","Action"]} loading={loading} empty={!loading&&!filtered.length} colSpan={6}>{filtered.map(s=><tr key={s.id}><td><b>{s.name}</b></td><td>{s.category||"—"}</td><td>{s.min_price!==undefined&&s.max_price!==undefined&&s.min_price!==s.max_price?`₹${s.min_price} – ₹${s.max_price}`:s.base_price!==undefined?`₹${s.base_price}`:"—"}</td><td>{s.duration!==undefined?`${s.duration} min`:"—"}</td><td><StatusBadge value={s.is_active===undefined?"—":s.is_active?"Active":"Inactive"}/></td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/services/${s.id}`)}>Edit</button></td></tr>)}</DataTable></div></section>
}

