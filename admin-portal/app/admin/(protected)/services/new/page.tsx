"use client";

import { FormEvent, useState } from "react";
import { apiUpload } from "@/lib/api";

type CreatedService = { id: number };

export default function NewServicePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [topService, setTopService] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const body = new FormData();
    body.set("name", name);
    body.set("category", category);
    body.set("base_price", price);
    if (maxPrice) body.set("max_price", maxPrice);
    if (duration) body.set("duration", duration);
    body.set("short_description", shortDescription);
    body.set("description", description);
    body.set("features", JSON.stringify(features.split(/\r?\n/).map((value) => value.trim()).filter(Boolean)));
    body.set("is_active", "true");
    body.set("is_top_service", String(topService));
    if (image) body.set("image", image);

    try {
      const service = await apiUpload<CreatedService>("/admin/services/", body);
      window.location.assign(`/admin/services/${service.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CATALOG</p>
          <h2>Add Service</h2>
          <p>New active services and their images will appear on the customer website.</p>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <div className="panel form-panel">
        <form onSubmit={submit}>
          <label>Service name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={150} /></label>
          <label>Category<input value={category} onChange={(event) => setCategory(event.target.value)} required maxLength={100} /></label>
          <label>Base price (₹)<input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
          <label>Maximum price (₹, optional)<input type="number" min={price || "0"} step="0.01" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
          <label>Duration (minutes, optional)<input type="number" min="1" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} /></label>
          <label>Short description<input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} maxLength={255} /></label>
          <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} /></label>
          <label>Features (one per line)<textarea value={features} onChange={(event) => setFeatures(event.target.value)} rows={4} /></label>
          <label>Service image<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>
          {image ? <p>Selected image: {image.name}</p> : null}
          <label className="check-label"><input type="checkbox" checked={topService} onChange={(event) => setTopService(event.target.checked)} /> Feature on the home page</label>
          <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Creating…" : "Create Service"}</button>
        </form>
      </div>
    </section>
  );
}
