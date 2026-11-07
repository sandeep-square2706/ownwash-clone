"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Icon } from "@/components/Icons";

type ServiceDetail = {
  id: number;
  name: string;
  slug?: string;
  category?: string;
  base_price?: number;
  min_price?: number;
  max_price?: number | null;
  duration?: number | null;
  is_active?: boolean;
  short_description?: string;
  description?: string;
  features?: string[];
  addons?: { name: string; price: number }[];
  is_top_service?: boolean;
  display_order?: number;
};

function listText(value: unknown) {
  return Array.isArray(value) ? value.map((item) => typeof item === "string" ? item : "").filter(Boolean).join("\n") : "";
}

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ServiceDetail | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState("");
  const [addons, setAddons] = useState("");
  const [active, setActive] = useState(true);
  const [topService, setTopService] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiRequest<ServiceDetail>(`/admin/services/${id}/`)
      .then((service) => {
        setData(service);
        setName(service.name ?? "");
        setCategory(service.category ?? "");
        setShortDescription(service.short_description ?? "");
        setDescription(service.description ?? "");
        setPrice(String(service.base_price ?? service.min_price ?? ""));
        setMaxPrice(service.max_price == null ? "" : String(service.max_price));
        setDuration(service.duration == null ? "" : String(service.duration));
        setFeatures(listText(service.features));
        setAddons(Array.isArray(service.addons) ? service.addons.map((addon) => `${addon.name} | ${addon.price}`).join("\n") : "");
        setActive(service.is_active !== false);
        setTopService(Boolean(service.is_top_service));
        setDisplayOrder(String(service.display_order ?? 0));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load service."));
  }, [id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved("");
    setBusy(true);
    try {
      const parsedAddons = addons.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const [addonName, addonPrice] = line.split("|");
        if (!addonName?.trim() || !addonPrice?.trim() || !Number.isFinite(Number(addonPrice.trim()))) {
          throw new Error("Enter add-ons as one per line: Add-on name | price (for example, Interior polish | 299).");
        }
        return { name: addonName.trim(), price: Number(addonPrice.trim()) };
      });
      await apiRequest(`/admin/services/${id}/`, {
        method: "PATCH",
        body: {
          name: name.trim(),
          category: category.trim(),
          short_description: shortDescription.trim(),
          description: description.trim(),
          base_price: Number(price),
          max_price: maxPrice.trim() ? Number(maxPrice) : null,
          duration: duration.trim() ? Number(duration) : null,
          features: features.split("\n").map((line) => line.trim()).filter(Boolean),
          addons: parsedAddons,
          is_active: active,
          is_top_service: topService,
          display_order: Number(displayOrder) || 0,
        },
      });
      setSaved("Service changes saved to the database.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save service changes.");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!data) return;
    if (!window.confirm(`Remove “${data.name}” from the customer website? The record will be archived and existing booking history will be preserved.`)) return;
    setError("");
    setBusy(true);
    try {
      await apiRequest(`/admin/services/${id}/`, { method: "DELETE" });
      window.location.assign("/admin/services");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <button className="back-link" onClick={() => window.location.assign("/admin/services")}><Icon name="back" /> Back to services</button>
      <div className="page-heading"><div><p className="eyebrow">CATALOG CONTROL · #{id}</p><h2>Edit service</h2><p>Update the service details, visibility, price, and customer-facing content.</p></div></div>
      {error && <div className="alert error" role="alert">{error}</div>}
      {saved && <div className="alert success" role="status">{saved}</div>}
      {!data ? <div className="panel">Loading service details…</div> : (
        <div className="panel form-panel service-form-panel">
          <form onSubmit={save}>
            <div className="service-form-section"><h3>Basic information</h3><p>Service slug: <b>{data.slug || "Generated by Django"}</b></p></div>
            <div className="service-form-grid">
              <label>Service name *<input value={name} onChange={(event) => setName(event.target.value)} maxLength={150} required /></label>
              <label>Category *<input value={category} onChange={(event) => setCategory(event.target.value)} required /></label>
              <label className="service-form-wide">Short description<input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} maxLength={255} /></label>
              <label className="service-form-wide">Full description<textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
            </div>
            <div className="service-form-section"><h3>Pricing &amp; duration</h3><p>Prices are stored in INR.</p></div>
            <div className="service-form-grid">
              <label>Base price (₹) *<input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
              <label>Maximum price (₹)<input type="number" min="0" step="0.01" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Optional" /></label>
              <label>Duration (minutes)<input type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Optional" /></label>
              <label>Display order<input type="number" min="0" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} /></label>
            </div>
            <div className="service-form-section"><h3>Features &amp; add-ons</h3><p>One feature per line. Add-ons use “Name | Price” format.</p></div>
            <div className="service-form-grid">
              <label>Features<textarea rows={5} value={features} onChange={(event) => setFeatures(event.target.value)} /></label>
              <label>Add-ons<textarea rows={5} value={addons} onChange={(event) => setAddons(event.target.value)} placeholder="Interior polish | 299" /></label>
            </div>
            <div className="service-form-options">
              <label className="check-label"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active — visible on the customer website</label>
              <label className="check-label"><input type="checkbox" checked={topService} onChange={(event) => setTopService(event.target.checked)} /> Feature as a top service</label>
            </div>
            <div className="action-bar service-form-actions"><button type="button" className="service-remove" onClick={() => void archive()} disabled={busy}>Remove service</button><span className="service-actions-spacer" /><button type="button" className="secondary-btn" onClick={() => window.location.assign("/admin/services")}>Cancel</button><button type="submit" className="primary-btn" disabled={busy || !name.trim() || !category.trim() || !price.trim()}>{busy ? "Saving…" : "Save changes"}</button></div>
          </form>
        </div>
      )}
    </section>
  );
}
