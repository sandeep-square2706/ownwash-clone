"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
export default function Page(){
 const [payload,setPayload]=useState(""),[error,setError]=useState(""),[saved,setSaved]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setError("");setSaved("");try{const body=payload?JSON.parse(payload):{};await apiRequest("/admin/payments/",{method:"POST",body});setSaved("Saved to the backend.");}catch(e:any){setError(e.message)}}
 return <section><div className="page-heading"><div><p className="eyebrow">ADMIN</p><h2>Payment Details</h2><p>This screen writes only to the real API. It does not create demo records.</p></div></div>{error&&<div className="alert error">{error}</div>}{saved&&<div className="alert success">{saved}</div>}<div className="panel form-panel"><form onSubmit={submit}><label>Request JSON<textarea value={payload} onChange={e=>setPayload(e.target.value)} placeholder='{}' rows={12} required/></label><button className="primary-btn">Submit to API</button></form></div></section>
}
