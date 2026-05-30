"use client";

import { cn } from "@/lib/admin/cn";

// Pulsing placeholder used for loading states instead of a status string.
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-line/60", className)} />;
}

// Convenience: a stack of card-shaped skeletons for list/section loading.
export function SkeletonCards({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-3xl" />
      ))}
    </div>
  );
}
