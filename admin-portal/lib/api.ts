export const API_BASE =
  (process.env.NEXT_PUBLIC_CLEANKART_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function errorMessage(payload: unknown, status: number): string {
  if (typeof payload === "string" && payload) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["detail", "message", "error", "non_field_errors"]) {
      const value = record[key];
      if (typeof value === "string" && value) return value;
      if (Array.isArray(value) && value.length) return String(value[0]);
    }
    for (const [field, value] of Object.entries(record)) {
      if (typeof value === "string" && value) return `${field}: ${value}`;
      if (Array.isArray(value) && value.length) return `${field}: ${String(value[0])}`;
    }
  }
  return `Request failed with status ${status}.`;
}

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("cleankart_admin_access_token") ||
    sessionStorage.getItem("cleankart_admin_access_token")
  );
}

export async function apiRequest<T>(path: string, options: Options = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cleankart_admin_access_token");
      localStorage.removeItem("cleankart_admin_refresh_token");
      sessionStorage.removeItem("cleankart_admin_access_token");
      sessionStorage.removeItem("cleankart_admin_refresh_token");
      window.location.replace("/admin/login");
    }
    throw new Error("Your admin session has expired.");
  }

  const text = await response.text();
  let payload: unknown = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

  if (!response.ok) {
    throw new Error(errorMessage(payload, response.status));
  }

  return payload as T;
}

export async function apiDownload(path: string, filename: string): Promise<void> {
  const headers = new Headers({ Accept: "application/octet-stream" });
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(
    `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`,
    { headers, cache: "no-store" },
  );
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cleankart_admin_access_token");
      localStorage.removeItem("cleankart_admin_refresh_token");
      sessionStorage.removeItem("cleankart_admin_access_token");
      sessionStorage.removeItem("cleankart_admin_refresh_token");
      window.location.replace("/admin/login");
    }
    throw new Error("Your admin session has expired.");
  }
  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = text;
    try { payload = text ? JSON.parse(text) : null; } catch { /* Keep the response text. */ }
    throw new Error(errorMessage(payload, response.status));
  }

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function apiUpload<T>(path: string, body: FormData, method = "POST"): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(
    `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`,
    { method, headers, body, cache: "no-store" },
  );
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cleankart_admin_access_token");
      localStorage.removeItem("cleankart_admin_refresh_token");
      sessionStorage.removeItem("cleankart_admin_access_token");
      sessionStorage.removeItem("cleankart_admin_refresh_token");
      window.location.replace("/admin/login");
    }
    throw new Error("Your admin session has expired.");
  }

  const text = await response.text();
  let payload: unknown = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) throw new Error(errorMessage(payload, response.status));
  return payload as T;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cleankart_admin_access_token");
  localStorage.removeItem("cleankart_admin_refresh_token");
  localStorage.removeItem("cleankart_admin_user");
  sessionStorage.removeItem("cleankart_admin_access_token");
  sessionStorage.removeItem("cleankart_admin_refresh_token");
  sessionStorage.removeItem("cleankart_admin_user");
  window.location.replace("/admin/login");
}
