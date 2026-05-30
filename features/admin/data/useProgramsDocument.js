"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { programsPage } from "@/features/admin/config/pages.config";

// Programs page chrome (hero, special-programs grid, CTA) stored in the
// programs_content singleton. The main program blocks live in the `programs`
// collection and are edited separately.
export function useProgramsDocument(options = {}) {
  return usePageContent(programsPage, options);
}
