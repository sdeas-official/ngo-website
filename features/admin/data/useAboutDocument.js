"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { aboutPage } from "@/features/admin/config/pages.config";

// About page content, spread across about_us_page (story/mission/vision text +
// image) and about_page (hero, stats, headings, vision images, core values).
// Team members live in their own collection, managed separately.
export function useAboutDocument(options = {}) {
  return usePageContent(aboutPage, options);
}
