"use client";

import { formatDateTime } from "@/features/admin/utils/datetime";

// Read-only detail renderer for an inbox submission, driven by channel.detail.fields.
// Each field resolves its value from the first non-empty key in `keys`.
export function InboxDetail({ fields, doc }) {
  function valueFor(field) {
    const raw = field.keys.map((k) => doc?.[k]).find((v) => v != null && v !== "");
    if (raw == null || raw === "") return "—";
    if (field.type === "datetime") return formatDateTime(raw) || "—";
    return String(raw);
  }

  const longFields = fields.filter((f) => f.type === "longtext");
  const shortFields = fields.filter((f) => f.type !== "longtext");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shortFields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-semibold tracking-[0.08em] text-ink-soft uppercase">
              {field.label}
            </p>
            <p className="mt-1 text-sm text-ink">{valueFor(field)}</p>
          </div>
        ))}
      </div>

      {longFields.map((field) => (
        <div key={field.label}>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink-soft uppercase">
            {field.label}
          </p>
          <p className="mt-2 rounded-2xl border border-field bg-white px-4 py-3 text-sm leading-relaxed text-ink">
            {valueFor(field)}
          </p>
        </div>
      ))}
    </div>
  );
}
