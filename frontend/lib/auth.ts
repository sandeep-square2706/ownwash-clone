const API_URL = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
  access: string;
  refresh: string;
};

const ACCESS_TOKEN_KEY = "cleankart_access_token";
const REFRESH_TOKEN_KEY = "cleankart_refresh_token";
const USER_KEY = "cleankart_user";

/* -------------------------------------------------------
   DISPLAY NAME STORAGE
------------------------------------------------------- */

const NAME_STORAGE_KEY = "cleankart_customer_names";

type CustomerNames = Record<string, string>;

function getStoredCustomerNames(): CustomerNames {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(
      NAME_STORAGE_KEY,
    );

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as CustomerNames;
    }

    return {};
  } catch {
    return {};
  }
}

function saveCustomerName(
  email: string,
  fullName: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();

  if (!cleanEmail || !cleanName) {
    return;
  }

  try {
    const names = getStoredCustomerNames();

    names[cleanEmail] = cleanName;

    window.localStorage.setItem(
      NAME_STORAGE_KEY,
      JSON.stringify(names),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function getStoredCustomerName(
  email?: string,
) {
  if (typeof window === "undefined") {
    return "";
  }

  if (!email) {
    return "";
  }

  const names = getStoredCustomerNames();

  return names[email.trim().toLowerCase()] || "";
}

/* -------------------------------------------------------
   AUTH STORAGE
------------------------------------------------------- */

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    ACCESS_TOKEN_KEY,
  );
}

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    REFRESH_TOKEN_KEY,
  );
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(
      USER_KEY,
    );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

function saveAuth(
  access: string,
  refresh: string,
  user: AuthUser,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ACCESS_TOKEN_KEY,
    access,
  );

  window.localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refresh,
  );

  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

/* -------------------------------------------------------
   AUTH STATE
------------------------------------------------------- */

export function getAccessToken() {
  return getStoredAccessToken();
}

export function getCurrentUserData() {
  return getStoredUser();
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    ACCESS_TOKEN_KEY,
  );

  window.localStorage.removeItem(
    REFRESH_TOKEN_KEY,
  );

  window.localStorage.removeItem(USER_KEY);
}

/* -------------------------------------------------------
   RESPONSE HANDLER
------------------------------------------------------- */

async function readResponse(
  response: Response,
) {
  const result = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const firstError = Object.values(
      result as Record<string, unknown>,
    )
      .flatMap((value) =>
        Array.isArray(value)
          ? value
          : [value],
      )
      .find(
        (value) =>
          typeof value === "string",
      );

    throw new Error(
      typeof firstError === "string"
        ? firstError
        : "Authentication failed. Please try again.",
    );
  }

  return result as AuthResponse;
}

/* -------------------------------------------------------
   LOGIN / REGISTER
------------------------------------------------------- */

export async function submitAuth(
  mode: "login" | "register",
  data: {
    full_name?: string;
    email: string;
    phone?: string;
    password: string;
  },
) {
  const email = data.email
    .trim()
    .toLowerCase();

  const body =
    mode === "register"
      ? {
          email,
          phone: data.phone ?? "",
          password: data.password,
        }
      : {
          email,
          password: data.password,
        };

  const response = await fetch(
    `${API_URL}/auth/${
      mode === "register"
        ? "register"
        : "login"
    }/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result = await readResponse(response);

  saveAuth(
    result.access,
    result.refresh,
    result.user,
  );

  if (
    mode === "register" &&
    data.full_name?.trim()
  ) {
    saveCustomerName(
      email,
      data.full_name.trim(),
    );
  }

  return result;
}