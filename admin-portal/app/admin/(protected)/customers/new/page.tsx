"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
export default function NewCustomerPage(){
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[phone,setPhone]=useState(""),[error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();try{const x=await apiRequest<any>("/admin/customers/",{method:"POST",body:{name,email,phone}});window.location.assign(`/admin/customers/${x.id}`)}catch(e:any){setError(e.message)}}
 return <section><div className="page-heading"><div><p className="eyebrow">PEOPLE</p><h2>Add Customer</h2><p>Create a real customer record through the backend.</p></div></div>{error&&<div className="alert error">{error}</div>}<div className="panel form-panel"><form onSubmit={submit}><label>Name<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} required/></label><button className="primary-btn">Create Customer</button></form></div></section>
}
