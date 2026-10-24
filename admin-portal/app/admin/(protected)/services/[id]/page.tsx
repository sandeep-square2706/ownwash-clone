"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Icon } from "@/components/Icons";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    apiRequest<any>(`/admin/services/${id}/`)
      .then((x) => {
        setData(x); setName(x.name || "");
        setPrice(String(x.base_price ?? x.min_price ?? ""));
        setActive(x.is_active !== false);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaved("");
    try {
      await apiRequest(`/admin/services/${id}/`, {
        method: "PATCH", body: { name, base_price: Number(price), is_active: active }
      });
      setSaved("Service updated in the database.");
    } catch (e: any) { setError(e.message); }
  }

  return <section>
    <button className="back-link" onClick={() => history.back()}><Icon name="back"/> Back</button>
    <div className="page-heading"><div><p className="eyebrow">CATALOG</p><h2>Edit Service</h2><p>Changes are persisted through Django.</p></div></div>
    {error && <div className="alert error">{error}</div>}
    {saved && <div className="alert success">{saved}</div>}
    {!data ? <div className="panel">Loading real service data…</div> :
      <div className="panel form-panel"><form onSubmit={save}>
        <label>Service name<input value={name} onChange={e=>setName(e.target.value)} required/></label>
        <label>Base price (₹)<input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} required/></label>
        <label className="check-label"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Active service</label>
        <button className="primary-btn">Save changes</button>
      </form></div>}
  </section>;
}
