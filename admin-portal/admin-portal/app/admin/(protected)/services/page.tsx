"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";
import type { ListResponse, Service } from "@/lib/types";

type Filter = "all" | "active" | "inactive";

function getRows<T,>(payload: ListResponse<T>): T[] {
  return Array.isArray(payload) ? payload : payload.results ?? [];
}

function money(value?: number) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "—";
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<ListResponse<Service>>("/admin/services/");
      setData(getRows(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => data.filter((service) => {
    const matchesSearch = `${service.name} ${service.category ?? ""} ${service.slug ?? ""}`
      .toLowerCase().includes(search.trim().toLowerCase());
    const matchesFilter = filter === "all" || (filter === "active" ? service.is_active !== false : service.is_active === false);
    return matchesSearch && matchesFilter;
  }), [data, filter, search]);

  const counts = useMemo(() => ({
    all: data.length,
    active: data.filter((item) => item.is_active !== false).length,
    inactive: data.filter((item) => item.is_active === false).length,
  }), [data]);

  async function toggleService(service: Service) {
    const nextActive = service.is_active === false;
    const action = nextActive ? "reactivate" : "remove from the customer catalog";
    const confirmed = window.confirm(
      nextActive
        ? `Reactivate “${service.name}” and make it visible on the customer website?`
        : `Remove “${service.name}” from the customer website? The record will be archived, not permanently erased, so existing booking history is preserved.`
    );
    if (!confirmed) return;

    setBusyId(service.id);
    setError("");
    setNotice("");
    try {
      if (nextActive) {
        await apiRequest(`/admin/services/${service.id}/`, { method: "PATCH", body: { is_active: true } });
      } else {
        await apiRequest(`/admin/services/${service.id}/`, { method: "DELETE" });
      }
      setNotice(`“${service.name}” was ${nextActive ? "reactivated" : "removed from the customer catalog"}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${action}.`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CATALOG CONTROL</p>
          <h2>Services &amp; Pricing</h2>
          <p>Add new services, update prices, or remove services from the customer catalog.</p>
        </div>
        <button className="primary-btn" onClick={() => window.location.assign("/admin/services/new")}>
          <Icon name="plus" /> Add Service
        </button>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}

      <div className="stat-grid service-stat-grid">
        <div className="stat-card"><div className="stat-icon">▦</div><div><span>All services</span><strong>{counts.all}</strong></div></div>
        <div className="stat-card"><div className="stat-icon">✓</div><div><span>Visible to customers</span><strong>{counts.active}</strong></div></div>
        <div className="stat-card"><div className="stat-icon">⌁</div><div><span>Archived</span><strong>{counts.inactive}</strong></div></div>
      </div>

      <div className="toolbar">
        <div className="search-box"><Icon name="search" /><input aria-label="Search services" placeholder="Search by service or category…" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="service-toolbar-actions">
          <select aria-label="Filter services" className="service-filter" value={filter} onChange={(event) => setFilter(event.target.value as Filter)}>
            <option value="all">All ({counts.all})</option>
            <option value="active">Active ({counts.active})</option>
            <option value="inactive">Archived ({counts.inactive})</option>
          </select>
          <button className="secondary-btn" onClick={() => void load()} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><div><h3>Service catalogue</h3><p>Changes are saved to the Django database and reflected by the customer website.</p></div></div>
        <DataTable headers={["Service","Category","Price","Duration","Status","Actions"]} loading={loading} empty={!loading && filtered.length === 0} colSpan={6}>
          {filtered.map((service) => (
            <tr key={service.id}>
              <td><b>{service.name}</b><div className="subtext">{service.slug || `Service #${service.id}`}</div></td>
              <td>{service.category || "—"}</td>
              <td>{service.min_price !== undefined && service.max_price !== undefined && Number(service.min_price) !== Number(service.max_price)
                ? `${money(service.min_price)} – ${money(service.max_price)}`
                : money(service.base_price)}</td>
              <td>{service.duration ? `${service.duration} min` : "—"}</td>
              <td><StatusBadge value={service.is_active === false ? "Inactive" : "Active"} /></td>
              <td>
                <div className="service-row-actions">
                  <button className="link-btn" onClick={() => window.location.assign(`/admin/services/${service.id}`)}>Edit</button>
                  <button className={service.is_active === false ? "service-reactivate" : "service-remove"} disabled={busyId === service.id} onClick={() => void toggleService(service)}>
                    {busyId === service.id ? "Saving…" : service.is_active === false ? "Reactivate" : "Remove"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
      <p className="service-footnote">Remove uses archive mode. The service stops appearing on the customer website, while historical bookings remain intact.</p>
    </section>
  );
}
