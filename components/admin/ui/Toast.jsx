"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/admin/cn";

const ToastContext = createContext(null);

const TONE_STYLES = {
  success: { ring: "border-emerald-200", icon: CheckCircle2, color: "text-emerald-600" },
  error: { ring: "border-rose-200", icon: AlertTriangle, color: "text-rose-600" },
  info: { ring: "border-line", icon: Info, color: "text-ink-soft" },
};

// Global toast hub. Call `toast({ message, tone, action })` from anywhere.
// `action` = { label, onClick } renders an inline button (e.g. "Undo").
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, tone = "success", action, duration = 5000 }) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev, { id, message, tone, action }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((t) => {
          const style = TONE_STYLES[t.tone] || TONE_STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-pop",
                style.ring,
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", style.color)} />
              <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
              {t.action ? (
                <button
                  type="button"
                  onClick={() => {
                    t.action.onClick?.();
                    dismiss(t.id);
                  }}
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  {t.action.label}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-ink-soft hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe no-op fallback so components can be previewed outside the provider.
    return { toast: () => {}, dismiss: () => {} };
  }
  return ctx;
}
