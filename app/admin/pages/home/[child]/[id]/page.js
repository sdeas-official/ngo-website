"use client";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { homeChildrenByKey } from "@/features/admin/config/homeChildren.config";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";
import { RecordEditor } from "@/components/admin/shell/RecordEditor";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function HomeChildRecordPage({ params }) {
  const { child, id } = use(params);
  const config = homeChildrenByKey[child];
  if (!config) notFound();

  const repo = useMemo(() => createAdminRepo(), []);
  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  usePageChrome({ breadcrumb: config.label, title: `Edit ${config.singular}` });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await repo.get(config.collectionKey, id);
        if (mounted) setDoc({ $id: result.$id, ...sanitizeDocument(result) });
      } catch (e) {
        if (mounted) setError(e?.message || "Could not load this record.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [repo, config.collectionKey, id]);

  if (isLoading) return <SkeletonCards count={2} />;
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return <RecordEditor config={config} doc={doc} backHref={`/admin/pages/home/${child}`} />;
}
