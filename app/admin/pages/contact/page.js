"use client";

import { contactPage } from "@/features/admin/config/pages.config";
import { useContactPageDocument } from "@/features/admin/data/useContactPageDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function ContactPageEditor() {
  const content = useContactPageDocument();
  return <PageOverviewEditor pageConfig={contactPage} content={content} />;
}
