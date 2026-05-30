"use client";

import { usePageContent } from "@/features/admin/data/usePageContent";
import { partnerPage } from "@/features/admin/config/pages.config";

// Partner-With-Us page content stored in the partner_page singleton. The
// donation tiers (donation_tiers) and volunteer submissions (partner_with_us_table)
// are managed separately and linked from this page's overview.
export function usePartnerPageDocument(options = {}) {
  return usePageContent(partnerPage, options);
}
