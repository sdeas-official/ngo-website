"use client";

import { useRouter, usePathname } from "next/navigation";
import { navGroups } from "@/features/admin/config/nav.config";
import { navIcons } from "@/components/admin/shell/icons";
import { Badge, Dot } from "@/components/admin/ui/Badge";
import { useUnsavedChanges } from "@/features/admin/state/UnsavedChangesProvider";
import { useAdminCounts } from "@/features/admin/state/AdminCountsProvider";
import { cn } from "@/lib/admin/cn";

// Grouped IA navigation (Pages / Content / Inbox). Navigation is routed through
// the unsaved-changes guard so a stray click can't discard an in-progress edit.
export function Sidebar({ onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();
  const { confirmDiscard } = useUnsavedChanges();
  const { counts } = useAdminCounts();

  function go(href) {
    if (pathname === href) return;
    if (!confirmDiscard()) return;
    router.push(href);
    onNavigate?.();
  }

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="space-y-5">
      <div>
        <p className="inline-flex rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-bold tracking-[0.16em] text-brand-600 uppercase">
          CMS Dashboard
        </p>
        <h1 className="mt-3 font-serif text-2xl font-bold text-ink">SDEAS Admin</h1>
      </div>

      {navGroups.map((group, gi) => (
        <div key={group.title || `group-${gi}`} className="space-y-1.5">
          {group.title ? (
            <p className="px-3 text-[11px] font-bold tracking-[0.14em] text-ink-soft/70 uppercase">
              {group.title}
            </p>
          ) : null}

          {group.items.map((item) => {
            const Icon = navIcons[item.icon];
            const active = isActive(item.href);
            const badgeValue = item.badge ? counts[item.badge] : undefined;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-all",
                  active
                    ? "border-brand-500 bg-brand-500 text-white shadow-[0_8px_18px_rgba(99,195,122,0.35)]"
                    : "border-transparent text-ink-muted hover:border-brand-500/30 hover:bg-surface-soft",
                )}
              >
                {Icon ? <Icon className="h-4.5 w-4.5 shrink-0" /> : null}
                <span className="flex-1">{item.label}</span>
                {item.badgeTone === "alert" && badgeValue ? (
                  <span className="inline-flex items-center gap-1">
                    <Dot tone="alert" />
                    <span className={cn("text-xs font-bold", active ? "text-white" : "text-rose-600")}>
                      {badgeValue}
                    </span>
                  </span>
                ) : typeof badgeValue === "number" ? (
                  <Badge tone={active ? "neutral" : "neutral"}>{badgeValue}</Badge>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
