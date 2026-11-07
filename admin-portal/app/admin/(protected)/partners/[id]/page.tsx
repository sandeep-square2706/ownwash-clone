"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiDownload, apiRequest } from "@/lib/api";
import { Icon } from "@/components/Icons";

type Invoice = {
  id: number;
  reference: string;
  description: string;
  amount: string;
  due_date: string;
  status: string;
  is_overdue: boolean;
  payment_reference: string;
};

type PartnerDocument = {
  id: number;
  document_type: string;
  verification_status: string;
  review_reason: string;
  created_at: string;
};

type PartnerService = {
  id: number;
  service_slug: string;
  is_approved: boolean;
};

type ApprovalEntry = {
  action: string;
  reason: string;
  created_at: string;
  actor__email: string;
};

type Partner = {
  id: number;
  name?: string;
  status?: string;
  legal_name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  partner_type?: string;
  application_reference?: string;
  date_of_birth?: string | null;
  gender?: string;
  profile_photo?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  languages?: string[];
  emergency_contact?: string;
  experience?: string;
  team_size?: number;
  max_travel_km?: number | string;
  working_days?: string[];
  start_time?: string | null;
  end_time?: string | null;
  blackout_dates?: string[];
  service_areas?: string[];
  equipment?: Record<string, unknown>;
  bank_holder?: string;
  bank_name?: string;
  bank_account_masked?: string;
  ifsc?: string;
  agreement_version?: string;
  agreement_accepted_at?: string | null;
  review_reason?: string;
  created_at?: string;
  services?: PartnerService[];
  documents?: PartnerDocument[];
  approval_history?: ApprovalEntry[];
};

const money = (amount: string | number) =>
  `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function Details({ title, fields }: { title: string; fields: [string, unknown][] }) {
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <h3>{title}</h3>
      <div className="detail-list">
        {fields.map(([label, value]) => (
          <div key={label}><span>{label}</span><b>{displayValue(value)}</b></div>
        ))}
      </div>
    </div>
  );
}

export default function PartnerDetail() {
  const params = useParams<{ id: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadInvoices = useCallback(async () => {
    const data = await apiRequest<Invoice[]>(`/admin/partners/${params.id}/invoices/`);
    setInvoices(data);
  }, [params.id]);

  const loadPartner = useCallback(async () => {
    const data = await apiRequest<Partner>(`/admin/partners/${params.id}/`);
    setPartner(data);
  }, [params.id]);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<Partner>(`/admin/partners/${params.id}/`),
      apiRequest<Invoice[]>(`/admin/partners/${params.id}/invoices/`),
    ]).then(([partnerData, invoiceData]) => {
      if (!active) return;
      setPartner(partnerData);
      setInvoices(invoiceData);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Could not load partner details.");
    });
    return () => { active = false; };
  }, [params.id]);

  async function reviewPartner(action: "approve" | "reject" | "request-info" | "suspend" | "unblock") {
    if (action === "approve" && !window.confirm("Approve this partner application?")) return;
    if (action === "suspend" && !window.confirm("Block this partner from using the Partner Portal?")) return;
    if (action === "unblock" && !window.confirm("Restore this partner's access?")) return;
    const reason = ["approve", "unblock"].includes(action) ? "" : window.prompt(
      action === "reject"
        ? "Enter the reason for rejecting this application:"
        : action === "suspend"
          ? "Enter the reason for blocking this partner:"
          : "What information is required?",
    );
    if (reason === null) return;
    if (!["approve", "unblock"].includes(action) && !reason.trim()) {
      setError("A reason is required for this action.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/admin/partners/${params.id}/action/`, {
        method: "POST",
        body: { action, reason },
      });
      await loadPartner();
      setNotice(
        action === "approve" ? "Partner approved successfully."
          : action === "suspend" ? "Partner blocked. Their Partner Portal access is disabled."
            : action === "unblock" ? "Partner unblocked. Their Partner Portal access is restored."
              : "Partner application updated.",
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update partner application.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(document: PartnerDocument) {
    setBusy(true);
    setError("");
    try {
      await apiDownload(
        `/admin/partners/${params.id}/documents/${document.id}/download/`,
        `${document.document_type}-${document.id}`,
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not download document.");
    } finally {
      setBusy(false);
    }
  }

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/admin/partners/${params.id}/invoices/`, {
        method: "POST",
        body: { description, amount, due_date: dueDate },
      });
      setDescription("");
      setAmount("");
      setDueDate("");
      await loadInvoices();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create invoice.");
    } finally {
      setBusy(false);
    }
  }

  async function markPaid(invoiceId: number) {
    const paymentReference = window.prompt("Enter the verified payment reference:");
    if (paymentReference === null) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/admin/partner-invoices/${invoiceId}/mark-paid/`, {
        method: "POST",
        body: { payment_reference: paymentReference.trim() },
      });
      await loadInvoices();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not record payment.");
    } finally {
      setBusy(false);
    }
  }

  const canReview = ["SUBMITTED", "UNDER_REVIEW", "MORE_INFO"].includes(partner?.status ?? "");
  const canBlock = partner?.status === "APPROVED";
  const canUnblock = partner?.status === "SUSPENDED";

  return (
    <section>
      <button className="back-link" onClick={() => history.back()}><Icon name="back" /> Back</button>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CLEANING PARTNER APPLICATION</p>
          <h2>{partner?.name || `Partner #${params.id}`}</h2>
          {partner?.application_reference ? <p>Reference: {partner.application_reference}</p> : null}
        </div>
        {canReview || canBlock || canUnblock ? (
          <div className="form-actions">
            {canReview ? <>
            <button className="primary-btn" type="button" disabled={busy} onClick={() => reviewPartner("approve")}>
              {busy ? "Please wait…" : "Approve partner"}
            </button>
            <button className="secondary-btn" type="button" disabled={busy} onClick={() => reviewPartner("request-info")}>
              Request information
            </button>
            <button className="secondary-btn" type="button" disabled={busy} onClick={() => reviewPartner("reject")}>
              Reject
            </button>
            </> : null}
            {canBlock ? (
              <button className="secondary-btn" type="button" disabled={busy} onClick={() => reviewPartner("suspend")}>
                Block partner
              </button>
            ) : null}
            {canUnblock ? (
              <button className="primary-btn" type="button" disabled={busy} onClick={() => reviewPartner("unblock")}>
                Unblock partner
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      {notice ? <div className="alert success">{notice}</div> : null}
      {!partner ? <div className="panel">Loading partner application…</div> : (
        <>
          <Details title="Basic details" fields={[
            ["Status", partner.status],
            ["Legal name", partner.legal_name],
            ["Display name", partner.name],
            ["Business name", partner.business_name],
            ["Partner type", partner.partner_type],
            ["Email", partner.email],
            ["Phone", partner.phone],
            ["Date of birth", partner.date_of_birth],
            ["Gender", partner.gender],
            ["Profile photo", partner.profile_photo],
            ["Emergency contact", partner.emergency_contact],
            ["Application submitted", partner.created_at],
          ]} />
          <Details title="Address and service area" fields={[
            ["Address", partner.address],
            ["City", partner.city],
            ["District", partner.district],
            ["State", partner.state],
            ["Pincode", partner.pincode],
            ["Service areas", partner.service_areas],
            ["Maximum travel distance (km)", partner.max_travel_km],
            ["Languages", partner.languages],
          ]} />
          <Details title="Experience and availability" fields={[
            ["Experience", partner.experience],
            ["Team size", partner.team_size],
            ["Working days", partner.working_days],
            ["Working hours", [partner.start_time, partner.end_time].filter(Boolean).join(" - ")],
            ["Blackout dates", partner.blackout_dates],
            ["Equipment", partner.equipment],
            ["Agreement version", partner.agreement_version],
            ["Agreement accepted", partner.agreement_accepted_at],
          ]} />
          <Details title="Payout details" fields={[
            ["Account holder", partner.bank_holder],
            ["Bank name", partner.bank_name],
            ["Masked account number", partner.bank_account_masked],
            ["IFSC", partner.ifsc],
          ]} />
          <div className="panel" style={{ marginTop: 16 }}>
            <h3>Requested services</h3>
            {partner.services?.length ? (
              <div className="table-wrap"><table>
                <thead><tr><th>Service</th><th>Status</th></tr></thead>
                <tbody>{partner.services.map((service) => (
                  <tr key={service.id}><td>{service.service_slug}</td><td>{service.is_approved ? "Approved" : "Requested"}</td></tr>
                ))}</tbody>
              </table></div>
            ) : <p>No services provided.</p>}
          </div>
          <div className="panel" style={{ marginTop: 16 }}>
            <h3>Application documents</h3>
            {partner.documents?.length ? (
              <div className="table-wrap"><table>
                <thead><tr><th>Document</th><th>Verification</th><th>Review note</th><th>Uploaded</th><th /></tr></thead>
                <tbody>{partner.documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.document_type}</td>
                    <td>{document.verification_status}</td>
                    <td>{document.review_reason || "—"}</td>
                    <td>{new Date(document.created_at).toLocaleDateString()}</td>
                    <td><button className="link-btn" disabled={busy} onClick={() => downloadDocument(document)}>Download</button></td>
                  </tr>
                ))}</tbody>
              </table></div>
            ) : <p>No documents uploaded.</p>}
          </div>
          {partner.review_reason ? <Details title="Latest review note" fields={[["Reason", partner.review_reason]]} /> : null}
          <div className="panel" style={{ marginTop: 16 }}>
            <h3>Approval history</h3>
            {partner.approval_history?.length ? (
              <div className="table-wrap"><table>
                <thead><tr><th>Action</th><th>Admin / actor</th><th>Reason</th><th>Date</th></tr></thead>
                <tbody>{partner.approval_history.map((entry, index) => (
                  <tr key={`${entry.action}-${entry.created_at}-${index}`}>
                    <td>{entry.action}</td><td>{entry.actor__email}</td><td>{entry.reason || "—"}</td>
                    <td>{new Date(entry.created_at).toLocaleString()}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            ) : <p>No review actions recorded.</p>}
          </div>
        </>
      )}

      <div className="panel" style={{ marginTop: 20 }}>
        <h3>Partner invoices</h3>
        <p>Overdue unpaid invoices block partner operations until payment is verified and recorded.</p>
        <form onSubmit={createInvoice} className="form-panel" style={{ marginTop: 16 }}>
          <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={200} /></label>
          <label>Amount (INR)<input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} required min="0.01" step="0.01" /></label>
          <label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /></label>
          <button className="primary-btn" type="submit" disabled={busy}>Issue invoice</button>
        </form>
        {invoices.length ? <div className="table-wrap" style={{ marginTop: 18 }}><table>
          <thead><tr><th>Reference</th><th>Description</th><th>Amount</th><th>Due</th><th>Status</th><th>Payment reference</th><th /></tr></thead>
          <tbody>{invoices.map((invoice) => <tr key={invoice.id}>
            <td>{invoice.reference}</td><td>{invoice.description}</td><td>{money(invoice.amount)}</td><td>{invoice.due_date}</td>
            <td>{invoice.is_overdue ? "OVERDUE" : invoice.status}</td><td>{invoice.payment_reference || "—"}</td>
            <td>{invoice.status === "UNPAID" ? <button className="secondary-btn" type="button" disabled={busy} onClick={() => markPaid(invoice.id)}>Record payment</button> : null}</td>
          </tr>)}</tbody>
        </table></div> : <p style={{ marginTop: 16 }}>No invoices issued.</p>}
      </div>
    </section>
  );
}
