"use client";

import { Plus, X } from "lucide-react";
import { labelClass } from "@/components/admin/fields/fieldStyles";

// Repeater of { icon, title, desc } items (the About "Core Values" cards). The
// page serializes the resulting array to a JSON string for Appwrite.
export function ValuesList({ label, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  function setItem(index, key, val) {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: val } : it)));
  }
  function add() {
    onChange([...items, { icon: "", title: "", desc: "" }]);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl border border-field bg-white p-4">
      {label ? <label className={labelClass}>{label}</label> : null}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-soft">Value {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove value"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={item.icon || ""}
                onChange={(e) => setItem(index, "icon", e.target.value)}
                placeholder="Icon (emoji)"
                className="w-24 rounded-xl border border-field bg-white px-3 py-2.5 text-center text-sm text-ink outline-none focus:border-brand-500"
              />
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => setItem(index, "title", e.target.value)}
                placeholder="Title"
                className="flex-1 rounded-xl border border-field bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
              />
            </div>
            <textarea
              value={item.desc || ""}
              onChange={(e) => setItem(index, "desc", e.target.value)}
              placeholder="Description"
              spellCheck={false}
              className="mt-2 min-h-20 w-full rounded-xl border border-field bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex h-8 items-center gap-1 rounded-full border border-brand-500 bg-white px-3 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" /> Add value
      </button>
    </div>
  );
}
