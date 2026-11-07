"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { getAccessToken, refreshAccessToken } from "@/lib/auth";

import {
  readCart,
  subscribeToStore,
  type CartItem,
} from "@/lib/client-store";

import useServiceCatalog from "@/hooks/useServiceCatalog";

import {
  formatPrice,
  getServiceById,
  getAddonTotal,
  getPreviewConvenienceFee,
} from "@/lib/services";
import { openRazorpayCheckout } from "@/lib/razorpay/checkout";

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
  service?: number | { id?: number; slug?: string } | null;
  variant?: number | { id?: number } | null;
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

type FirstOrderOffer = {
  eligible: boolean;
  discount_percent: number;
};

type CouponPreview = {
  code: string;
  name: string;
  coupon_discount: string | number;
  first_order_discount: string | number;
  subtotal: string | number;
};

type DirectUpiConfig = {
  vpa: string;
  payee_name: string;
};

type DirectUpiPayment = {
  bookingId: number;
  bookingReference: string;
  amount: number;
  vpa: string;
  payeeName: string;
  paymentUri: string;
};

async function checkoutRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
  } = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in to your Zaapino account before checkout.");
  }

  const sendRequest = (accessToken: string) => {
    const headers = new Headers({ Accept: "application/json" });
    headers.set("Authorization", `Bearer ${accessToken}`);
    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      ...(options.body === undefined
        ? {}
        : { body: JSON.stringify(options.body) }),
      cache: "no-store",
    });
  };

  let response = await sendRequest(token);
  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (!refreshedToken) {
      throw new Error(
        "Your session has expired. Please sign in again before checkout.",
      );
    }

    response = await sendRequest(refreshedToken);
  }

  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const data =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>)
        : {};
    const detail = data.detail;
    const message = data.message;
    const fieldError = Object.values(data)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .find((value): value is string => typeof value === "string");
    throw new Error(
      (typeof detail === "string" && detail) ||
        (typeof message === "string" && message) ||
        fieldError ||
        `Request failed (${response.status}). Please try again.`,
    );
  }

  return payload as T;
}

async function getOrCreateAddress(formData: FormData): Promise<number> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  const rawPhone = String(formData.get("phone") ?? "").trim();
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const phone =
    phoneDigits.length === 12 && phoneDigits.startsWith("91")
      ? phoneDigits.slice(2)
      : phoneDigits;

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }

  const houseNumber = String(formData.get("houseNumber") ?? "").trim();
  const streetAddress = String(formData.get("streetAddress") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim();
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

  const response = await checkoutRequest<{
    message: string;
    address: ApiAddress;
  }>("/auth/addresses/", {
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
  });

  if (!response.address?.id) {
    throw new Error("Address was saved, but its ID was not returned.");
  }

  return response.address.id;
}
export default function CheckoutPage() {
  const {
    services: catalog,
    status: catalogStatus,
    error: catalogError,
    retry,
  } = useServiceCatalog();

  const [items, setItems] = useState<CartItem[]>([]);

  const [firstOrderOffer, setFirstOrderOffer] =
    useState<FirstOrderOffer | null>(null);
  const [offerError, setOfferError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponPreview | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [createAccount, setCreateAccount] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "direct_upi">("razorpay");

  const [minBookingDate, setMinBookingDate] = useState("");

  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [directUpiPayment, setDirectUpiPayment] =
    useState<DirectUpiPayment | null>(null);
  const [upiReference, setUpiReference] = useState("");
  const [upiSubmitted, setUpiSubmitted] = useState(false);
  const [submittingUpiReference, setSubmittingUpiReference] = useState(false);

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

  useEffect(() => {
    if (!getAccessToken()) return;

    let active = true;
    checkoutRequest<FirstOrderOffer>("/bookings/first-order-offer/")
      .then((offer) => {
        if (active) setFirstOrderOffer(offer);
      })
      .catch((error: unknown) => {
        if (active) {
          setOfferError(
            error instanceof Error
              ? error.message
              : "Could not check first-booking offer eligibility.",
          );
        }
      });

    return () => {
      active = false;
    };
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

  const couponQuoteMatches =
    appliedCoupon !== null && Number(appliedCoupon.subtotal) === subtotal;
  const firstOrderDiscount = couponQuoteMatches && appliedCoupon
    ? Number(appliedCoupon.first_order_discount)
    : firstOrderOffer?.eligible
      ? Number(((subtotal * firstOrderOffer.discount_percent) / 100).toFixed(2))
      : 0;
  const couponDiscount =
    couponQuoteMatches && appliedCoupon
      ? Number(appliedCoupon.coupon_discount)
      : 0;
  const discount = Math.min(subtotal, firstOrderDiscount + couponDiscount);
  const total = subtotal - discount + convenienceFee;

  async function syncBrowserCartToBackend() {
    if (rows.length === 0) {
      throw new Error(
        "Your cart is empty. Please add a service before checkout.",
      );
    }

    const backendCart = await checkoutRequest<ApiCart>("/cart/");

    const backendItems: ApiCartItem[] = backendCart.items ?? [];
    const synchronizedItemIds = new Set<number>();

    for (const row of rows) {
      const addonIds = row.item.addonIds ?? [];
      const requestedVariantId = row.item.variantId;
      const currentVariant = requestedVariantId
        ? row.service.variants?.find(
            (variant) => variant.id === requestedVariantId,
          )
        : undefined;
      const savedMockVariant = requestedVariantId
        ? getServiceById(row.item.serviceId)?.variants?.find(
            (variant) => variant.id === requestedVariantId,
          )
        : undefined;
      const backendVariant =
        currentVariant ??
        (savedMockVariant
          ? row.service.variants?.find(
              (variant) => variant.name === savedMockVariant.name,
            )
          : undefined);

      if (requestedVariantId && !backendVariant) {
        throw new Error(
          `${row.service.name} has an outdated cart option. Remove it from your cart and add it again before checkout.`,
        );
      }

      const backendVariantId = backendVariant
        ? Number(backendVariant.id)
        : null;

      if (
        backendVariantId !== null &&
        !Number.isSafeInteger(backendVariantId)
      ) {
        throw new Error(
          `Could not match the selected ${row.service.name} option. Please remove it from your cart and add it again.`,
        );
      }

      const matchingBackendItem = backendItems.find((backendItem) => {
        const serviceId =
          typeof backendItem.service === "number"
            ? backendItem.service
            : backendItem.service?.id;
        const variantId =
          typeof backendItem.variant === "number"
            ? backendItem.variant
            : backendItem.variant?.id ?? null;

        return (
          serviceId === row.item.serviceId &&
          (variantId === null ? null : Number(variantId)) === backendVariantId
        );
      });

      if (!matchingBackendItem) {
        await checkoutRequest("/cart/items/", {
          method: "POST",
          body: {
            service: row.item.serviceId,
            variant: backendVariantId,
            quantity: row.item.quantity,
            selected_addons: addonIds,
          },
        });

        continue;
      }

      synchronizedItemIds.add(matchingBackendItem.id);
      await checkoutRequest(`/cart/items/${matchingBackendItem.id}/`, {
        method: "PATCH",
        body: {
          quantity: row.item.quantity,
          selected_addons: addonIds,
        },
      });
    }

    for (const backendItem of backendItems) {
      if (!synchronizedItemIds.has(backendItem.id)) {
        await checkoutRequest(`/cart/items/${backendItem.id}/`, {
          method: "DELETE",
        });
      }
    }
  }

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      await syncBrowserCartToBackend();
      const quote = await checkoutRequest<CouponPreview>(
        "/bookings/validate-coupon/",
        { method: "POST", body: { coupon_code: code } },
      );
      setAppliedCoupon(quote);
      setCouponCode(quote.code);
    } catch (cause) {
      setCouponError(
        cause instanceof Error ? cause.message : "Could not apply this coupon.",
      );
    } finally {
      setApplyingCoupon(false);
    }
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
        coupon_code:
          appliedCoupon && Number(appliedCoupon.subtotal) === subtotal
            ? appliedCoupon.code
            : "",
      },
    });
  }

  async function startRazorpayPayment(
    booking: BookingResponse,
    formData: FormData,
  ): Promise<void> {
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const verification = await openRazorpayCheckout({
      bookingId: booking.id,
      customer: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        contact: phone,
      },
      request: checkoutRequest,
    });

    setBookingReference(
      verification.booking_reference ?? booking.booking_reference,
    );
  }

  async function getDirectUpiConfig(): Promise<DirectUpiConfig> {
    const config = await checkoutRequest<DirectUpiConfig>("/payments/upi/config/");
    if (!config.vpa || !config.payee_name) {
      throw new Error("Direct UPI payment details are not configured.");
    }
    return config;
  }

  function startDirectUpiPayment(
    booking: BookingResponse,
    config: DirectUpiConfig,
  ) {
    const amount = Number(booking.total_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("The booking amount returned by the server is invalid.");
    }

    const params = new URLSearchParams({
      pa: config.vpa,
      pn: config.payee_name,
      am: amount.toFixed(2),
      cu: "INR",
      tn: `Zaapino booking ${booking.booking_reference}`,
    });

    setDirectUpiPayment({
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      amount,
      vpa: config.vpa,
      payeeName: config.payee_name,
      paymentUri: `upi://pay?${params.toString()}`,
    });
  }

  async function submitDirectUpiReference(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!directUpiPayment || submittingUpiReference) return;

    setCheckoutError("");
    setSubmittingUpiReference(true);
    try {
      await checkoutRequest("/payments/upi/submit/", {
        method: "POST",
        body: {
          booking_id: directUpiPayment.bookingId,
          transaction_reference: upiReference,
        },
      });
      setUpiSubmitted(true);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Could not submit the UPI transaction reference.",
      );
    } finally {
      setSubmittingUpiReference(false);
    }
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
        "Please log in to your Zaapino account before placing your booking.",
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

    if (
      couponCode.trim() &&
      (!appliedCoupon ||
        appliedCoupon.code !== couponCode.trim().toUpperCase() ||
        Number(appliedCoupon.subtotal) !== subtotal)
    ) {
      setCheckoutError("Apply the coupon code again or clear it before continuing.");
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
      const upiConfig =
        paymentMethod === "direct_upi"
          ? await getDirectUpiConfig()
          : null;
      await syncBrowserCartToBackend();

      const addressId = await getOrCreateAddress(formData);

      const booking = await createBooking(
        addressId,
        formData,
      );

      if (upiConfig) {
        startDirectUpiPayment(booking, upiConfig);
      } else {
        await startRazorpayPayment(booking, formData);
      }
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

  if (directUpiPayment) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              {upiSubmitted ? (
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              ) : (
                <Smartphone className="h-7 w-7 text-[var(--brand-blue)]" />
              )}
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
              {upiSubmitted ? "Payment submitted" : "Pay directly by UPI"}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              {upiSubmitted
                ? "Waiting for payment verification"
                : "Scan to pay for your booking"}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              {upiSubmitted
                ? "Your booking will remain pending until an administrator verifies the transaction. We will confirm it after review."
                : "Pay the exact amount below in your UPI app, then enter the UTR or transaction reference shown by your bank."}
            </p>
          </div>

          <div className="mt-7 grid gap-6 rounded-2xl bg-slate-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount to pay
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                {formatPrice(directUpiPayment.amount)}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                UPI ID
              </p>
              <p className="mt-1 break-all font-semibold text-slate-900">
                {directUpiPayment.vpa}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Payee: {directUpiPayment.payeeName}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Booking reference
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {directUpiPayment.bookingReference}
              </p>
              {!upiSubmitted ? (
                <a
                  href={directUpiPayment.paymentUri}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-blue)] px-5 text-sm font-semibold text-white"
                >
                  Open UPI app
                </a>
              ) : null}
            </div>
            {!upiSubmitted ? (
              <div className="mx-auto rounded-xl border border-slate-200 bg-white p-3">
                <QRCodeSVG value={directUpiPayment.paymentUri} size={180} />
              </div>
            ) : null}
          </div>

          {checkoutError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {checkoutError}
            </div>
          ) : null}

          {!upiSubmitted ? (
            <form onSubmit={submitDirectUpiReference} className="mt-6">
              <label className={labelClassName}>
                UTR / UPI transaction reference
                <input
                  value={upiReference}
                  onChange={(event) => setUpiReference(event.target.value)}
                  minLength={8}
                  maxLength={32}
                  required
                  autoComplete="off"
                  className={inputClassName}
                  placeholder="Enter the reference from your UPI app"
                />
              </label>
              <button
                type="submit"
                disabled={submittingUpiReference}
                className="mt-4 min-h-12 w-full rounded-xl bg-[var(--brand-blue)] px-5 text-sm font-bold text-white disabled:opacity-60"
              >
                {submittingUpiReference
                  ? "Submitting..."
                  : "I have paid - submit for verification"}
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                Do not submit a reference until your UPI app confirms the transfer.
                Never share your UPI PIN or OTP.
              </p>
            </form>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Submitted reference: <strong>{upiReference.trim()}</strong>. Your booking is not confirmed yet.
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/account" className="text-sm font-semibold text-[var(--brand-blue)] underline">
              View your account
            </Link>
          </div>
        </div>
      </main>
    );
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
              Thank you for booking with Zaapino. Your payment
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
        <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-slate-600">
            Home / Checkout
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Enter your details, choose a convenient service time,
            and securely complete your Zaapino booking.
          </p>
        </div>
      </section>

      {catalogStatus === "error" ? (
        <section className="mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
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
        <section className="mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {checkoutError}
          </div>
        </section>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
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
                    your Zaapino account.
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-2xl border p-4 ${paymentMethod === "razorpay" ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="mr-2 accent-[var(--brand-blue)]"
                  />
                  <span className="font-semibold text-slate-900">Razorpay</span>
                  <p className="ml-6 mt-1 text-sm text-slate-600">
                    UPI, cards, wallets and net banking
                  </p>
                </label>
                <label className={`cursor-pointer rounded-2xl border p-4 ${paymentMethod === "direct_upi" ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="direct_upi"
                    checked={paymentMethod === "direct_upi"}
                    onChange={() => setPaymentMethod("direct_upi")}
                    className="mr-2 accent-[var(--brand-blue)]"
                  />
                  <span className="font-semibold text-slate-900">Direct UPI</span>
                  <p className="ml-6 mt-1 text-sm text-slate-600">
                    Pay to Zaapino by UPI QR or app
                  </p>
                </label>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-blue)]" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      {paymentMethod === "razorpay"
                        ? "Secure payment with Razorpay"
                        : "Direct UPI with manual verification"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {paymentMethod === "razorpay"
                        ? "Choose UPI, cards, wallets or net banking in Razorpay Checkout. Your booking is confirmed after Razorpay verifies the payment."
                        : "A QR code and UPI app link will show the exact booking amount. Enter the UTR after paying; your booking stays pending until an administrator verifies it."}
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
                  I agree to the Zaapino terms and conditions and
                  understand that {paymentMethod === "direct_upi"
                    ? "my booking remains pending until my UPI payment is manually verified."
                    : "my booking will be confirmed after successful payment."}
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
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                    <Percent className="h-4 w-4" aria-hidden="true" />
                    50% off your first booking
                  </div>
                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    {firstOrderOffer?.eligible
                      ? "Your offer is automatically applied to the service subtotal."
                      : firstOrderOffer?.eligible === false
                        ? "This offer is for your first booking only."
                        : getAccessToken()
                          ? "Checking your offer eligibility…"
                          : "Sign in to check and apply your first-booking offer."}
                  </p>
                  {offerError ? (
                    <p className="mt-2 text-xs text-amber-800" role="status">
                      {offerError} The final discount will be confirmed by the server.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="coupon-code">
                  Have a coupon code?
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="coupon-code"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value.toUpperCase());
                      setAppliedCoupon(null);
                      setCouponError("");
                    }}
                    autoComplete="off"
                    placeholder="Enter coupon code"
                    className={`${inputClassName} mt-0 min-w-0 flex-1`}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="min-h-12 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {applyingCoupon ? "Checking…" : appliedCoupon ? "Apply again" : "Apply"}
                  </button>
                </div>
                {appliedCoupon && Number(appliedCoupon.subtotal) === subtotal ? (
                  <p className="mt-2 text-sm font-medium text-emerald-700" role="status">
                    {appliedCoupon.code} applied: −{formatPrice(couponDiscount)}. This stacks with the first-booking offer.
                  </p>
                ) : null}
                {appliedCoupon && Number(appliedCoupon.subtotal) !== subtotal ? (
                  <p className="mt-2 text-sm text-amber-800" role="status">
                    Your cart changed. Apply the coupon again to refresh the discount.
                  </p>
                ) : null}
                {couponError ? (
                  <p className="mt-2 text-sm text-red-700" role="alert">{couponError}</p>
                ) : null}
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {firstOrderDiscount > 0 ? (
                  <div className="flex items-center justify-between font-semibold text-emerald-700">
                    <span>First booking discount (50%)</span>
                    <span>−{formatPrice(firstOrderDiscount)}</span>
                  </div>
                ) : null}

                {couponDiscount > 0 ? (
                  <div className="flex items-center justify-between font-semibold text-emerald-700">
                    <span>Coupon discount ({appliedCoupon?.code})</span>
                    <span>−{formatPrice(couponDiscount)}</span>
                  </div>
                ) : null}

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
                  Your booking is confirmed after Razorpay verifies your payment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}