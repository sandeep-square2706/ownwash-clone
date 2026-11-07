"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/partner/DashboardShell";
import { Panel, StatusPill } from "../../../components/partner/PartnerUI";
import { partnerApi } from "../../../lib/partner/api";

type Invoice = {
  id: number;
  reference: string;
  description: string;
  amount: number | string;
  due_date: string;
  status: string;
  is_overdue: boolean;
  payment_reference: string;
};

const money = (amount: number | string) =>
  `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function PartnerBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    partnerApi<Invoice[]>("/partners/billing/")
      .then((data) => { if (active) setInvoices(data); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load invoices."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const overdue = invoices.some((invoice) => invoice.is_overdue);

  return (
    <DashboardShell>
      <div className="cp-page-heading">
        <div><h1>Billing & invoices</h1><p>Review partner fees, due dates, and payment status.</p></div>
      </div>
      {overdue ? <div className="cp-alert cp-alert-error" role="alert">An invoice is overdue. Partner work and availability are blocked until Zaapino records your payment.</div> : null}
      {error ? <div className="cp-alert cp-alert-error" role="alert">{error}</div> : null}
      <Panel title="Your invoices" subtitle="Payments are verified and recorded by Zaapino. Contact support if you have already paid.">
        {loading ? <div className="cp-loading"><span className="cp-spinner" />Loading invoices…</div> : invoices.length ? (
          <div className="cp-table-wrap"><table className="cp-table">
            <thead><tr><th>Invoice</th><th>Description</th><th>Amount</th><th>Due date</th><th>Status</th><th>Payment reference</th></tr></thead>
            <tbody>{invoices.map((invoice) => <tr key={invoice.id}>
              <td><b>{invoice.reference}</b></td><td>{invoice.description}</td><td>{money(invoice.amount)}</td>
              <td>{new Date(`${invoice.due_date}T00:00:00`).toLocaleDateString("en-IN")}</td>
              <td><StatusPill value={invoice.is_overdue ? "OVERDUE" : invoice.status} /></td>
              <td>{invoice.payment_reference || "—"}</td>
            </tr>)}</tbody>
          </table></div>
        ) : <div className="cp-empty">No invoices have been issued to your account.</div>}
      </Panel>
      <div className="cp-note">When you pay an invoice, keep your receipt and contact Zaapino support. Access resumes after Zaapino verifies and records the payment.</div>
    </DashboardShell>
  );
}
