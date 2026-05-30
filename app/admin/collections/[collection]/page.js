"use client";

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { collectionsByKey } from "@/features/admin/config/collections.config";
import { useCollection } from "@/features/admin/data/useCollection";
import { RecordListPanel } from "@/components/admin/shell/RecordListPanel";
import { Button } from "@/components/admin/ui/Button";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function CollectionListPage({ params }) {
  const { collection } = use(params);
  const config = collectionsByKey[collection];
  const router = useRouter();

  if (!config) notFound();

  const { documents, isLoading, error, search, setSearch } = useCollection(config.collectionKey, {
    searchFields: config.list.searchFields,
  });

  const atMax = config.max && documents.length >= config.max;

  usePageChrome({
    breadcrumb: "Content",
    title: config.label,
    status: error ? { label: "Load error", tone: "alert" } : undefined,
    actions: (
      <Button
        size="sm"
        variant="secondary"
        disabled={atMax}
        title={atMax ? `Maximum ${config.max} allowed.` : undefined}
        onClick={() => router.push(`/admin/collections/${collection}/new`)}
      >
        <Plus className="h-4 w-4" /> New {config.singular}
      </Button>
    ),
  });

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {atMax ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Maximum {config.max} {config.label.toLowerCase()} reached. Delete one to add another.
        </div>
      ) : null}

      <RecordListPanel
        config={config}
        documents={documents}
        isLoading={isLoading}
        search={search}
        onSearch={setSearch}
        onSelect={(doc) => router.push(`/admin/collections/${collection}/${doc.$id}`)}
      />
    </div>
  );
}
