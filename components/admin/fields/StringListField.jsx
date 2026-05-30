"use client";

import { Plus, X } from "lucide-react";
import { labelClass } from "@/components/admin/fields/fieldStyles";

// Repeater of plain strings (program key points, donation benefits). Always keeps
// at least one row so the UI never collapses to nothing.
export function StringListField({ label, value, onChange, placeholderPrefix = "Item", error }) {
  const items = value && value.length ? value : [""];

  function setItem(index, next) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }
  function addItem() {
    onChange([...items, ""]);
  }
  function removeItem(index) {
    const copy = items.filter((_, i) => i !== index);
    onChange(copy.length ? copy : [""]);
  }

  return (
    <div className="rounded-2xl border border-field bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {label ? <label className={labelClass + " mb-0"}>{label}</label> : <span />}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-brand-500 bg-white px-3 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(index, e.target.value)}
              placeholder={`${placeholderPrefix} ${index + 1}`}
              className="flex-1 rounded-xl border border-field bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
              aria-label="Remove"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300 bg-white text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
