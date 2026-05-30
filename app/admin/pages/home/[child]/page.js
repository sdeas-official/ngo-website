"use client";

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { homeChildrenByKey } from "@/features/admin/config/homeChildren.config";
import { useCollection } from "@/features/admin/data/useCollection";
import { RecordListPanel } from "@/components/admin/shell/RecordListPanel";
import { Button } from "@/components/admin/ui/Button";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function HomeChildListPage({ params }) {
  const { child } = use(params);
  const config = homeChildrenByKey[child];
  const router = useRouter();
  if (!config) notFound();

  const base = `/admin/pages/home/${child}`;
  const { documents, isLoading, error, search, setSearch } = useCollection(config.collectionKey, {
    searchFields: [],
  });
  const atMax = config.max && documents.length >= config.max;

  usePageChrome({
    breadcrumb: "Home Page",
    title: config.label,
    actions: (
      <Button
        size="sm"
        variant="secondary"
        disabled={atMax}
        onClick={() => router.push(`${base}/new`)}
      >
        <Plus className="h-4 w-4" /> New {config.singular}
      </Button>
    ),
  });

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.push("/admin/pages/home")}
        className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home Page
      </button>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {atMax ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Maximum {config.max} reached. Delete one to add another.
        </div>
      ) : null}

      <RecordListPanel
        config={config}
        documents={documents}
        isLoading={isLoading}
        search={search}
        onSearch={setSearch}
        onSelect={(doc) => router.push(`${base}/${doc.$id}`)}
      />
    </div>
  );
}
