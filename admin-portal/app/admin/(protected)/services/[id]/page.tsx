"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest, apiUpload } from "@/lib/api";
import { Icon } from "@/components/Icons";

type ServiceDetails = {
  id: number;
  name: string;
  category: string;
  base_price: number;
  max_price: number;
  duration: number | null;
  is_active: boolean;
  short_description: string;
  description: string;
  features: string[];
  is_top_service: boolean;
  image: string | null;
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ServiceDetails | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [active, setActive] = useState(true);
  const [topService, setTopService] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const service = await apiRequest<ServiceDetails>(`/admin/services/${id}/`);
    setData(service);
    setName(service.name || "");
    setCategory(service.category || "");
    setPrice(String(service.base_price ?? ""));
    setMaxPrice(String(service.max_price ?? ""));
    setDuration(service.duration == null ? "" : String(service.duration));
    setActive(service.is_active !== false);
    setTopService(service.is_top_service === true);
    setShortDescription(service.short_description || "");
    setDescription(service.description || "");
    setFeatures((service.features || []).join("\n"));
  }, [id]);

  useEffect(() => {
    load().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Could not load service."));
  }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved("");
    setBusy(true);
    const body = new FormData();
    body.set("name", name);
    body.set("category", category);
    body.set("base_price", price);
    if (maxPrice) body.set("max_price", maxPrice);
    else body.set("max_price", "");
    if (duration) body.set("duration", duration);
    else body.set("duration", "");
    body.set("short_description", shortDescription);
    body.set("description", description);
    body.set("features", JSON.stringify(features.split(/\r?\n/).map((value) => value.trim()).filter(Boolean)));
    body.set("is_active", String(active));
    body.set("is_top_service", String(topService));
    if (image) body.set("image", image);

    try {
      const updated = await apiUpload<ServiceDetails>(`/admin/services/${id}/`, body, "PATCH");
      setData(updated);
      setImage(null);
      setSaved("Service saved. Changes are reflected on the customer website.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save service.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Remove this service from the customer website? It will remain in the admin catalog as inactive.")) return;
    setError("");
    setSaved("");
    setBusy(true);
    try {
      await apiRequest(`/admin/services/${id}/`, { method: "DELETE" });
      setActive(false);
      setSaved("Service removed from the customer website.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <button className="back-link" onClick={() => history.back()}><Icon name="back" /> Back</button>
      <div className="page-heading">
        <div><p className="eyebrow">CATALOG</p><h2>Edit Service</h2><p>Save changes to update the live customer catalog.</p></div>
        {data?.is_active ? <button className="secondary-btn" type="button" disabled={busy} onClick={remove}>Remove service</button> : null}
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      {saved ? <div className="alert success">{saved}</div> : null}
      {!data ? <div className="panel">Loading service…</div> : (
        <div className="panel form-panel">
          <form onSubmit={save}>
            <label>Service name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={150} /></label>
            <label>Category<input value={category} onChange={(event) => setCategory(event.target.value)} required maxLength={100} /></label>
            <label>Base price (₹)<input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
            <label>Maximum price (₹)<input type="number" min={price || "0"} step="0.01" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
            <label>Duration (minutes)<input type="number" min="1" step="1" value={duration} onChange={(event) => setDuration(event.target.value)} /></label>
            <label>Short description<input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} maxLength={255} /></label>
            <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} /></label>
            <label>Features (one per line)<textarea value={features} onChange={(event) => setFeatures(event.target.value)} rows={4} /></label>
            {data.image ? <div><p>Current service image</p><img src={data.image} alt={`${data.name} service`} style={{ display: "block", maxWidth: 240, maxHeight: 160, objectFit: "cover", borderRadius: 10 }} /></div> : <p>No image uploaded.</p>}
            <label>Replace image<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>
            {image ? <p>Selected image: {image.name}</p> : null}
            <label className="check-label"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active on customer website</label>
            <label className="check-label"><input type="checkbox" checked={topService} onChange={(event) => setTopService(event.target.checked)} /> Feature on the home page</label>
            <button className="primary-btn" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
          </form>
        </div>
      )}
    </section>
  );
}
