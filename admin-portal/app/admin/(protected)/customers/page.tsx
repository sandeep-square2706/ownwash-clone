"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable, EmptyState } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Customer, ListResponse } from "@/lib/types";
function rows(p:ListResponse<Customer>){return Array.isArray(p)?p:p.results}
export default function CustomersPage(){
 const [data,setData]=useState<Customer[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Customer>>("/admin/customers/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 const filtered=data.filter(x=>`${x.name||""} ${x.email} ${x.phone||""}`.toLowerCase().includes(search.toLowerCase()));
 return <section><div className="page-heading"><div><p className="eyebrow">PEOPLE</p><h2>Customers</h2><p>Customer accounts and booking activity from PostgreSQL.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="toolbar"><div className="search-box"><Icon name="search"/><input placeholder="Search customers…" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="secondary-btn" onClick={load}>Refresh</button></div><div className="panel"><DataTable headers={["Name","Phone","Email","Bookings","Total Spend","Status","Action"]} loading={loading} empty={!loading&&!filtered.length} colSpan={7}>{filtered.map(c=><tr key={c.id}><td><b>{c.name||"—"}</b></td><td>{c.phone||"—"}</td><td>{c.email}</td><td>{c.booking_count??"—"}</td><td>{c.total_spend!==undefined?`₹${Number(c.total_spend).toLocaleString("en-IN")}`:"—"}</td><td><StatusBadge value={c.is_active===undefined?"—":c.is_active?"Active":"Inactive"}/></td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/customers/${c.id}`)}>View</button></td></tr>)}</DataTable></div></section>
}

