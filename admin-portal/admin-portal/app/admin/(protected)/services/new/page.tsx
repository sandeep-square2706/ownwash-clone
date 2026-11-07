"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Icon } from "@/components/Icons";
import type { ListResponse } from "@/lib/types";

type Category = { id: number; name: string; is_active?: boolean };

function parseLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function NewServicePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState("");
  const [addons, setAddons] = useState("");
  const [topService, setTopService] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiRequest<ListResponse<Category>>("/categories/")
      .then((payload) => setCategories(Array.isArray(payload) ? payload : payload.results ?? []))
      .catch(() => setCategories([]));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const parsedAddons = parseLines(addons).map((line) => {
        const [addonName, addonPrice] = line.split("|");
        if (!addonName?.trim() || !addonPrice?.trim() || !Number.isFinite(Number(addonPrice.trim()))) {
          throw new Error("Enter add-ons as one per line: Add-on name | price (for example, Interior polish | 299).");
        }
        return { name: addonName.trim(), price: Number(addonPrice.trim()) };
      });

      const created = await apiRequest<{ id: number }>("/admin/services/", {
        method: "POST",
        body: {
          name: name.trim(),
          category: category.trim(),
          short_description: shortDescription.trim(),
          description: description.trim(),
          base_price: Number(price),
          max_price: maxPrice.trim() ? Number(maxPrice) : null,
          duration: duration.trim() ? Number(duration) : null,
          features: parseLines(features),
          addons: parsedAddons,
          is_top_service: topService,
          is_active: true,
          display_order: Number(displayOrder) || 0,
        },
      });
      window.location.assign(`/admin/services/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <button className="back-link" onClick={() => window.location.assign("/admin/services")}><Icon name="back" /> Back to services</button>
      <div className="page-heading"><div><p className="eyebrow">CATALOG CONTROL</p><h2>Add a service</h2><p>Create a service that can be published on the customer website.</p></div></div>
      {error && <div className="alert error" role="alert">{error}</div>}

      <div className="panel form-panel service-form-panel">
        <form onSubmit={submit}>
          <div className="service-form-section"><h3>Basic information</h3><p>Customers will see the service name, category, and description.</p></div>
          <div className="service-form-grid">
            <label>Service name *<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Example: Premium car wash" maxLength={150} required /></label>
            <label>Category *<input list="service-category-options" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Choose or enter a category" required /><datalist id="service-category-options">{categories.map((item) => <option key={item.id} value={item.name} />)}</datalist><small className="field-hint">Existing categories are suggested. A new category name will be created automatically.</small></label>
            <label className="service-form-wide">Short description<input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} maxLength={255} placeholder="A short summary shown on service cards" /></label>
            <label className="service-form-wide">Full description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Describe what is included in this service…" /></label>
          </div>

          <div className="service-form-section"><h3>Pricing &amp; duration</h3><p>Prices are stored in INR. Leave maximum price empty for a fixed-price service.</p></div>
          <div className="service-form-grid">
            <label>Base price (₹) *<input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
            <label>Maximum price (₹)<input type="number" min="0" step="0.01" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Optional" /></label>
            <label>Duration (minutes)<input type="number" min="1" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Optional" /></label>
            <label>Display order<input type="number" min="0" step="1" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} /></label>
          </div>

          <div className="service-form-section"><h3>What customers get</h3><p>Enter one feature per line. Add-ons use “Name | Price” format.</p></div>
          <div className="service-form-grid">
            <label>Features<textarea rows={5} value={features} onChange={(event) => setFeatures(event.target.value)} placeholder={"Exterior foam wash\nWheel and tyre cleaning\nMicrofiber drying"} /></label>
            <label>Add-ons<textarea rows={5} value={addons} onChange={(event) => setAddons(event.target.value)} placeholder={"Interior polish | 299\nSpray wax finish | 199"} /><small className="field-hint">Example: Interior polish | 299</small></label>
          </div>

          <label className="check-label service-top-check"><input type="checkbox" checked={topService} onChange={(event) => setTopService(event.target.checked)} /> Feature this service as a top service</label>
          <div className="action-bar service-form-actions"><button type="button" className="secondary-btn" onClick={() => window.location.assign("/admin/services")}>Cancel</button><button type="submit" className="primary-btn" disabled={busy || !name.trim() || !category.trim() || !price.trim()}>{busy ? "Creating…" : "Create service"}</button></div>
        </form>
      </div>
    </section>
  );
}
