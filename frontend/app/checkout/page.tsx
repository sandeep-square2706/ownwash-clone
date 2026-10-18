"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Landmark,
  LockKeyhole,
  MapPin,
  Percent,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { readCart, subscribeToStore, type CartItem } from "@/lib/client-store";
import ServiceImageCarousel from "@/components/services/ServiceImageCarousel";
import useServiceCatalog from "@/hooks/useServiceCatalog";
import { formatPrice, getAddonTotal, getPreviewConvenienceFee } from "@/lib/services";

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

const paymentMethods: {
  id: PaymentMethod;
  title: string;
  detail: string;
  icon: typeof Smartphone;
  brands: string[];
}[] = [
  {
    id: "upi",
    title: "UPI",
    detail: "Pay using any UPI app",
    icon: Smartphone,
    brands: ["GPay", "PhonePe", "Paytm"],
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    detail: "Visa, Mastercard, RuPay, etc.",
    icon: CreditCard,
    brands: ["VISA", "mastercard", "RuPay"],
  },
  {
    id: "netbanking",
    title: "Net Banking",
    detail: "All major banks",
    icon: Landmark,
    brands: [],
  },
  {
    id: "wallet",
    title: "Wallets",
    detail: "Paytm, Amazon Pay, etc.",
    icon: Wallet,
    brands: ["Paytm", "Amazon Pay"],
  },
];

export default function CheckoutPage() {
  const { services: catalog, status: catalogStatus, error: catalogError, retry } = useServiceCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const convenienceFee = getPreviewConvenienceFee();

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();
    return subscribeToStore(syncCart);
  }, []);

  const rows = useMemo(
    () =>
      items.flatMap((item) => {
        const service = catalog.find((candidate) => candidate.id === item.serviceId);
        if (!service) return [];
        const variant = service.variants?.find(
          (option) => option.id === item.variantId,
        );
        const unitPrice =
          (variant?.price ?? service.basePrice ?? service.minPrice ?? 0) +
          getAddonTotal(service, item.addonIds);
        const selectedAddons = (service.addons ?? []).filter((addon) =>
          item.addonIds?.includes(addon.id),
        );
        return [{ item, service, variant, unitPrice, selectedAddons }];
      }),
    [catalog, items],
  );
  const subtotal = rows.reduce(
    (sum, row) => sum + row.unitPrice * row.item.quantity,
    0,
  );
  const total = subtotal + convenienceFee;
  const featured = rows[0];

  function applyPromo() {
    setPromoMessage(
      promoCode.trim()
        ? "Promo code validation will be available when checkout is connected."
        : "Enter a promo code to continue.",
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f6ff] px-3 py-5 text-[#13244d] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1220px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white bg-white px-5 py-4 shadow-sm sm:px-7">
          <Link href="/" className="flex items-center gap-3" aria-label="CleanKart home">
            <Image
              src="/images/logo/cleankart-logo.png"
              alt=""
              width={72}
              height={72}
              priority
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
            <span>
              <span className="block text-2xl font-black leading-none tracking-tight sm:text-3xl">
                Clean<span className="text-blue-600">Kart</span>
              </span>
              <span className="mt-1 block text-xs text-slate-500 sm:text-sm">
                Home · Car · Office Cleaning Services
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-3 py-2.5 text-emerald-800 sm:px-4">
            <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold">Checkout preview</p>
              <p className="text-xs text-emerald-700">Payment setup is not connected</p>
            </div>
          </div>
        </header>

        {catalogStatus === "loading" ? (
          <section className="rounded-3xl border border-white bg-white p-8 text-center shadow-sm sm:p-12" role="status">
            <p className="text-sm text-slate-600">Loading your booking details…</p>
          </section>
        ) : catalogStatus === "error" ? (
          <section className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm sm:p-12" role="alert">
            <h1 className="text-2xl font-bold">Checkout details are unavailable</h1>
            <p className="mt-2 text-sm text-slate-600">{catalogError}</p>
            <button type="button" onClick={retry} className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Try again</button>
          </section>
        ) : rows.length === 0 ? (
          <section className="rounded-3xl border border-white bg-white p-8 text-center shadow-sm sm:p-12">
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-slate-600">
              Add a cleaning service before continuing to checkout.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse services
            </Link>
          </section>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="grid items-start gap-5 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6"
          >
            <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm">
              <div className="relative h-56 sm:h-[330px]">
                <ServiceImageCarousel
                  images={featured.service.images}
                  title={featured.service.name}
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="h-full w-full"
                />
              </div>
              <div className="p-5 sm:p-7">
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                  {featured.service.name}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {featured.service.description}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {featured.service.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {rows.length > 1 && (
                  <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
                      Also in your booking
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                      {rows.slice(1).map(({ item, service, variant, selectedAddons }) => (
                        <li key={service.id + "-" + (item.variantId ?? "base")}>
                          {service.name}{variant ? " · " + variant.name : ""}{selectedAddons.length ? ` · ${selectedAddons.map((addon) => addon.name).join(", ")}` : ""} · Qty {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                  <div className="flex items-center gap-3 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">Service option</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {featured.variant?.name ?? "Standard service"}
                      </p>
                    </div>
                    <Link href="/cart" className="text-sm font-semibold text-blue-600 underline underline-offset-2">
                      Change
                    </Link>
                  </div>
                  <div className="flex items-start gap-3 py-4">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <label className="block text-sm font-bold">
                        Service address
                        <input
                          required
                          name="address"
                          autoComplete="street-address"
                          placeholder="House, street and area"
                          className="mt-1.5 block min-h-10 w-full rounded-lg border border-blue-100 bg-blue-50/40 px-2.5 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label className="text-sm font-bold">
                          City
                          <input
                            required
                            name="city"
                            autoComplete="address-level2"
                            placeholder="City"
                            className="mt-1.5 block min-h-10 w-full rounded-lg border border-blue-100 bg-white px-2.5 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                        <label className="text-sm font-bold">
                          PIN code
                          <input
                            required
                            name="postalCode"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            autoComplete="postal-code"
                            placeholder="6-digit PIN code"
                            className="mt-1.5 block min-h-10 w-full rounded-lg border border-blue-100 bg-white px-2.5 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    <h2 className="text-sm font-bold">Contact details</h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="text-sm font-medium text-slate-700">
                        Full name
                        <input
                          required
                          name="customerName"
                          autoComplete="name"
                          placeholder="Your name"
                          className="mt-1.5 block h-10 w-full rounded-lg border border-blue-100 bg-white px-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                      <label className="text-sm font-medium text-slate-700">
                        Mobile number
                        <input
                          required
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          autoComplete="tel-national"
                          placeholder="10-digit mobile number"
                          className="mt-1.5 block h-10 w-full rounded-lg border border-blue-100 bg-white px-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                      <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                        Email address
                        <input
                          required
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="mt-1.5 block h-10 w-full rounded-lg border border-blue-100 bg-white px-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-4 py-4 sm:grid-cols-2">
                    <label className="flex min-w-0 gap-3 text-sm font-bold">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        Date
                        <input
                          required
                          type="date"
                          className="mt-1.5 block h-9 w-full rounded-lg border border-blue-100 bg-white px-2 text-xs font-normal text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                      </span>
                    </label>
                    <label className="flex min-w-0 gap-3 text-sm font-bold">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                        <Clock3 className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        Time
                        <select
                          required
                          defaultValue=""
                          className="mt-1.5 block h-9 w-full rounded-lg border border-blue-100 bg-white px-2 text-xs font-normal text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="" disabled>Choose a slot</option>
                          <option>9:00 AM – 12:00 PM</option>
                          <option>12:00 PM – 3:00 PM</option>
                          <option>3:00 PM – 6:00 PM</option>
                        </select>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-2xl font-bold sm:text-3xl">Payment Details</h2>
              <div className="mt-5 rounded-2xl bg-[#f2f7ff] p-4 sm:p-5">
                <div className="space-y-3">
                  {rows.map(({ item, service, variant, unitPrice, selectedAddons }) => (
                    <div key={service.id + "-" + (item.variantId ?? "base")} className="flex justify-between gap-3 text-sm text-slate-600">
                      <span className="min-w-0">{service.name}{variant ? " · " + variant.name : ""}{selectedAddons.length ? ` · ${selectedAddons.map((addon) => addon.name).join(", ")}` : ""} × {item.quantity}</span>
                      <span className="shrink-0">{formatPrice(unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-dashed border-blue-200 pt-3 text-sm text-slate-600">
                    <span>Convenience fee</span>
                    <span>{formatPrice(convenienceFee)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-blue-200 pt-4">
                  <span className="text-base font-bold">Total Amount</span>
                  <span className="text-3xl font-black tracking-tight text-blue-600 sm:text-4xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <fieldset className="mt-6">
                <legend className="mb-3 text-xl font-bold">Choose Payment Method</legend>
                <div className="overflow-hidden rounded-2xl border border-blue-100">
                  {paymentMethods.map(({ id, title, detail, icon: Icon, brands }) => (
                    <label
                      key={id}
                      className={
                        "flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-3.5 last:border-b-0 sm:gap-4 sm:px-4 " +
                        (paymentMethod === id ? "bg-blue-50/70" : "bg-white hover:bg-slate-50")
                      }
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="h-4 w-4 shrink-0 accent-blue-600"
                      />
                      <Icon className="hidden h-5 w-5 shrink-0 text-blue-700 sm:block" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{title}{id === "upi" ? " (Recommended)" : ""}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
                      </span>
                      {brands.length > 0 && (
                        <span className="flex shrink-0 flex-wrap justify-end gap-1.5 text-[10px] font-extrabold text-blue-800 sm:gap-2 sm:text-xs">
                          {brands.map((brand) => (
                            <span key={brand} className="rounded-md bg-white px-1.5 py-1 shadow-sm">{brand}</span>
                          ))}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Percent className="h-5 w-5" />
                  </span>
                  <label htmlFor="promo-code" className="flex-1 text-sm font-bold text-emerald-800">
                    Have a promo code?
                  </label>
                  <button type="button" onClick={() => setPromoOpen((open) => !open)} className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                    Apply <ChevronDown className={"h-4 w-4 transition " + (promoOpen ? "rotate-180" : "")} />
                  </button>
                </div>
                {promoOpen && (
                  <div className="mt-3 flex gap-2">
                    <input
                      id="promo-code"
                      value={promoCode}
                      onChange={(event) => setPromoCode(event.target.value)}
                      placeholder="Enter promo code"
                      className="h-10 min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                    <button type="button" onClick={applyPromo} className="rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800">
                      Apply
                    </button>
                  </div>
                )}
                {promoMessage && <p className="mt-2 text-xs leading-5 text-emerald-800" role="status">{promoMessage}</p>}
              </div>

              <button
                type="submit"
                className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 sm:text-lg"
              >
                <LockKeyhole className="h-5 w-5" />
                Preview payment · {formatPrice(total)}
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                This frontend preview does not take payment or create a booking.
              </p>
              {submitted && (
                <p className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800" role="status">
                  Payment preview ready. No payment was processed and no booking was created.
                </p>
              )}
              <Link href="/cart" className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900">
                Review cart <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}
