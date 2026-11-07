"use client";

import { useCallback, useEffect, useState } from "react";

import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { apiRequest } from "@/lib/api";
import type { ListResponse, Payment } from "@/lib/types";

function rows(response: ListResponse<Payment>): Payment[] {
  return Array.isArray(response) ? response : response.results;
}

export default function PaymentsPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyPaymentId, setBusyPaymentId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(rows(await apiRequest<ListResponse<Payment>>("/admin/payments/")));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load payment records.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(payment: Payment, decision: "approve" | "reject") {
    const note =
      decision === "reject"
        ? window.prompt("Enter the reason for rejecting this UPI payment:")?.trim()
        : "";
    if (decision === "reject" && !note) return;
    if (
      decision === "approve" &&
      !window.confirm(
        `Verify UTR ${payment.upi_transaction_reference} and confirm booking ${payment.booking_reference}?`,
      )
    ) {
      return;
    }

    setBusyPaymentId(payment.id);
    setError("");
    try {
      await apiRequest(`/admin/payments/${payment.id}/upi-review/`, {
        method: "POST",
        body: { decision, ...(note ? { note } : {}) },
      });
      await load();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Could not review this UPI payment.",
      );
    } finally {
      setBusyPaymentId(null);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">FINANCE</p>
          <h2>Payments &amp; Refunds</h2>
          <p>Review direct UPI submissions and inspect payment records.</p>
        </div>
        <button className="secondary-btn" onClick={() => void load()} disabled={loading}>
          Refresh
        </button>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="panel">
        <DataTable
          headers={[
            "Payment ID",
            "Booking",
            "Amount",
            "Method",
            "UTR / Reference",
            "Status",
            "Created",
            "Action",
          ]}
          loading={loading}
          empty={!loading && !data.length}
          colSpan={8}
        >
          {data.map((payment) => (
            <tr key={payment.id}>
              <td>#{payment.id}</td>
              <td>
                {payment.booking_reference || payment.booking_id || "—"}
              </td>
              <td>
                {payment.amount !== undefined
                  ? `₹${Number(payment.amount).toLocaleString("en-IN")}`
                  : "—"}
              </td>
              <td>{payment.method || "—"}</td>
              <td>{payment.upi_transaction_reference || "—"}</td>
              <td>
                <StatusBadge value={payment.status || "UNKNOWN"} />
              </td>
              <td>{payment.created_at || "—"}</td>
              <td>
                {payment.method === "DIRECT_UPI" &&
                payment.status === "PENDING_REVIEW" ? (
                  <div className="form-row" style={{ gap: 8 }}>
                    <button
                      className="link-btn"
                      disabled={busyPaymentId === payment.id}
                      onClick={() => void review(payment, "approve")}
                    >
                      {busyPaymentId === payment.id ? "Saving..." : "Approve"}
                    </button>
                    <button
                      className="link-btn"
                      disabled={busyPaymentId === payment.id}
                      onClick={() => void review(payment, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    className="link-btn"
                    onClick={() =>
                      window.location.assign(`/admin/payments/${payment.id}`)
                    }
                  >
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </section>
  );
}
