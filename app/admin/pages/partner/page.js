"use client";

import { partnerPage } from "@/features/admin/config/pages.config";
import { usePartnerPageDocument } from "@/features/admin/data/usePartnerPageDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function PartnerPageEditor() {
  const content = usePartnerPageDocument();
  return <PageOverviewEditor pageConfig={partnerPage} content={content} />;
}
