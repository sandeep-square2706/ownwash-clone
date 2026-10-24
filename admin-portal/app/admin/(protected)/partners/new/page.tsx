"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
export default function NewPartnerPage(){
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[phone,setPhone]=useState(""),[error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();try{const x=await apiRequest<any>("/admin/partners/",{method:"POST",body:{name,email,phone}});window.location.assign(`/admin/partners/${x.id}`)}catch(e:any){setError(e.message)}}
 return <section><div className="page-heading"><div><p className="eyebrow">PARTNER NETWORK</p><h2>Add Cleaning Partner</h2><p>Create a real partner/application record through Django.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="panel form-panel"><form onSubmit={submit}><label>Name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} required/></label><button className="primary-btn">Create Partner</button></form></div></section>
}
