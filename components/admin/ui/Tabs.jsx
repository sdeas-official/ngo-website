"use client";

import { cn } from "@/lib/admin/cn";
import { Badge } from "@/components/admin/ui/Badge";

// Underline-style tab bar. `tabs` = [{ key, label, count?, tone? }].
export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1 border-b border-line", className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive ? "text-brand-600" : "text-ink-soft hover:text-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <Badge tone={tab.tone || (isActive ? "brand" : "neutral")}>{tab.count}</Badge>
            ) : null}
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-500" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
