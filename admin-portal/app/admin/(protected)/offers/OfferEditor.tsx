"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Offer } from "@/lib/types";

type OfferFormValues = {
  name: string;
  description: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: string;
  minimum_order: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  show_on_homepage: boolean;
};

const emptyForm: OfferFormValues = {
  name: "",
  description: "",
  code: "",
  type: "PERCENTAGE",
  value: "",
  minimum_order: "0",
  valid_from: "",
  valid_to: "",
  is_active: true,
  show_on_homepage: true,
};

export default function OfferEditor({
  offer,
}: {
  offer?: Offer;
}) {
  const [form, setForm] = useState<OfferFormValues>(() => offer ? {
    name: offer.name,
    description: offer.description ?? "",
    code: offer.code,
    type: offer.type === "FIXED_AMOUNT" ? "FIXED_AMOUNT" : "PERCENTAGE",
    value: String(offer.value),
    minimum_order: String(offer.minimum_order ?? 0),
    valid_from: offer.valid_from ?? "",
    valid_to: offer.valid_to ?? "",
    is_active: offer.is_active ?? true,
    show_on_homepage: offer.show_on_homepage ?? true,
  } : emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof OfferFormValues>(key: K, value: OfferFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const body = {
        ...form,
        code: form.code.trim().toUpperCase(),
        value: Number(form.value),
        minimum_order: Number(form.minimum_order),
        valid_from: form.valid_from || null,
        valid_to: form.valid_to || null,
      };
      await apiRequest(offer ? `/admin/offers/${offer.id}/` : "/admin/offers/", {
        method: offer ? "PATCH" : "POST",
        body,
      });
      window.location.assign("/admin/offers");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save offer.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel form-panel offer-form-panel">
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit}>
        <label>
          Offer name
          <input value={form.name} onChange={(event) => update("name", event.target.value)} maxLength={120} required />
        </label>
        <label>
          Banner description
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} />
        </label>
        <label>
          Coupon code
          <input value={form.code} onChange={(event) => update("code", event.target.value.toUpperCase())} maxLength={40} required />
        </label>
        <div className="offer-form-grid">
          <label>
            Discount type
            <select value={form.type} onChange={(event) => update("type", event.target.value as OfferFormValues["type"])}>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed amount (₹)</option>
            </select>
          </label>
          <label>
            Discount value{form.type === "PERCENTAGE" ? " (%)" : " (₹)"}
            <input type="number" min="0.01" step="0.01" max={form.type === "PERCENTAGE" ? "100" : undefined} value={form.value} onChange={(event) => update("value", event.target.value)} required />
          </label>
          <label>
            Minimum order (₹)
            <input type="number" min="0" step="0.01" value={form.minimum_order} onChange={(event) => update("minimum_order", event.target.value)} required />
          </label>
          <label>
            Valid from
            <input type="date" value={form.valid_from} onChange={(event) => update("valid_from", event.target.value)} />
          </label>
          <label>
            Valid to
            <input type="date" value={form.valid_to} onChange={(event) => update("valid_to", event.target.value)} />
          </label>
        </div>
        <label className="check-label">
          <input type="checkbox" checked={form.show_on_homepage} onChange={(event) => update("show_on_homepage", event.target.checked)} />
          Show this offer as a banner on the customer home page
        </label>
        <label className="check-label">
          <input type="checkbox" checked={form.is_active} onChange={(event) => update("is_active", event.target.checked)} />
          Offer is active
        </label>
        <button className="primary-btn" disabled={busy}>{busy ? "Saving…" : offer ? "Save Offer" : "Create Offer"}</button>
      </form>
    </div>
  );
}
