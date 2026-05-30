"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { blogPage } from "@/features/admin/config/pages.config";

// Blog page chrome (hero + section headings) stored in the blog_content
// singleton. Blog posts live in the `blog` collection and are edited separately.
export function useBlogPageDocument(options = {}) {
  return usePageContent(blogPage, options);
}
