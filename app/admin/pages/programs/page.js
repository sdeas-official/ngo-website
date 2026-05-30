"use client";

import { programsPage } from "@/features/admin/config/pages.config";
import { useProgramsDocument } from "@/features/admin/data/useProgramsDocument";
import { PageOverviewEditor } from "@/components/admin/shell/PageOverviewEditor";

export default function ProgramsPageEditor() {
  const content = useProgramsDocument();
  return <PageOverviewEditor pageConfig={programsPage} content={content} />;
}
