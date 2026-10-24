"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function SettingsPage() {
  const [profile,setProfile]=useState<any>(null),[error,setError]=useState(""),[saved,setSaved]=useState("");
  useEffect(()=>{apiRequest<any>("/auth/profile/").then(setProfile).catch(e=>setError(e.message))},[]);
  async function save(){setSaved("");try{await apiRequest("/auth/profile/",{method:"PATCH",body:{phone:profile?.phone||""}});setSaved("Saved.");}catch(e:any){setError(e.message)}}
  return <section><div className="page-heading"><div><p className="eyebrow">CONFIGURATION</p><h2>Settings</h2><p>Admin profile and operational settings backed by the Django API.</p></div></div>{error&&<div className="alert error">{error}</div>}{saved&&<div className="alert success">{saved}</div>}<div className="panel form-panel"><h3>Administrator Profile</h3><label>Email<input value={profile?.email||""} readOnly/></label><label>Phone<input value={profile?.phone||""} onChange={e=>setProfile({...profile,phone:e.target.value})}/></label><button className="primary-btn" onClick={save}>Save changes</button></div></section>
}
