"use client";

import Link from "next/link";
import { useState } from "react";
import type { KeyboardEvent } from "react";

import { formatPrice, getServicePrice, type Service } from "@/lib/services";

type InformationTab = "description" | "details" | "reviews";

const tabs: { id: InformationTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "details", label: "Additional information" },
  { id: "reviews", label: "Reviews" },
];

export default function ServiceInformationTabs({ service }: { service: Service }) {
  const [activeTab, setActiveTab] = useState<InformationTab>("description");
  const panelId = `service-info-${service.slug}`;
  const activeTabId = `${panelId}-tab-${activeTab}`;

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    event.preventDefault();
    setActiveTab(nextTab.id);
    document.getElementById(`${panelId}-tab-${nextTab.id}`)?.focus();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div
        className="flex gap-6 overflow-x-auto border-b border-slate-200"
        role="tablist"
        aria-label="Service information"
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${panelId}-tab-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={panelId}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`relative min-h-14 shrink-0 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-blue-950 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[var(--brand-blue)]"
                : "text-slate-600 hover:text-blue-900"
            }`}
          >
            {tab.label}
            {tab.id === "reviews" ? ` (${service.reviewCount ?? 0})` : ""}
          </button>
        ))}
      </div>

      <div
        id={panelId}
        className="min-h-36 py-5"
        role="tabpanel"
        aria-labelledby={activeTabId}
        tabIndex={0}
      >
        {activeTab === "description" ? (
          <div>
            <h2 className="sr-only">Description</h2>
            <p className="max-w-5xl text-sm leading-7 text-slate-700">{service.description}</p>
            {service.included?.length ? (
              <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                {service.included.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            ) : null}
          </div>
        ) : null}

        {activeTab === "details" ? (
          <div>
            <h2 className="sr-only">Additional information</h2>
            <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Service" value={service.name} />
              <Detail label="Category" value={service.category} />
              <Detail label="Typical duration" value={service.duration} />
              <Detail label="Starting price" value={getServicePrice(service)} />
            </dl>
            {service.features.length > 0 ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Included features: {service.features.join(" · ")}
              </p>
            ) : null}
            {service.variants?.length ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Options: {service.variants.map((variant) => `${variant.name} (${formatPrice(variant.price)})`).join(" · ")}
              </p>
            ) : null}
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <div>
            <h2 className="sr-only">Customer reviews</h2>
            {service.reviewCount ? (
              <p className="text-sm leading-7 text-slate-700">
                Rated {service.rating?.toFixed(1) ?? "—"} from {service.reviewCount} customer reviews.
              </p>
            ) : (
              <p className="text-sm leading-7 text-slate-600">
                There are no reviews for {service.name} yet. Customer reviews will appear here when available.
              </p>
            )}
            <Link href="/reviews" className="mt-2 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
              Read customer stories
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-blue-950">{value}</dd>
    </div>
  );
}
