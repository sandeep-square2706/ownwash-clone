"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Partner,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Partner>){return Array.isArray(p)?p:p.results}
export default function PartnersPage(){
 const [data,setData]=useState<Partner[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Partner>>("/admin/partners/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 const filtered=data.filter(x=>`${x.name||""} ${x.email||""} ${x.location||""}`.toLowerCase().includes(search.toLowerCase()));
 return <section><div className="page-heading"><div><p className="eyebrow">PARTNER NETWORK</p><h2>Cleaning Partners</h2><p>Review applications, status, workload and ratings.</p></div><button className="primary-btn" onClick={()=>window.location.assign("/admin/partners/new")}><Icon name="plus"/> Add Partner</button></div>{error&&<div className="alert error">{error}</div>}<div className="toolbar"><div className="search-box"><Icon name="search"/><input placeholder="Search partners…" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="secondary-btn" onClick={load}>Refresh</button></div><div className="panel"><DataTable headers={["Partner","Phone","Location","Status","Jobs","Rating","Action"]} loading={loading} empty={!loading&&!filtered.length} colSpan={7}>{filtered.map(p=><tr key={p.id}><td><b>{p.name||"—"}</b></td><td>{p.phone||"—"}</td><td>{p.location||"—"}</td><td><StatusBadge value={p.status}/></td><td>{p.total_jobs??"—"}</td><td>{p.rating??"—"}</td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/partners/${p.id}`)}>View</button></td></tr>)}</DataTable></div></section>
}

