"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/admin/cn";

// Right-hand slide-over panel — the primary focused-editing surface for page
// sections. The page stays visible (dimmed) behind it for context. The footer
// slot is sticky so Save/Cancel are always reachable.
//
// Close is routed through `onRequestClose` so a parent can intercept it to run
// the unsaved-changes guard before actually closing.
export function SlideOver({
  open,
  title,
  description,
  onRequestClose,
  footer,
  children,
  width = "max-w-xl",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onRequestClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onRequestClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Scrim */}
      <div
        onClick={onRequestClose}
        className={cn(
          "absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-pop transition-transform duration-300 ease-out sm:rounded-l-3xl",
          width,
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onRequestClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer ? (
          <footer className="border-t border-line bg-surface-soft px-5 py-4 sm:px-6">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}
