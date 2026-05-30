"use client";

import { homePage } from "@/features/admin/config/pages.config";
import { useHomeDocument } from "@/features/admin/data/useHomeDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function HomePageEditor() {
  const content = useHomeDocument();
  return <PageOverviewEditor pageConfig={homePage} content={content} />;
}
