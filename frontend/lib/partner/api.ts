const API = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const ACCESS_KEY = "cleankart_partner_access_token";
const REFRESH_KEY = "cleankart_partner_refresh_token";

export type PartnerUser = {
  id: number;
  email: string;
  phone: string;
  role: string;
};

export function partnerToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCESS_KEY) || "";
}

export function savePartnerSession(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearPartnerSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

async function readError(response: Response): Promise<string> {
  const payload: unknown = await response.json().catch(() => ({}));
  if (!payload || typeof payload !== "object") {
    return `Request failed (${response.status}).`;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;
  if (typeof record.message === "string") return record.message;
  for (const [field, value] of Object.entries(record)) {
    if (typeof value === "string") return `${field}: ${value}`;
    if (Array.isArray(value) && value.length) return `${field}: ${String(value[0])}`;
  }
  return `Request failed (${response.status}).`;
}

async function refreshPartnerToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  const refresh = window.localStorage.getItem(REFRESH_KEY);
  if (!refresh) return "";
  const response = await fetch(`${API}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    clearPartnerSession();
    return "";
  }
  const data = (await response.json()) as { access?: string };
  if (!data.access) return "";
  window.localStorage.setItem(ACCESS_KEY, data.access);
  return data.access;
}

export async function partnerApi<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const send = (token: string) => {
    const headers = new Headers(options.headers);
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers, credentials: "include" });
  };

  let token = partnerToken();
  let response = await send(token);
  if (response.status === 401 && token) {
    token = await refreshPartnerToken();
    if (token) response = await send(token);
  }
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function apiBaseUrl(): string {
  return API;
}
