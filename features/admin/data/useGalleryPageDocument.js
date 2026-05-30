"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { galleryPage } from "@/features/admin/config/pages.config";

// Gallery page chrome (hero, photo & video section headings, video cards) stored
// in the gallery_content singleton. The photos live in the `gallery` collection
// and are managed on the linked /admin/pages/gallery/images sub-page.
export function useGalleryPageDocument(options = {}) {
  return usePageContent(galleryPage, options);
}
