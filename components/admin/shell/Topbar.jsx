"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";

// Top bar: mobile menu toggle, breadcrumb/title, save-status pill, and global
// actions (View site / Logout). Per-page primary actions are injected via
// `actions` so each screen controls its own Save button.
export function Topbar({ title, breadcrumb, status, actions, onOpenMenu }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin-login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur-sm md:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="rounded-xl border border-line p-2 text-ink-soft lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        {breadcrumb ? (
          <p className="truncate text-xs font-semibold tracking-wide text-ink-soft uppercase">
            {breadcrumb}
          </p>
        ) : null}
        <div className="flex items-center gap-2">
          <h2 className="truncate font-serif text-lg font-bold text-ink md:text-xl">{title}</h2>
          {status ? <Badge tone={status.tone || "neutral"}>{status.label}</Badge> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-soft sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </a>
        <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{isLoggingOut ? "Signing out…" : "Logout"}</span>
        </Button>
      </div>
    </header>
  );
}
