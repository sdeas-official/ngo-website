"use client";

import { blogPage } from "@/features/admin/config/pages.config";
import { useBlogPageDocument } from "@/features/admin/data/useBlogPageDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function BlogPageEditor() {
  const content = useBlogPageDocument();
  return <PageOverviewEditor pageConfig={blogPage} content={content} />;
}
