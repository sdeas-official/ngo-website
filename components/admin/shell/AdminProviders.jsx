"use client";

import { ToastProvider } from "@/components/admin/ui/Toast";
import { UnsavedChangesProvider } from "@/features/admin/state/UnsavedChangesProvider";
import { AdminCountsProvider } from "@/features/admin/state/AdminCountsProvider";
import { PageChromeProvider } from "@/features/admin/state/PageChromeProvider";
import { AdminShell } from "@/components/admin/shell/AdminShell";

// Composes all admin-wide context providers in one place, then renders the shell.
export function AdminProviders({ children }) {
  return (
    <ToastProvider>
      <UnsavedChangesProvider>
        <AdminCountsProvider>
          <PageChromeProvider>
            <AdminShell>{children}</AdminShell>
          </PageChromeProvider>
        </AdminCountsProvider>
      </UnsavedChangesProvider>
    </ToastProvider>
  );
}
