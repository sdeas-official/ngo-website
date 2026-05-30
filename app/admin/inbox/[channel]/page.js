"use client";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { Check, X, Inbox as InboxIcon } from "lucide-react";
import { inboxByKey } from "@/features/admin/config/inbox.config";
import { useCollection } from "@/features/admin/data/useCollection";
import { isRegistrationApproved, sortRegistrations } from "@/features/admin/utils/registrations";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Tabs } from "@/components/admin/ui/Tabs";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { InboxDetail } from "@/components/admin/shell/InboxDetail";
import { useToast } from "@/components/admin/ui/Toast";
import { useAdminCounts } from "@/features/admin/state/AdminCountsProvider";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";
import { cn } from "@/lib/admin/cn";

export default function InboxChannelPage({ params }) {
  const { channel } = use(params);
  const config = inboxByKey[channel];
  if (!config) notFound();

  const isRegistrations = channel === "registrations";
  const { toast } = useToast();
  const { refresh } = useAdminCounts();

  const { repo, rawDocuments, documents, isLoading, error, upsertLocal, removeLocal } =
    useCollection(config.collectionKey, {
      orderDesc: config.orderDesc,
      sortFn: isRegistrations ? sortRegistrations : undefined,
    });

  const [activeId, setActiveId] = useState("");
  const [statusTab, setStatusTab] = useState("pending");
  const [pendingDelete, setPendingDelete] = useState(null);

  // Filter registrations by tab.
  const visible = useMemo(() => {
    if (!isRegistrations) return documents;
    if (statusTab === "approved") return documents.filter((d) => isRegistrationApproved(d));
    if (statusTab === "pending") return documents.filter((d) => !isRegistrationApproved(d));
    return documents;
  }, [documents, isRegistrations, statusTab]);

  // Keep a valid selection.
  useEffect(() => {
    if (!visible.length) {
      setActiveId("");
      return;
    }
    if (!visible.some((d) => d.$id === activeId)) setActiveId(visible[0].$id);
  }, [visible, activeId]);

  const selected = visible.find((d) => d.$id === activeId) || null;

  const pendingCount = isRegistrations
    ? rawDocuments.filter((d) => !isRegistrationApproved(d)).length
    : 0;

  usePageChrome({
    breadcrumb: "Inbox",
    title: config.label,
    status: isRegistrations
      ? { label: `${pendingCount} pending`, tone: pendingCount ? "warning" : "neutral" }
      : { label: `${rawDocuments.length} total`, tone: "neutral" },
  });

  function selectNextAfter(id) {
    const idx = visible.findIndex((d) => d.$id === id);
    const next = visible[idx + 1] || visible[idx - 1];
    setActiveId(next && next.$id !== id ? next.$id : "");
  }

  async function approve(id) {
    try {
      await repo.update(config.collectionKey, id, { approved: true });
      upsertLocal({ ...rawDocuments.find((d) => d.$id === id), approved: true });
      refresh();
      toast({ message: "Registration approved — now live", tone: "success" });
      selectNextAfter(id);
    } catch (e) {
      toast({ message: e?.message || "Approval failed.", tone: "error" });
    }
  }

  async function doDelete(id) {
    setPendingDelete(null);
    try {
      await repo.remove(config.collectionKey, id);
      removeLocal(id);
      refresh();
      toast({ message: isRegistrations ? "Registration rejected" : "Deleted", tone: "success" });
      selectNextAfter(id);
    } catch (e) {
      toast({ message: e?.message || "Delete failed.", tone: "error" });
    }
  }

  function rowTitle(doc) {
    if (config.list.titleFields) {
      return config.list.titleFields.map((k) => doc[k]).filter(Boolean).join(" ").trim() || "Unknown";
    }
    return config.list.titleKeys.map((k) => doc[k]).find(Boolean) || "Unknown";
  }
  function rowSubtitle(doc) {
    if (config.list.subtitleField) return doc[config.list.subtitleField] || "";
    if (config.list.subtitleKeys) return config.list.subtitleKeys.map((k) => doc[k]).find(Boolean) || "";
    return "";
  }

  return (
    <div className="space-y-4">
      {isRegistrations ? (
        <Tabs
          value={statusTab}
          onChange={setStatusTab}
          tabs={[
            { key: "pending", label: "Pending", count: pendingCount, tone: "warning" },
            {
              key: "approved",
              label: "Approved",
              count: rawDocuments.length - pendingCount,
            },
            { key: "all", label: "All", count: rawDocuments.length },
          ]}
        />
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Master list */}
        <div className="space-y-2">
          {isLoading ? (
            <SkeletonCards count={4} />
          ) : !visible.length ? (
            <EmptyState icon={InboxIcon} title="Nothing here" description="No submissions to show." />
          ) : (
            visible.map((doc) => {
              const isActive = doc.$id === activeId;
              const approved = isRegistrations && isRegistrationApproved(doc);
              return (
                <Card
                  key={doc.$id}
                  as="button"
                  interactive
                  onClick={() => setActiveId(doc.$id)}
                  className={cn("w-full p-3", isActive && "border-brand-500 bg-brand-500/5")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-semibold text-ink">{rowTitle(doc)}</p>
                    {isRegistrations ? (
                      <Badge tone={approved ? "success" : "warning"}>
                        {approved ? "Approved" : "Pending"}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{rowSubtitle(doc) || "—"}</p>
                </Card>
              );
            })
          )}
        </div>

        {/* Detail */}
        <Card className="p-5">
          {selected ? (
            <div className="space-y-5">
              <InboxDetail fields={config.detail.fields} doc={selected} />

              {config.actions?.approve || config.actions?.reject || config.actions?.delete ? (
                <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                  {config.actions?.approve ? (
                    <Button
                      onClick={() => approve(selected.$id)}
                      disabled={isRegistrationApproved(selected)}
                    >
                      <Check className="h-4 w-4" />
                      {isRegistrationApproved(selected) ? "Already approved" : "Approve"}
                    </Button>
                  ) : null}
                  {config.actions?.reject || config.actions?.delete ? (
                    <Button variant="danger" onClick={() => setPendingDelete(selected.$id)}>
                      <X className="h-4 w-4" />
                      {config.actions?.reject ? "Reject" : "Delete"}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-ink-soft">Select an item to view details.</p>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={isRegistrations ? "Reject this registration?" : "Delete this submission?"}
        description="This permanently removes it and cannot be undone."
        confirmLabel={isRegistrations ? "Reject" : "Delete"}
        onConfirm={() => doDelete(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
