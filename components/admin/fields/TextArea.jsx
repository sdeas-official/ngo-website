"use client";

import { cn } from "@/lib/admin/cn";
import { inputClass, labelClass, helpClass } from "@/components/admin/fields/fieldStyles";

export function TextArea({ label, value, onChange, placeholder, help, error, required, big }) {
  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          inputClass,
          "rounded-2xl leading-relaxed",
          big ? "min-h-64" : "min-h-32",
          error && "border-rose-300 focus:border-rose-400",
        )}
      />
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
      {!error && help ? <p className={helpClass}>{help}</p> : null}
    </div>
  );
}
