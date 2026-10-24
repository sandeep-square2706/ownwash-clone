"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { getAccessToken } from "@/lib/auth";

import {
  readCart,
  subscribeToStore,
  type CartItem,
} from "@/lib/client-store";

import useServiceCatalog from "@/hooks/useServiceCatalog";

import {
  formatPrice,
  getAddonTotal,
  getPreviewConvenienceFee,
} from "@/lib/services";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const inputClassName =
  "mt-2 block min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--brand-blue)] focus:ring-4 focus:ring-blue-100";

const labelClassName = "block text-sm font-medium text-slate-800";

const API_URL = (
  process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

type ApiAddress = {
  id: number;
  full_name: string;
  phone: string;
  house_number: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
};

type ApiCartItem = {
  id: number;
  service?: {
    id?: number;
    slug?: string;
  } | null;
  variant?: {
    id?: number;
  } | null;
  quantity?: number;
  selected_addons?: string[];
};

type ApiCart = {
  items?: ApiCartItem[];
};

type BookingResponse = {
  id: number;
  booking_reference: string;
  status: string;
  total_amount: string | number;
};

type RazorpayOrderResponse = {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  booking_id: number;
  booking_reference: string;
};

type RazorpayVerifyResponse = {
  success?: boolean;
  message?: string;
  detail?: string;
  payment_status?: string;
  booking_id?: number;
  booking_reference?: string;
  booking_status?: string;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    booking_reference: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => void;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (
  options: RazorpayOptions,
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

async function checkoutRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
  } = {},
): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "Please log in to your CleanKart account before checkout.",
    );
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(options.body === undefined
      ? {}
      : {
          body: JSON.stringify(options.body),
        }),
  });

  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const data =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>)
        : {};

    const detail = data.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    const message = Object.values(data)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .find((value) => typeof value === "string");

    throw new Error(
      typeof message === "string"
        ? message
        : `Request failed (${response.status}). Please try again.`,
    );
  }

  return payload as T;
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));

      if (window.Razorpay) {
        resolve(true);
      }

      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const {
    services: catalog,
    status: catalogStatus,
    error: catalogError,
    retry,
  } = useServiceCatalog();

  const [items, setItems] = useState<CartItem[]>([]);

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);

  const [createAccount, setCreateAccount] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [minBookingDate, setMinBookingDate] = useState("");

  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  const convenienceFee = getPreviewConvenienceFee();

  useEffect(() => {
    const syncCart = () => {
      setItems(readCart());
    };

    syncCart();

    return subscribeToStore(syncCart);
  }, []);

  useEffect(() => {
    const now = new Date();

    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setMinBookingDate(localDate);
  }, []);

  const rows = useMemo(
    () =>
      items.flatMap((item) => {
        const service = catalog.find(
          (candidate) => candidate.id === item.serviceId,
        );

        if (!service) {
          return [];
        }

        const variant = service.variants?.find(
          (option) => option.id === item.variantId,
        );

        /*
         * CartItem.addonIds is optional.
         * Normalizing it here means every later use is safe.
         */
        const addonIds = item.addonIds ?? [];

        const unitPrice =
          (variant?.price ??
            service.basePrice ??
            service.minPrice ??
            0) + getAddonTotal(service, addonIds);

        const selectedAddons = (service.addons ?? []).filter((addon) =>
          addonIds.includes(addon.id),
        );

        return [
          {
            item,
            service,
            variant,
            unitPrice,
            selectedAddons,
          },
        ];
      }),
    [catalog, items],
  );

  const subtotal = rows.reduce(
    (sum, row) => sum + row.unitPrice * row.item.quantity,
    0,
  );

  const total = subtotal + convenienceFee;

  function applyPromo() {
    const code = promoCode.trim();

    if (!code) {
      setPromoMessage("Enter a promo code to continue.");
      return;
    }

    setPromoMessage("Promo code validation will be available soon.");
  }

  async function syncBrowserCartToBackend() {
    if (rows.length === 0) {
      throw new Error(
        "Your cart is empty. Please add a service before checkout.",
      );
    }

    const backendCart = await checkoutRequest<ApiCart>("/cart/");

    const backendItems = backendCart.items ?? [];

    for (const row of rows) {
      const addonIds = row.item.addonIds ?? [];

      const matchingBackendItem = backendItems.find((backendItem) => {
        const serviceId = backendItem.service?.id;
        const variantId = backendItem.variant?.id ?? null;

        return (
          serviceId === row.item.serviceId &&
          variantId === (row.item.variantId ?? null)
        );
      });

      if (!matchingBackendItem) {
        await checkoutRequest("/cart/items/", {
          method: "POST",
          body: {
            service: row.item.serviceId,
            variant: row.item.variantId ?? null,
            quantity: row.item.quantity,
            selected_addons: addonIds,
          },
        });

        continue;
      }

      await checkoutRequest(`/cart/items/${matchingBackendItem.id}/`, {
        method: "PATCH",
        body: {
          quantity: row.item.quantity,
          selected_addons: addonIds,
        },
      });
    }
  }

  async function getOrCreateAddress(formData: FormData): Promise<number> {
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    const houseNumber = String(
      formData.get("houseNumber") ?? "",
    ).trim();

    const streetAddress = String(
      formData.get("streetAddress") ?? "",
    ).trim();

    const addressLine2 = String(
      formData.get("addressLine2") ?? "",
    ).trim();

    const area = String(formData.get("area") ?? "").trim();
    const landmark = String(formData.get("landmark") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const district = String(formData.get("district") ?? "").trim();
    const state = String(formData.get("state") ?? "").trim();
    const pincode = String(formData.get("postalCode") ?? "").trim();

    const street = addressLine2
      ? `${streetAddress}, ${addressLine2}`
      : streetAddress;

    const existingAddresses =
      await checkoutRequest<ApiAddress[]>("/auth/addresses/");

    const addressList = Array.isArray(existingAddresses)
      ? existingAddresses
      : [];

    const existing = addressList.find(
      (address) =>
        address.house_number === houseNumber &&
        address.street === street &&
        address.area === area &&
        address.city === city &&
        address.district === district &&
        address.state === state &&
        address.pincode === pincode &&
        address.phone === phone,
    );

    if (existing) {
      return existing.id;
    }

    const address = await checkoutRequest<ApiAddress>(
      "/auth/addresses/",
      {
        method: "POST",
        body: {
          full_name: `${firstName} ${lastName}`.trim(),
          phone,
          house_number: houseNumber,
          street,
          area,
          landmark,
          city,
          district,
          state,
          pincode,
          address_type: "HOME",
          is_default: addressList.length === 0,
        },
      },
    );

    return address.id;
  }

  async function createBooking(
    addressId: number,
    formData: FormData,
  ): Promise<BookingResponse> {
    const scheduledDate = String(
      formData.get("scheduledDate") ?? "",
    ).trim();

    const scheduledTime = String(
      formData.get("scheduledTime") ?? "",
    ).trim();

    const orderNotes = String(
      formData.get("orderNotes") ?? "",
    ).trim();

    return checkoutRequest<BookingResponse>("/bookings/", {
      method: "POST",
      body: {
        address: addressId,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        notes: orderNotes,
      },
    });
  }

  async function startRazorpayPayment(
    booking: BookingResponse,
    formData: FormData,
  ): Promise<void> {
    const razorpayLoaded = await loadRazorpayScript();

    if (!razorpayLoaded) {
      throw new Error(
        "Unable to load Razorpay Checkout. Please check your internet connection and try again.",
      );
    }

    /*
     * Keep the constructor in a local constant.
     * This safely narrows window.Razorpay from
     * RazorpayConstructor | undefined to RazorpayConstructor.
     */
    const RazorpayConstructor = window.Razorpay;

    if (!RazorpayConstructor) {
      throw new Error(
        "Razorpay Checkout is unavailable. Please refresh the page and try again.",
      );
    }

    const order = await checkoutRequest<RazorpayOrderResponse>(
      "/payments/create-order/",
      {
        method: "POST",
        body: {
          booking_id: booking.id,
        },
      },
    );

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    return new Promise<void>((resolve, reject) => {
      let settled = false;

      const finishResolve = () => {
        if (settled) {
          return;
        }

        settled = true;
        resolve();
      };

      const finishReject = (error: Error) => {
        if (settled) {
          return;
        }

        settled = true;
        reject(error);
      };

      const razorpay = new RazorpayConstructor({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "CleanKart",
        description: `Cleaning service booking ${order.booking_reference}`,
        order_id: order.order_id,

        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          contact: phone,
        },

        notes: {
          booking_reference: order.booking_reference,
        },

        theme: {
          color: "#1769e8",
        },

        modal: {
          ondismiss: () => {
            finishReject(
              new Error(
                "Payment was cancelled. Your booking is still awaiting payment.",
              ),
            );
          },
        },

        handler: async (response) => {
          try {
            const verification =
              await checkoutRequest<RazorpayVerifyResponse>(
                "/payments/verify/",
                {
                  method: "POST",
                  body: {
                    razorpay_order_id:
                      response.razorpay_order_id,
                    razorpay_payment_id:
                      response.razorpay_payment_id,
                    razorpay_signature:
                      response.razorpay_signature,
                  },
                },
              );

            if (
              verification.payment_status !== "CAPTURED" ||
              verification.success !== true
            ) {
              throw new Error(
                verification.detail ??
                  verification.message ??
                  "Payment could not be confirmed.",
              );
            }

            setBookingReference(
              verification.booking_reference ??
                booking.booking_reference,
            );

            finishResolve();
          } catch (error) {
            finishReject(
              error instanceof Error
                ? error
                : new Error("Payment verification failed."),
            );
          }
        },
      });

      razorpay.open();
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (processing) {
      return;
    }

    setCheckoutError("");
    setBookingReference("");

    const token = getAccessToken();

    if (!token) {
      setCheckoutError(
        "Please log in to your CleanKart account before placing your booking.",
      );
      return;
    }

    if (rows.length === 0) {
      setCheckoutError(
        "Your cart is empty. Please add a service before checkout.",
      );
      return;
    }

    if (!termsAccepted) {
      setCheckoutError(
        "Please accept the terms and conditions before continuing.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);

    const scheduledDate = String(
      formData.get("scheduledDate") ?? "",
    ).trim();

    const scheduledTime = String(
      formData.get("scheduledTime") ?? "",
    ).trim();

    if (!scheduledDate) {
      setCheckoutError("Please select your preferred service date.");
      return;
    }

    if (!scheduledTime) {
      setCheckoutError("Please select your preferred service time.");
      return;
    }

    if (minBookingDate && scheduledDate < minBookingDate) {
      setCheckoutError(
        "Please select today or a future service date.",
      );
      return;
    }

    setProcessing(true);

    try {
      await syncBrowserCartToBackend();

      const addressId = await getOrCreateAddress(formData);

      const booking = await createBooking(
        addressId,
        formData,
      );

      await startRazorpayPayment(booking, formData);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing your booking.",
      );
    } finally {
      setProcessing(false);
    }
  }

  if (bookingReference) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Payment successful
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your booking is confirmed 🎉
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Thank you for booking with CleanKart. Your payment
              has been verified successfully.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Booking reference
              </p>

              <p className="mt-2 text-xl font-bold text-[var(--brand-navy)]">
                {bookingReference}
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-blue)] px-6 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/account"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                View account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f9fe]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-slate-600">
            Home / Checkout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Enter your details, choose a convenient service time,
            and securely complete your CleanKart booking.
          </p>
        </div>
      </section>

      {catalogStatus === "error" ? (
        <section className="mx-auto max-w-[1380px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>
                {catalogError ||
                  "Unable to load services right now."}
              </span>

              <button
                type="button"
                onClick={retry}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {checkoutError ? (
        <section className="mx-auto max-w-[1380px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {checkoutError}
          </div>
        </section>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                  Billing details
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Your information
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  We’ll use these details to contact you about your
                  service.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className={labelClassName}>
                  First name *
                  <input
                    name="firstName"
                    required
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Last name *
                  <input
                    name="lastName"
                    required
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Company
                  <input
                    name="company"
                    autoComplete="organization"
                    placeholder="Company name"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Country / Region *
                  <select
                    name="country"
                    defaultValue="India"
                    required
                    className={inputClassName}
                  >
                    <option value="India">India</option>
                  </select>
                </label>

                <label className={`${labelClassName} sm:col-span-2`}>
                  House / Door Number *
                  <input
                    name="houseNumber"
                    required
                    autoComplete="address-line1"
                    placeholder="Enter house or flat number"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Street address *
                  <input
                    name="streetAddress"
                    required
                    placeholder="Street / road name"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Address line 2
                  <input
                    name="addressLine2"
                    placeholder="Apartment, suite, etc."
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Area / Locality *
                  <input
                    name="area"
                    required
                    placeholder="Enter your area"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Landmark
                  <input
                    name="landmark"
                    placeholder="Nearby landmark"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  City *
                  <input
                    name="city"
                    required
                    autoComplete="address-level2"
                    placeholder="Enter your city"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  District *
                  <input
                    name="district"
                    required
                    placeholder="Enter your district"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  State *
                  <select
                    name="state"
                    required
                    defaultValue=""
                    className={inputClassName}
                  >
                    <option value="" disabled>
                      Select state
                    </option>

                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClassName}>
                  PIN code *
                  <input
                    name="postalCode"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="postal-code"
                    placeholder="6-digit PIN"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Phone *
                  <input
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Email *
                  <input
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={(event) =>
                    setCreateAccount(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--brand-blue)] focus:ring-blue-200"
                />

                <span>
                  Create an account using these details
                  <span className="mt-1 block text-xs text-slate-500">
                    You can manage bookings and addresses from
                    your CleanKart account.
                  </span>
                </span>
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                Service schedule
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Choose your preferred time
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className={labelClassName}>
                  Preferred service date *
                  <input
                    type="date"
                    name="scheduledDate"
                    required
                    min={minBookingDate || undefined}
                    className={inputClassName}
                  />
                </label>

                <label className={labelClassName}>
                  Preferred service time *
                  <input
                    type="time"
                    name="scheduledTime"
                    required
                    className={inputClassName}
                  />
                </label>
              </div>

              <label className={`${labelClassName} mt-5`}>
                Order notes
                <textarea
                  name="orderNotes"
                  rows={4}
                  placeholder="Tell our cleaning team anything important about your service..."
                  className={`${inputClassName} resize-y`}
                />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Smartphone className="h-5 w-5 text-[var(--brand-blue)]" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                    Payment
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Secure online payment
                  </h2>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-blue)]" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Pay securely with Razorpay
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      You’ll be redirected to Razorpay Checkout
                      after your booking is created. Your payment
                      is verified securely by CleanKart.
                    </p>
                  </div>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) =>
                    setTermsAccepted(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--brand-blue)] focus:ring-blue-200"
                />

                <span>
                  I agree to the CleanKart terms and conditions and
                  understand that my booking will be confirmed after
                  successful payment.
                </span>
              </label>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-blue)]">
                    Your order
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Cart summary
                  </h2>
                </div>

                <Link
                  href="/cart"
                  className="text-sm font-semibold text-[var(--brand-blue)] hover:underline"
                >
                  Edit
                </Link>
              </div>

              {rows.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    Your cart is empty
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a cleaning service to continue.
                  </p>

                  <Link
                    href="/services"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-blue)]"
                  >
                    Browse services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {rows.map((row) => {
                    const addonIds = row.item.addonIds ?? [];

                    return (
                      <div
                        key={`${row.item.serviceId}-${row.item.variantId ?? "base"}-${addonIds.join("-")}`}
                        className="border-b border-slate-200 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {row.service.name}
                            </p>

                            {row.variant ? (
                              <p className="mt-1 text-xs text-slate-500">
                                {row.variant.name}
                              </p>
                            ) : null}

                            <p className="mt-1 text-xs text-slate-500">
                              Qty: {row.item.quantity}
                            </p>

                            {row.selectedAddons.length > 0 ? (
                              <div className="mt-2 space-y-1">
                                {row.selectedAddons.map((addon) => (
                                  <p
                                    key={addon.id}
                                    className="text-xs text-slate-500"
                                  >
                                    + {addon.name} (
                                    {formatPrice(addon.price)})
                                  </p>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          <p className="shrink-0 text-sm font-bold text-slate-900">
                            {formatPrice(
                              row.unitPrice * row.item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setPromoOpen((value) => !value)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[var(--brand-blue)]" />
                    Have a coupon?
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      promoOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {promoOpen ? (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        value={promoCode}
                        onChange={(event) =>
                          setPromoCode(event.target.value)
                        }
                        placeholder="Enter coupon code"
                        className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-[var(--brand-blue)] focus:ring-4 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={applyPromo}
                        className="rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
                      >
                        Apply
                      </button>
                    </div>

                    {promoMessage ? (
                      <p className="mt-2 text-xs text-slate-500">
                        {promoMessage}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Convenience fee</span>
                  <span>{formatPrice(convenienceFee)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-950">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  processing ||
                  rows.length === 0 ||
                  catalogStatus === "loading"
                }
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-blue)] px-5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-slate-500">
                  Your payment is processed securely through
                  Razorpay. CleanKart never stores your card or UPI
                  credentials.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}