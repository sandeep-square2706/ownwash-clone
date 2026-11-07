"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerPublicShell, PrimaryButton, TextField } from "../../../components/partner/PartnerUI";
import { apiBaseUrl, savePartnerSession } from "../../../lib/partner/api";
type LoginResponse = { access?: string; refresh?: string; user?: { role?: string }; detail?: string };
export default function PartnerLogin() {
  const router = useRouter();
  const [loginIdentifier,setLoginIdentifier] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const identifier=loginIdentifier.trim();
      const credentials=identifier.includes("@")
        ? {email:identifier.toLowerCase(),password}
        : {reference_id:identifier,password};
      const response = await fetch(`${apiBaseUrl()}/auth/login/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentials)});
      const data = await response.json().catch(()=>({})) as LoginResponse;
      if(!response.ok) throw new Error(data.detail || "Unable to sign in. Check your email and password.");
      if(data.user?.role !== "PARTNER") throw new Error("This account is not registered as a Zaapino cleaning partner.");
      if(!data.access || !data.refresh) throw new Error("The server did not return a valid login session.");
      savePartnerSession(data.access,data.refresh); router.replace("/partner/dashboard");
    } catch(cause) { setError(cause instanceof Error ? cause.message : "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  }
  return <PartnerPublicShell><main className="cp-main" style={{maxWidth:560}}><section className="cp-card"><div className="cp-eyebrow" style={{color:"#1472e8"}}>Partner workspace</div><h1 style={{marginTop:9}}>Welcome back</h1><p className="cp-subtitle">Sign in with your email address or partner reference ID and password.</p><form onSubmit={submit}><div style={{display:"grid",gap:15,marginTop:22}}><TextField label="Email address or Partner Reference ID" value={loginIdentifier} onChange={setLoginIdentifier} placeholder="you@example.com or CKP-1234ABCD" required/><label className="cp-field"><span>Password <b className="cp-required"> *</b></span><span className="cp-password-control"><input type={showPassword?"text":"password"} value={password} onChange={event=>setPassword(event.target.value)} required/><button type="button" className="cp-password-toggle" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?"Hide password":"Show password"} aria-pressed={showPassword}>{showPassword?"Hide":"Show"}</button></span></label></div>{error?<div className="cp-alert cp-alert-error" role="alert">{error}</div>:null}<div style={{marginTop:22}}><PrimaryButton type="submit" disabled={busy}>{busy?"Signing in…":"Log in to partner portal →"}</PrimaryButton></div></form><p style={{marginTop:18,fontSize:12,color:"#71839b"}}>New to Zaapino? <a className="cp-inline-link" href="/partner/register">Register as a partner</a>.</p><div className="cp-note">Use the email address or application reference ID provided when you registered, together with your password.</div></section></main></PartnerPublicShell>;
}
