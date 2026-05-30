"use client";

import { aboutPage } from "@/features/admin/config/pages.config";
import { useAboutDocument } from "@/features/admin/data/useAboutDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function AboutPageEditor() {
  const content = useAboutDocument();
  return <PageOverviewEditor pageConfig={aboutPage} content={content} />;
}
