"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { collectionsByKey } from "@/features/admin/config/collections.config";
import { RecordEditor } from "@/components/admin/shell/RecordEditor";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function CollectionNewRecordPage({ params }) {
  const { collection } = use(params);
  const config = collectionsByKey[collection];
  if (!config) notFound();

  usePageChrome({ breadcrumb: config.label, title: `New ${config.singular}` });

  return <RecordEditor config={config} doc={null} backHref={`/admin/collections/${collection}`} />;
}
