"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { Badge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/admin/cn";

// Searchable list of records for collection sections. Renders a row per document
// using the collection's list config (title / subtitle / thumbnail / price).
export function RecordListPanel({
  config,
  documents,
  isLoading,
  search,
  onSearch,
  activeId,
  onSelect,
  emptyIcon,
}) {
  const { list, label } = config;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full rounded-xl border border-field bg-white py-2.5 pr-3 pl-9 text-sm text-ink outline-none focus:border-brand-500"
        />
      </div>

      {isLoading ? (
        <SkeletonCards count={4} />
      ) : !documents.length ? (
        <EmptyState
          icon={emptyIcon}
          title={search ? "No matches" : `No ${label.toLowerCase()} yet`}
          description={search ? "Try a different search." : "Create your first one to get started."}
        />
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const title =
              (list.titleField && doc[list.titleField]) ||
              (list.titleKeys && list.titleKeys.map((k) => doc[k]).find(Boolean)) ||
              (list.titleFields && list.titleFields.map((k) => doc[k]).filter(Boolean).join(" ")) ||
              "Untitled";
            const subtitle =
              (list.subtitleField && doc[list.subtitleField]) ||
              (list.subtitleKeys && list.subtitleKeys.map((k) => doc[k]).find(Boolean)) ||
              "";
            const image = list.imageField ? doc[list.imageField] : "";
            const price = list.priceField ? doc[list.priceField] : undefined;
            const isActive = doc.$id === activeId;

            return (
              <Card
                key={doc.$id}
                as="button"
                interactive
                onClick={() => onSelect(doc)}
                className={cn("flex w-full items-center gap-3 p-3", isActive && "border-brand-500 bg-brand-500/5")}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-black/5" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-ink">{title}</p>
                  {subtitle ? <p className="line-clamp-1 text-xs text-ink-soft">{subtitle}</p> : null}
                  {typeof price !== "undefined" ? (
                    <p className="mt-0.5 text-xs text-ink-soft">
                      ₹{Number(price || 0).toLocaleString("en-IN")}
                    </p>
                  ) : null}
                </div>
                {(doc.best === true || doc.optimised === true) ? (
                  <Badge tone="brand">Featured</Badge>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
