"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound, Trash2 } from "lucide-react";

import { clearAuth, getCurrentUserData } from "@/lib/auth";
import type { Service } from "@/lib/services";
import useServiceCatalog from "@/hooks/useServiceCatalog";

import {
  readWishlist,
  subscribeToStore,
  toggleWishlist,
} from "@/lib/client-store";

type Section =
  | "dashboard"
  | "orders"
  | "downloads"
  | "addresses"
  | "details"
  | "wishlist";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [section, setSection] = useState<Section>("dashboard");
  const [customerName, setCustomerName] =
    useState("CleanKart Customer");

  useEffect(() => {
    const user = getCurrentUserData();

    if (!user) {
      router.push("/login");
      return;
    }

    setCustomerName(
      user.username ||
        user.email?.split("@")[0] ||
        "CleanKart Customer",
    );
  }, [router]);

  function logout() {
    clearAuth();
    router.push("/login");
    router.refresh();
  }

  function changeSection(nextSection: Section) {
    setSection(nextSection);
  }

  return (
    <main className="min-h-[65vh] bg-white text-slate-900">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}
        <div className="border-b border-slate-200 py-5">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-slate-400 transition hover:text-[var(--brand-blue)]"
            >
              Home
            </button>

            <span className="text-slate-300">›</span>

            <span className="font-medium text-[var(--brand-navy)]">
              My account
            </span>
          </div>
        </div>

        {/* WELCOME */}
        <div className="flex items-center gap-4 py-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--brand-blue)]">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Welcome back,
            </p>

            <p className="text-base font-bold text-[var(--brand-navy)]">
              {customerName}
            </p>
          </div>
        </div>

        {/* ACCOUNT LAYOUT */}
        <div className="grid gap-8 pb-16 lg:grid-cols-[300px_1fr]">

          {/* LEFT MENU */}
          <aside>
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">

              <MenuButton
                label="Dashboard"
                active={section === "dashboard"}
                onClick={() => changeSection("dashboard")}
              />

              <MenuButton
                label="Orders"
                active={section === "orders"}
                onClick={() => changeSection("orders")}
              />

              <MenuButton
                label="Downloads"
                active={section === "downloads"}
                onClick={() => changeSection("downloads")}
              />

              <MenuButton
                label="Addresses"
                active={section === "addresses"}
                onClick={() => changeSection("addresses")}
              />

              <MenuButton
                label="Account details"
                active={section === "details"}
                onClick={() => changeSection("details")}
              />

              <button
                type="button"
                onClick={logout}
                className="flex min-h-[52px] w-full items-center gap-2 border-b border-slate-200 px-4 text-left text-sm font-medium text-slate-800 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>

              <MenuButton
                label="Wishlist"
                active={section === "wishlist"}
                onClick={() => changeSection("wishlist")}
                last
              />

            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="min-w-0">

            {section === "dashboard" && (
              <Dashboard
                customerName={customerName}
                onLogout={logout}
              />
            )}

            {section === "orders" && <Orders />}

            {section === "downloads" && <Downloads />}

            {section === "addresses" && <Addresses />}

            {section === "details" && (
              <AccountDetails
                customerName={customerName}
              />
            )}

            {section === "wishlist" && <Wishlist />}

          </section>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MENU
========================================================= */

function MenuButton({
  label,
  active,
  onClick,
  last = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[52px] w-full items-center px-4 text-left text-sm font-medium transition",
        !last ? "border-b border-slate-200" : "",
        active
          ? "bg-blue-50 text-[var(--brand-blue)]"
          : "text-slate-800 hover:bg-blue-50 hover:text-[var(--brand-blue)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  customerName,
  onLogout,
}: {
  customerName: string;
  onLogout: () => void;
}) {
  return (
    <div className="pt-1">

      <p className="text-base leading-7 text-slate-800">
        Hello{" "}
        <strong className="font-semibold text-[var(--brand-navy)]">
          {customerName}
        </strong>{" "}
        <span className="text-slate-600">
          (not {customerName}?
        </span>{" "}
        <button
          type="button"
          onClick={onLogout}
          className="font-medium text-[var(--brand-blue)] hover:underline"
        >
          Log out
        </button>
        <span className="text-slate-600">)</span>
      </p>

      <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
        From your account dashboard you can view your recent orders,
        manage your service addresses, view your wishlist, and edit
        your account details.
      </p>

    </div>
  );
}

/* =========================================================
   ORDERS
========================================================= */

function Orders() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "cleankart_access_token",
        );

        if (!token) {
          setError("Please log in to view your orders.");
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_CLEANKART_API_URL ||
          "http://127.0.0.1:8000/api";

        const response = await fetch(
          `${apiUrl}/bookings/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load bookings (${response.status})`,
          );
        }

        const data = await response.json();

        /*
         * Supports both:
         * 1. Normal DRF array response
         * 2. Paginated DRF response { results: [] }
         */
        const bookingList = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        setBookings(bookingList);
      } catch (err) {
        console.error("Orders loading error:", err);
        setError(
          "Unable to load your orders right now. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  function formatDate(date: string) {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time: string) {
    if (!time) return "Not scheduled";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatCurrency(value: number | string) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function getStatusLabel(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-green-700";

      case "ASSIGNED":
        return "bg-blue-50 text-blue-700";

      case "IN_PROGRESS":
        return "bg-yellow-50 text-yellow-700";

      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "PENDING_PAYMENT":
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-[var(--brand-navy)]">
          Orders
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          View your CleanKart cleaning service bookings and order history.
        </p>

        <div className="mt-7 border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-[var(--brand-navy)]">
          Orders
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          View your CleanKart cleaning service bookings and order history.
        </p>

        <div className="mt-7 border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--brand-navy)]">
        Orders
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        View your CleanKart cleaning service bookings and order history.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-7 border border-slate-200 bg-white p-6">
          <p className="font-semibold text-[var(--brand-navy)]">
            No orders yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your completed and upcoming CleanKart bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-5">
          {bookings.map((booking) => {
            const isExpanded =
              expandedBooking === booking.id;

            return (
              <div
                key={booking.id}
                className="border border-slate-200 bg-white"
              >
                {/* ORDER HEADER */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Booking
                      </p>

                      <h3 className="mt-1 text-base font-bold text-[var(--brand-navy)]">
                        {booking.booking_reference}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        booking.status,
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  {/* BASIC INFO */}
                  <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Service
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {booking.items?.length
                          ? booking.items
                              .map(
                                (item) =>
                                  item.service_name,
                              )
                              .join(", ")
                          : "CleanKart Service"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Scheduled
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {formatDate(
                          booking.scheduled_date,
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatTime(
                          booking.scheduled_time,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-[var(--brand-navy)]">
                        {formatCurrency(
                          booking.total_amount,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedBooking(
                          isExpanded
                            ? null
                            : booking.id,
                        )
                      }
                      className="rounded-md bg-[var(--brand-blue)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-navy)]"
                    >
                      {isExpanded
                        ? "Hide details"
                        : "View details"}
                    </button>
                  </div>
                </div>

                {/* DETAILS */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <h4 className="font-semibold text-[var(--brand-navy)]">
                      Booking details
                    </h4>

                    {/* SERVICES */}
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-700">
                        Services
                      </p>

                      <div className="mt-3 space-y-3">
                        {booking.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-3 sm:flex-row"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {item.service_name}
                              </p>

                              {item.variant_name && (
                                <p className="text-xs text-slate-500">
                                  {item.variant_name}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-slate-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-[var(--brand-navy)]">
                              {formatCurrency(
                                item.total_price,
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ADDRESS */}
                    {booking.address && (
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-700">
                          Service address
                        </p>

                        <div className="mt-3 border border-slate-200 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {booking.address.full_name}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {booking.address.house_number},{" "}
                            {booking.address.street}
                            <br />
                            {booking.address.area}
                            {booking.address.landmark
                              ? `, ${booking.address.landmark}`
                              : ""}
                            <br />
                            {booking.address.city},{" "}
                            {booking.address.district}
                            <br />
                            {booking.address.state} -{" "}
                            {booking.address.pincode}
                          </p>

                          <p className="mt-2 text-sm text-slate-500">
                            Phone: {booking.address.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PRICE SUMMARY */}
                    <div className="mt-6 max-w-md border-t border-slate-200 pt-4">
                      <div className="flex justify-between py-1 text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>
                          {formatCurrency(
                            booking.subtotal,
                          )}
                        </span>
                      </div>

                      {Number(booking.discount) > 0 && (
                        <div className="flex justify-between py-1 text-sm text-green-600">
                          <span>Discount</span>
                          <span>
                            -
                            {formatCurrency(
                              booking.discount,
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between py-1 text-sm text-slate-600">
                        <span>Tax</span>
                        <span>
                          {formatCurrency(booking.tax)}
                        </span>
                      </div>

                      <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-[var(--brand-navy)]">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            booking.total_amount,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* NOTES */}
                    {booking.notes && (
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-700">
                          Notes
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DOWNLOADS
========================================================= */

function Downloads() {
  return (
    <div>

      <h2 className="text-xl font-bold text-[var(--brand-navy)]">
        Downloads
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your CleanKart invoices, receipts and service documents will
        appear here.
      </p>

      <div className="mt-7 border border-slate-200 bg-white p-6">

        <p className="font-semibold text-[var(--brand-navy)]">
          No downloads available
        </p>

        <p className="mt-2 text-sm text-slate-500">
          There are currently no documents available for your account.
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   ADDRESSES
========================================================= */

function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(
      "cleankart_addresses",
    );

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setAddresses(parsed);
      }
    } catch {
      localStorage.removeItem(
        "cleankart_addresses",
      );
    }
  }, []);

  function saveAddresses(next: Address[]) {
    setAddresses(next);

    localStorage.setItem(
      "cleankart_addresses",
      JSON.stringify(next),
    );
  }

  function submitAddress(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const newAddress: Address = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };

    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      return;
    }

    saveAddresses([
      ...addresses,
      newAddress,
    ]);

    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowForm(false);
  }

  function deleteAddress(id: string) {
    saveAddresses(
      addresses.filter(
        (address) => address.id !== id,
      ),
    );
  }

  return (
    <div>

      {/* HEADING */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-xl font-bold text-[var(--brand-navy)]">
            Addresses
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Manage the addresses where you want CleanKart services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="min-h-10 rounded-md bg-[var(--brand-blue)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-navy)]"
        >
          {showForm ? "Cancel" : "Add address"}
        </button>

      </div>

      {/* ADD ADDRESS FORM */}
      {showForm && (
        <form
          onSubmit={submitAddress}
          className="mt-7 border border-slate-200 bg-slate-50 p-6"
        >

          <h3 className="font-semibold text-[var(--brand-navy)]">
            Add new address
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <Input
              label="Full name"
              value={form.name}
              onChange={(value) =>
                setForm({
                  ...form,
                  name: value,
                })
              }
              placeholder="Your name"
            />

            <Input
              label="Phone number"
              value={form.phone}
              onChange={(value) =>
                setForm({
                  ...form,
                  phone: value,
                })
              }
              placeholder="Phone number"
            />

            <div className="sm:col-span-2">

              <label className="text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                value={form.address}
                onChange={(event) =>
                  setForm({
                    ...form,
                    address: event.target.value,
                  })
                }
                placeholder="House number, street, road"
                rows={3}
                required
                className="mt-2 w-full resize-none border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-blue)]"
              />

            </div>

            <Input
              label="City"
              value={form.city}
              onChange={(value) =>
                setForm({
                  ...form,
                  city: value,
                })
              }
              placeholder="City"
            />

            <Input
              label="State"
              value={form.state}
              onChange={(value) =>
                setForm({
                  ...form,
                  state: value,
                })
              }
              placeholder="State"
            />

            <Input
              label="Pincode"
              value={form.pincode}
              onChange={(value) =>
                setForm({
                  ...form,
                  pincode: value,
                })
              }
              placeholder="Pincode"
            />

          </div>

          <button
            type="submit"
            className="mt-5 min-h-10 rounded-md bg-[var(--brand-blue)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-navy)]"
          >
            Save address
          </button>

        </form>
      )}

      {/* SAVED ADDRESSES */}
      <div className="mt-7">

        {addresses.length === 0 ? (

          <div className="border border-slate-200 bg-white p-6">

            <p className="font-semibold text-[var(--brand-navy)]">
              No saved addresses
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add your home, office or other service location.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 text-sm font-semibold text-[var(--brand-blue)] hover:underline"
              >
                Add an address →
              </button>
            )}

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2">

            {addresses.map((address) => (

              <div
                key={address.id}
                className="border border-slate-200 bg-white p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="font-semibold text-[var(--brand-navy)]">
                      {address.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {address.phone}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteAddress(address.id)
                    }
                    aria-label={`Delete address for ${address.name}`}
                    className="text-slate-400 transition hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {address.address}
                  <br />
                  {address.city}
                  <br />
                  {address.state} - {address.pincode}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}
type BookingItem = {
  id: number;
  service_name: string;
  variant_name?: string | null;
  quantity: number;
  selected_addons?: Record<string, unknown>;
  unit_price: number | string;
  total_price: number | string;
};

type Booking = {
  id: number;
  booking_reference: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total_amount: number | string;
  notes?: string;
  created_at: string;
  address?: {
    id: number;
    full_name: string;
    phone: string;
    house_number: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    address_type?: string;
  } | null;
  items: BookingItem[];
};
/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>

      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required
        className="mt-2 h-11 w-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-blue)]"
      />

    </div>
  );
}

/* =========================================================
   ACCOUNT DETAILS
========================================================= */

function AccountDetails({
  customerName,
}: {
  customerName: string;
}) {
  const user = getCurrentUserData();

  return (
    <div>

      <h2 className="text-xl font-bold text-[var(--brand-navy)]">
        Account details
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your CleanKart account information.
      </p>

      <div className="mt-7 max-w-[650px]">

        <DetailField
          label="Name"
          value={customerName}
        />

        <DetailField
          label="Email address"
          value={user?.email || "Not available"}
        />

        <DetailField
          label="Phone number"
          value={user?.phone || "Not available"}
        />

      </div>

    </div>
  );
}

/* =========================================================
   DETAIL FIELD
========================================================= */

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mb-5">

      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="mt-2 border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {value}
      </div>

    </div>
  );
}

/* =========================================================
   WISHLIST
========================================================= */

function Wishlist() {
  const {
    services: catalogServices,
  } = useServiceCatalog();

  const [wishlistIds, setWishlistIds] = useState<number[]>(
    [],
  );

  const [wishlistLoading, setWishlistLoading] =
    useState(true);

  useEffect(() => {
    function syncWishlist() {
      setWishlistIds(readWishlist());
      setWishlistLoading(false);
    }

    syncWishlist();

    return subscribeToStore(syncWishlist);
  }, []);

  const wishlistServices =
    catalogServices.filter((service) =>
      wishlistIds.includes(service.id),
    );

  return (
    <div>

      {/* TITLE */}
      <h2 className="text-xl font-bold text-[var(--brand-navy)]">
        Wishlist
      </h2>

      {wishlistLoading ? (

        <p className="mt-8 text-sm text-slate-500">
          Loading your wishlist...
        </p>

      ) : wishlistServices.length === 0 ? (

        <div className="mt-7 border border-slate-200 bg-white p-6">

          <p className="font-semibold text-[var(--brand-navy)]">
            Your wishlist is empty
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Add services to your wishlist and they will appear here.
          </p>

        </div>

      ) : (

        <>

          {/* WISHLIST TABLE */}
          <div className="mt-7 overflow-x-auto border-t border-slate-200">

            <table className="w-full min-w-[850px] border-collapse">

              <thead>
                <tr className="border-b border-slate-200">

                  <th className="px-2 py-4 text-left text-sm font-semibold text-[var(--brand-navy)]">
                    Product
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--brand-navy)]">
                    Price
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--brand-navy)]">
                    Date Added
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--brand-navy)]">
                    Stock
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--brand-navy)]">
                    Add to cart
                  </th>

                  <th className="w-12 px-2 py-4" />

                </tr>
              </thead>

              <tbody>

                {wishlistServices.map((service) => (

                  <WishlistRow
                    key={service.id}
                    service={service}
                  />

                ))}

              </tbody>

            </table>

          </div>

          {/* SHARE */}
          <div className="mt-10">

            <p className="mb-3 text-sm text-slate-600">
              Share on:
            </p>

            <div className="flex gap-2">

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white"
              >
                f
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded bg-sky-500 text-sm font-bold text-white"
              >
                𝕏
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded bg-pink-500 text-sm font-bold text-white"
              >
                ◎
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded bg-blue-700 text-sm font-bold text-white"
              >
                in
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

/* =========================================================
   WISHLIST ROW
========================================================= */

function WishlistRow({
  service,
}: {
  service: Service;
}) {
  const price =
    service.minPrice ??
    service.basePrice ??
    service.variants?.[0]?.price ??
    0;

  const originalPrice =
    service.originalPrice ??
    service.variants?.[0]?.originalPrice;

  const image =
    service.images?.[0] ||
    "/images/generated/home-cleaning.webp";

  function removeService() {
    toggleWishlist(service.id);
  }

  return (
    <tr className="border-b border-slate-200">

      {/* PRODUCT */}
      <td className="px-2 py-4">

        <div className="flex items-center gap-5">

          <div className="h-16 w-16 shrink-0 overflow-hidden bg-slate-100">

            <img
              src={image}
              alt={service.name}
              className="h-full w-full object-cover"
            />

          </div>

          <div>

            <p className="font-medium text-slate-900">
              {service.name}
            </p>

          </div>

        </div>

      </td>

      {/* PRICE */}
      <td className="px-4 py-4">

        <div className="whitespace-nowrap text-sm">

          <span className="font-semibold text-[var(--brand-navy)]">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice !== undefined && (
            <span className="ml-1 text-slate-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}

        </div>

      </td>

      {/* DATE */}
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>

      {/* STOCK */}
      <td className="px-4 py-4 text-sm text-green-700">
        In Stock
      </td>

      {/* SELECT OPTIONS */}
      <td className="px-4 py-4">

        <a
          href={`/services/${service.slug}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-blue)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-navy)]"
        >
          Select options
        </a>

      </td>

      {/* REMOVE */}
      <td className="px-2 py-4 text-center">

        <button
          type="button"
          onClick={removeService}
          aria-label={`Remove ${service.name} from wishlist`}
          className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-300 text-xs text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
        >
          ×
        </button>

      </td>

    </tr>
  );
}