"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";


import type { Offer,ListResponse } from "@/lib/types";
function rows(p:ListResponse<Offer>){return Array.isArray(p)?p:p.results}
export default function OffersPage(){
 const [data,setData]=useState<Offer[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 async function load(){setLoading(true);try{setData(rows(await apiRequest<ListResponse<Offer>>("/admin/offers/")))}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <section><div className="page-heading"><div><p className="eyebrow">PROMOTIONS</p><h2>Offers & Discounts</h2><p>Create coupon codes, choose their validity, and publish offers as home-page banners.</p></div><button className="primary-btn" onClick={()=>window.location.assign("/admin/offers/new")}><Icon name="plus"/> Create Offer</button></div>{error&&<div className="alert error">{error}</div>}<div className="panel"><DataTable headers={["Offer","Coupon Code","Discount","Valid From","Valid To","Status","Action"]} loading={loading} empty={!loading&&!data.length} colSpan={7}>{data.map(o=><tr key={o.id}><td><b>{o.name}</b><div className="subtext">{o.show_on_homepage?"Home banner":"Checkout only"}</div></td><td><code>{o.code}</code></td><td>{o.type==="PERCENTAGE"?`${o.value}%`:`₹${o.value}`}</td><td>{o.valid_from||"—"}</td><td>{o.valid_to||"—"}</td><td><StatusBadge value={o.is_active===undefined?"—":o.is_active?"Active":"Inactive"}/></td><td><button className="link-btn" onClick={()=>window.location.assign(`/admin/offers/${o.id}`)}>Edit</button></td></tr>)}</DataTable></div></section>
}
