"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/shell/Sidebar";
import { Topbar } from "@/components/admin/shell/Topbar";
import { useAdminAuth } from "@/features/admin/state/useAdminAuth";
import { usePageChromeValue } from "@/features/admin/state/PageChromeProvider";
import { cn } from "@/lib/admin/cn";

// The visual frame for every admin screen: fixed sidebar + sticky topbar + content
// outlet. Runs the auth guard and renders a checking/blocked state before content.
export function AdminShell({ children }) {
  const { isChecking, isAuthorized } = useAdminAuth();
  const chrome = usePageChromeValue();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <p className="text-sm font-medium text-ink-soft">Checking authorization…</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3faf5] via-[#f8faf8] to-[#edf3ef] text-ink">
      <div className="flex">
        {/* Sidebar — fixed to the viewport on desktop, slide-in drawer on mobile */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-line bg-white/95 p-5 backdrop-blur-sm transition-transform lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </aside>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        ) : null}

        {/* Main column — offset to clear the fixed sidebar on desktop */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
          <Topbar
            title={chrome.title}
            breadcrumb={chrome.breadcrumb}
            status={chrome.status}
            actions={chrome.actions}
            onOpenMenu={() => setMobileOpen(true)}
          />
          <main className="mx-auto w-full flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
