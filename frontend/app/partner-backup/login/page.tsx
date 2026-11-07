"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerPublicShell, PrimaryButton, TextField } from "../../../components/partner/PartnerUI";
import { apiBaseUrl, savePartnerSession } from "../../../lib/partner/api";
type LoginResponse = { access?: string; refresh?: string; user?: { role?: string }; detail?: string };
export default function PartnerLogin() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch(`${apiBaseUrl()}/auth/login/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim().toLowerCase(),password})});
      const data = await response.json().catch(()=>({})) as LoginResponse;
      if(!response.ok) throw new Error(data.detail || "Unable to sign in. Check your email and password.");
      if(data.user?.role !== "PARTNER") throw new Error("This account is not registered as a Zaapino cleaning partner.");
      if(!data.access || !data.refresh) throw new Error("The server did not return a valid login session.");
      savePartnerSession(data.access,data.refresh); router.replace("/partner/dashboard");
    } catch(cause) { setError(cause instanceof Error ? cause.message : "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  }
  return <PartnerPublicShell><main className="cp-main" style={{maxWidth:560}}><section className="cp-card"><div className="cp-eyebrow" style={{color:"#1472e8"}}>Partner workspace</div><h1 style={{marginTop:9}}>Welcome back</h1><p className="cp-subtitle">Sign in with the email address and password used when you registered as a Zaapino partner.</p><form onSubmit={submit}><div style={{display:"grid",gap:15,marginTop:22}}><TextField label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" required/><TextField label="Password" value={password} onChange={setPassword} type="password" required/></div>{error?<div className="cp-alert cp-alert-error" role="alert">{error}</div>:null}<div style={{marginTop:22}}><PrimaryButton type="submit" disabled={busy}>{busy?"Signing in…":"Log in to partner portal →"}</PrimaryButton></div></form><p style={{marginTop:18,fontSize:12,color:"#71839b"}}>New to Zaapino? <a className="cp-inline-link" href="/partner/register">Register as a partner</a>.</p><div className="cp-note">Partner login uses Zaapino email-and-password authentication. The backend's development OTP endpoint is not used.</div></section></main></PartnerPublicShell>;
}
