"use client";

import { cn } from "@/lib/admin/cn";

// Friendly empty placeholder with an optional primary action. Replaces the
// scattered "No X yet" dashed boxes in the legacy panel.
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
          <Icon className="h-6 w-6" />
        </span>
      ) : null}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
