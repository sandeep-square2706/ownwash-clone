"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";
import type { ListResponse, Offer } from "@/lib/types";

function rows(payload: ListResponse<Offer>): Offer[] {
  return Array.isArray(payload) ? payload : payload.results;
}

export default function BannersPage() {
  const [data, setData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<ListResponse<Offer>>("/admin/offers/")
      .then((payload) => {
        if (active) setData(rows(payload).filter((offer) => offer.show_on_homepage));
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load home-page banners.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h2>Home-page Banners</h2>
          <p>Offers enabled for home-page banners are listed here; only active, in-date offers appear to customers.</p>
        </div>
        <button className="primary-btn" onClick={() => window.location.assign("/admin/offers/new")}>
          <Icon name="plus" /> Add Banner Offer
        </button>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="panel">
        <DataTable headers={["Banner","Coupon Code","Placement","Status","Action"]} loading={loading} empty={!loading && !data.length} colSpan={5}>
          {data.map((offer) => (
            <tr key={offer.id}>
              <td><b>{offer.name}</b><div className="subtext">{offer.description || "Promotional offer"}</div></td>
              <td><code>{offer.code}</code></td>
              <td>Home page</td>
              <td><StatusBadge value={offer.is_active ? "Active" : "Inactive"} /></td>
              <td><button className="link-btn" onClick={() => window.location.assign(`/admin/offers/${offer.id}`)}>Edit offer</button></td>
            </tr>
          ))}
        </DataTable>
      </div>
    </section>
  );
}
