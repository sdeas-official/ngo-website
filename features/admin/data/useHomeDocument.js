"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { homePage } from "@/features/admin/config/pages.config";

// Home page content, spread across home / homeTwo / homeLanding. Thin wrapper
// over the generic multi-collection page hook.
export function useHomeDocument(options = {}) {
  return usePageContent(homePage, options);
}
