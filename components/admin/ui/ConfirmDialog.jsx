"use client";

import { useEffect } from "react";
import { Button } from "@/components/admin/ui/Button";

// Accessible confirm modal that replaces window.confirm() for destructive actions.
// Controlled via `open`; resolves through onConfirm / onCancel.
export function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-pop"
      >
        <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
