"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

type AdminReview = {
  id: number;
  name: string;
  email: string;
  service: string;
  rating: number;
  review_text: string;
  status: string;
  admin_notes?: string;
  user_id?: number | null;
  created_at?: string;
  updated_at?: string;
};

type ReviewResponse =
  | AdminReview[]
  | {
      results: AdminReview[];
    };

function rows(response: ReviewResponse): AdminReview[] {
  return Array.isArray(response) ? response : response.results;
}

export default function ReviewsPage() {
  const [data, setData] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<ReviewResponse>(
        "/reviews/admin/",
      );

      setData(rows(response));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">QUALITY</p>

          <h2>Reviews</h2>

          <p>
            Moderate customer reviews from the real database.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="panel">
        <DataTable
          headers={[
            "Customer",
            "Service",
            "Rating",
            "Review",
            "Status",
            "Action",
          ]}
          loading={loading}
          empty={!loading && !data.length}
          colSpan={6}
        >
          {data.map((review) => (
            <tr key={review.id}>
              <td>
                <div>
                  <strong>
                    {review.name || "—"}
                  </strong>

                  {review.email && (
                    <div className="muted">
                      {review.email}
                    </div>
                  )}
                </div>
              </td>

              <td>
                {review.service || "—"}
              </td>

              <td>
                <span
                  aria-label={`${review.rating} out of 5 stars`}
                  style={{
                    color: "#f4b63f",
                    letterSpacing: "2px",
                  }}
                >
                  {"★".repeat(
                    Math.max(
                      0,
                      Math.min(5, review.rating || 0),
                    ),
                  )}
                </span>
              </td>

              <td className="review-cell">
                {review.review_text || "—"}
              </td>

              <td>
                <StatusBadge value={review.status} />
              </td>

              <td>
                <button
                  type="button"
                  className="link-btn"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </section>
  );
}