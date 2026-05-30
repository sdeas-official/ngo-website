"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { homeChildrenByKey } from "@/features/admin/config/homeChildren.config";
import { RecordEditor } from "@/components/admin/shell/RecordEditor";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function HomeChildNewPage({ params }) {
  const { child } = use(params);
  const config = homeChildrenByKey[child];
  if (!config) notFound();

  usePageChrome({
    breadcrumb: config.label,
    breadcrumbHref: `/admin/pages/home/${child}`,
    title: `New ${config.singular}`,
  });

  return <RecordEditor config={config} doc={null} backHref={`/admin/pages/home/${child}`} />;
}
