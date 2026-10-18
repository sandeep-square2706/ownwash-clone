"use client";

import { useEffect, useState } from "react";

import { loadServices, mockServices, type Service } from "@/lib/services";

export type CatalogStatus = "loading" | "ready" | "error";

export default function useServiceCatalog() {
  const apiConfigured = Boolean(process.env.NEXT_PUBLIC_CLEANKART_API_URL);
  const [services, setServices] = useState<Service[]>(
    apiConfigured ? [] : mockServices.filter((service) => service.isActive),
  );
  const [status, setStatus] = useState<CatalogStatus>(apiConfigured ? "loading" : "ready");
  const [error, setError] = useState("");
  const [refreshAttempt, setRefreshAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    void loadServices()
      .then((loadedServices) => {
        if (current) {
          setServices(loadedServices);
          setStatus("ready");
          setError("");
        }
      })
      .catch(() => {
        if (current) {
          setServices([]);
          setStatus("error");
          setError("We couldn’t load services. Check your connection and try again.");
        }
      });

    return () => {
      current = false;
    };
  }, [refreshAttempt]);

  function retry() {
    setStatus("loading");
    setError("");
    setRefreshAttempt((attempt) => attempt + 1);
  }

  return { services, status, error, retry };
}
