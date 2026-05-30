"use client";

import { cn } from "@/lib/admin/cn";

// Small status pill. Tones map to semantic states used across lists and nav.
const TONES = {
  neutral: "border-line bg-white text-ink-soft",
  brand: "border-brand-500/35 bg-brand-500/10 text-brand-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  alert: "border-rose-200 bg-rose-50 text-rose-600",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// A solid dot for "needs attention" cues (e.g. pending count in the sidebar).
export function Dot({ tone = "alert", className }) {
  const colors = {
    alert: "bg-rose-500",
    brand: "bg-brand-500",
    warning: "bg-amber-500",
  };
  return <span className={cn("inline-block h-2 w-2 rounded-full", colors[tone], className)} />;
}
