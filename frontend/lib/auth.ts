const API_URL = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

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

let accessToken: string | null = null;
let refreshToken: string | null = null;
let currentUser: AuthUser | null = null;

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
    const stored = window.localStorage.getItem(NAME_STORAGE_KEY);

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
   AUTH STATE
------------------------------------------------------- */

export function getAccessToken() {
  return accessToken;
}

export function getCurrentUserData() {
  return currentUser;
}

export function clearAuth() {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
}

/* -------------------------------------------------------
   RESPONSE HANDLER
------------------------------------------------------- */

async function readResponse(response: Response) {
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
    `${API_URL}/api/auth/${
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

  accessToken = result.access;
  refreshToken = result.refresh;
  currentUser = result.user;

  /*
    Save the customer's name locally.

    We intentionally do this on the frontend for now,
    so your existing Django authentication does not
    need to be changed.
  */
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