export function StatusBadge({ value }: { value?: string | null }) {
  const normalized = (value || "—").toLowerCase().replaceAll(" ", "_");
  const tone =
    ["completed","active","accepted","approved","success","paid","sent"].includes(normalized) ? "success" :
    ["pending","pending_payment","draft","scheduled","under_review"].includes(normalized) ? "warning" :
    ["cancelled","canceled","rejected","failed","suspended"].includes(normalized) ? "danger" :
    ["ongoing","in_progress","on_duty","processing"].includes(normalized) ? "info" : "neutral";
  return <span className={`status ${tone}`}>{value || "—"}</span>;
}
