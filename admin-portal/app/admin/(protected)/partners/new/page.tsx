"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

type CreatedPartner = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  application_reference: string;
  temporary_password: string;
  message: string;
};

export default function NewPartnerPage() {
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerType, setPartnerType] = useState("INDIVIDUAL");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [created, setCreated] = useState<CreatedPartner | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setCreated(null);
    try {
      const partner = await apiRequest<CreatedPartner>("/admin/partners/", {
        method: "POST",
        body: {
          legal_name: legalName,
          display_name: displayName,
          business_name: businessName,
          email,
          phone,
          partner_type: partnerType,
          city,
          state,
        },
      });
      setCreated(partner);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create partner.");
    } finally {
      setBusy(false);
    }
  }

  async function copyCredentials() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(
        `Email: ${created.email}\nTemporary password: ${created.temporary_password}`,
      );
    } catch {
      setError("Could not copy credentials. Select and copy the password manually.");
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PARTNER NETWORK</p>
          <h2>Add Cleaning Partner</h2>
          <p>Create an approved partner account. The generated password is shown once.</p>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      {created ? (
        <div className="panel form-panel">
          <h3>Partner account created</h3>
          <p>{created.message}</p>
          <p><b>Status:</b> {created.status}</p>
          <p><b>Application reference:</b> {created.application_reference}</p>
          <label>Email<input value={created.email} readOnly /></label>
          <label>
            One-time temporary password
            <input value={created.temporary_password} readOnly autoComplete="off" />
          </label>
          <div className="form-actions">
            <button className="primary-btn" type="button" onClick={copyCredentials}>Copy credentials</button>
            <button className="secondary-btn" type="button" onClick={() => window.location.assign(`/admin/partners/${created.id}`)}>
              View partner record
            </button>
          </div>
        </div>
      ) : (
        <div className="panel form-panel">
          <form onSubmit={submit}>
            <label>
              Legal name
              <input value={legalName} onChange={(event) => setLegalName(event.target.value)} required maxLength={160} />
            </label>
            <label>
              Display name (optional)
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={160} />
            </label>
            <label>
              Business name (optional)
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} maxLength={160} />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Phone
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required maxLength={15} />
            </label>
            <label>
              Partner type
              <select value={partnerType} onChange={(event) => setPartnerType(event.target.value)}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="SOLE_PROPRIETOR">Sole proprietor</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="COMPANY">Company</option>
              </select>
            </label>
            <label>
              City (optional)
              <input value={city} onChange={(event) => setCity(event.target.value)} maxLength={80} />
            </label>
            <label>
              State (optional)
              <input value={state} onChange={(event) => setState(event.target.value)} maxLength={80} />
            </label>
            <button className="primary-btn" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create approved partner"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
