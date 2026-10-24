"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  admin_notes: string;
  user_id: number | null;
  created_at: string;
  updated_at: string;
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const [status, setStatus] =
    useState<ContactMessage["status"]>("NEW");

  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<ContactMessage[]>(
        "/contact/admin/"
      );

      setMessages(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load contact messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  function openMessage(message: ContactMessage) {
    setSelectedMessage(message);
    setStatus(message.status);
    setAdminNotes(message.admin_notes || "");
  }

  async function updateMessage() {
    if (!selectedMessage) return;

    try {
      setSaving(true);

      await apiRequest(
        `/contact/admin/${selectedMessage.id}/`,
        {
          method: "PATCH",
          body: {
            status,
            admin_notes: adminNotes,
          },
        }
      );

      setSelectedMessage(null);
      await loadMessages();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update message."
      );
    } finally {
      setSaving(false);
    }
  }

  function statusLabel(value: ContactMessage["status"]) {
    if (value === "IN_PROGRESS") return "In Progress";
    if (value === "RESOLVED") return "Resolved";
    return "New";
  }

  function statusClass(value: ContactMessage["status"]) {
    if (value === "RESOLVED") {
      return "bg-green-100 text-green-700";
    }

    if (value === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Contact Messages
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Messages submitted through the CleanKart contact form.
            </p>
          </div>

          <button
            onClick={loadMessages}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading contact messages...
          </div>
        )}

        {/* Empty */}
        {!loading && !error && messages.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
              ✉️
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No contact messages
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer messages will appear here after they submit
              the contact form.
            </p>
          </div>
        )}

        {/* Messages table */}
        {!loading && messages.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Message
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      onClick={() => openMessage(message)}
                      className="cursor-pointer transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">
                          {message.name}
                        </div>

                        <div className="text-xs text-slate-400">
                          #{message.id}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm text-slate-700">
                          {message.email}
                        </div>

                        {message.phone && (
                          <div className="mt-1 text-xs text-slate-400">
                            {message.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {message.service || "General enquiry"}
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {message.message}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                            message.status
                          )}`}
                        >
                          {statusLabel(message.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {new Date(
                          message.created_at
                        ).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Message details modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Contact Message
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Message #{selectedMessage.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* Customer details */}
            <div className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Service
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedMessage.service ||
                      "General enquiry"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedMessage.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedMessage.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Customer Message
                </p>

                <div className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as ContactMessage["status"]
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              {/* Admin notes */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Admin Notes
                </label>

                <textarea
                  value={adminNotes}
                  onChange={(event) =>
                    setAdminNotes(event.target.value)
                  }
                  rows={4}
                  placeholder="Add internal notes..."
                  className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={updateMessage}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}