"use client";

import { Pencil } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { cn } from "@/lib/admin/cn";

// A page-section row on a Page overview (Home/About). Shows the section title, a
// short summary, optional thumbnail strip, and an Edit button that opens the
// slide-over. The whole card is clickable for discoverability.
export function SectionCard({ title, description, summary, thumbnails = [], onEdit, badge }) {
  return (
    <Card interactive as="div" className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-wide text-ink uppercase">{title}</h3>
            {badge}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-ink-soft">{description}</p>
          ) : null}

          {thumbnails.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {thumbnails.map((src, i) =>
                src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-12 w-16 rounded-lg object-cover ring-1 ring-black/5"
                  />
                ) : (
                  <span
                    key={i}
                    className="flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-line text-[10px] text-ink-soft"
                  >
                    empty
                  </span>
                ),
              )}
            </div>
          ) : null}

          {summary ? <p className="mt-2 text-sm text-ink-soft">{summary}</p> : null}
        </div>

        <button
          type="button"
          onClick={onEdit}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-brand-500 bg-white px-4 text-xs font-semibold text-brand-600 transition-colors",
            "hover:bg-brand-500 hover:text-white",
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    </Card>
  );
}
