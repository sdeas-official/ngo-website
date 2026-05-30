"use client";

import { Plus, X } from "lucide-react";
import { ImageField } from "@/components/admin/fields/ImageField";
import { labelClass } from "@/components/admin/fields/fieldStyles";

// A repeater of images (each with its own upload/preview). Used for sets like the
// About vision photo grid. Operates on an array of image URLs.
export function ImageListField({ label, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  function setItem(index, url) {
    onChange(items.map((it, i) => (i === index ? url : it)));
  }
  function add() {
    onChange([...items, ""]);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl border border-field bg-white p-4">
      {label ? <label className={labelClass}>{label}</label> : null}
      <div className="space-y-4">
        {items.map((url, index) => (
          <div key={index} className="rounded-xl border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-soft">Image {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove image"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ImageField value={url} onChange={(v) => setItem(index, v)} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex h-8 items-center gap-1 rounded-full border border-brand-500 bg-white px-3 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" /> Add image
      </button>
    </div>
  );
}
