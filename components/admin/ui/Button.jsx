"use client";

import { cn } from "@/lib/admin/cn";

// Single source of truth for buttons across the admin. Variants encode intent
// (primary action / secondary / quiet / destructive) so screens stop re-declaring
// full Tailwind class strings. Sizes: sm | md.
const VARIANTS = {
  primary:
    "bg-brand-500 text-white shadow-[0_10px_20px_rgba(99,195,122,0.32)] hover:-translate-y-px hover:bg-brand-600",
  secondary:
    "border border-brand-500 bg-white text-brand-600 hover:bg-brand-500 hover:text-white",
  ghost:
    "border border-line-soft bg-white text-ink-muted hover:bg-surface-soft",
  danger:
    "border border-rose-300 bg-white text-rose-600 hover:bg-rose-600 hover:text-white",
};

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-6 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
