"use client";

import { cn } from "@/lib/admin/cn";
import { inputClass, labelClass, helpClass } from "@/components/admin/fields/fieldStyles";

// Single-line input covering text / url / number / datetime-local / tag.
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  help,
  error,
  required,
  min,
  step,
}) {
  const inputType =
    type === "number" ? "number" : type === "datetime" ? "datetime-local" : type === "url" ? "url" : "text";

  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <input
        type={inputType}
        value={value ?? ""}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, error && "border-rose-300 focus:border-rose-400")}
      />
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
      {!error && help ? <p className={helpClass}>{help}</p> : null}
    </div>
  );
}
