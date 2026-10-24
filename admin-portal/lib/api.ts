export const API_BASE =
  (process.env.NEXT_PUBLIC_CLEANKART_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
};

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
  let payload: any = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" ? payload : null) ||
      `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

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
