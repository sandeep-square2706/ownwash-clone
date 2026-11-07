"use client";

export function EmptyState({ title = "No data yet", message = "Real records will appear here when they are created." }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">○</div>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

export function DataTable({
  children,
  headers,
  loading,
  empty,
  colSpan = 1
}: {
  children: React.ReactNode;
  headers: string[];
  loading?: boolean;
  empty?: boolean;
  colSpan?: number;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={colSpan} className="table-message">Loading real data…</td></tr>
          ) : empty ? (
            <tr><td colSpan={colSpan}><EmptyState /></td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}
