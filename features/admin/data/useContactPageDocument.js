"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { contactPage } from "@/features/admin/config/pages.config";

// Contact page content stored in the contact_page singleton. Email / phone /
// address / social links are shared site-wide (site_settings) and edited under
// Site → Site Settings; the form submissions land in the contact responses
// collection and are read in the Inbox.
export function useContactPageDocument(options = {}) {
  return usePageContent(contactPage, options);
}
