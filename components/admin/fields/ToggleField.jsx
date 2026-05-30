"use client";

import { cn } from "@/lib/admin/cn";

// On/off switch (e.g. "Highlight as featured"). Accessible via role=switch.
export function ToggleField({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-field bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description ? <p className="mt-1 text-xs text-ink-soft">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border transition-colors",
          value ? "border-brand-500 bg-brand-500" : "border-line bg-[#e8efea]",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            value ? "translate-x-7" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
