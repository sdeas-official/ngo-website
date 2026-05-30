"use client";

import { Plus, X } from "lucide-react";
import { labelClass } from "@/components/admin/fields/fieldStyles";

// Repeater of { label, href } links. Used for nav items and footer link columns.
// Operates on an array value; the page serializes it to JSON for Appwrite.
export function LinkListField({ label, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  function setItem(index, key, val) {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: val } : it)));
  }
  function add() {
    onChange([...items, { label: "", href: "" }]);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label ? <label className={labelClass}>{label}</label> : null}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item.label || ""}
              onChange={(e) => setItem(index, "label", e.target.value)}
              placeholder="Label"
              className="w-2/5 rounded-xl border border-field bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
            />
            <input
              type="text"
              value={item.href || ""}
              onChange={(e) => setItem(index, "href", e.target.value)}
              placeholder="/link or https://…"
              className="flex-1 rounded-xl border border-field bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove link"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex h-8 items-center gap-1 rounded-full border border-brand-500 bg-white px-3 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" /> Add link
      </button>
    </div>
  );
}
