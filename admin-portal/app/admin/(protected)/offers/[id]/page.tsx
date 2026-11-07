"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { Offer } from "@/lib/types";
import OfferEditor from "../OfferEditor";

export default function EditOfferPage() {
  const params = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<Offer>(`/admin/offers/${params.id}/`)
      .then((result) => { if (active) setOffer(result); })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load offer.");
      });
    return () => { active = false; };
  }, [params.id]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROMOTIONS</p>
          <h2>Edit Offer</h2>
          <p>Update the coupon, its dates, discount, and customer-facing banner.</p>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      {offer ? <OfferEditor key={offer.id} offer={offer} /> : !error ? <div className="panel">Loading offer…</div> : null}
    </section>
  );
}
