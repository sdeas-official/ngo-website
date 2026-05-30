"use client";

import { cn } from "@/lib/admin/cn";

// Neutral surface container used for section cards, list panels, editor blocks.
// `as` lets it render as a button (clickable cards) while keeping the styling.
export function Card({ as: Tag = "div", className, interactive, children, ...rest }) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-line bg-gradient-to-b from-surface-tint to-white shadow-card",
        interactive &&
          "text-left transition-colors hover:border-brand-500/40 hover:bg-surface-soft",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
