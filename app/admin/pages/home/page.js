"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { homePage } from "@/features/admin/config/pages.config";
import { useHomeDocument } from "@/features/admin/data/useHomeDocument";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { SectionEditor } from "@/components/admin/shell/SectionEditor";
import { Card } from "@/components/admin/ui/Card";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { computeSectionPreview } from "@/features/admin/utils/sectionPreview";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function HomePageEditor() {
  const router = useRouter();
  const { data, isLoading, error, saveFields } = useHomeDocument();
  const [activeSectionId, setActiveSectionId] = useState(null);

  usePageChrome({
    breadcrumb: "Pages",
    title: "Home Page",
    status: error ? { label: "Load error", tone: "alert" } : { label: "Saved", tone: "success" },
  });

  const activeSection = homePage.sections.find((s) => s.id === activeSectionId) || null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">{homePage.description}</p>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonCards count={5} />
      ) : (
        <div className="space-y-3">
          {homePage.sections.map((section) => {
            const { summary, thumbnails } = computeSectionPreview(section, data);
            return (
              <SectionCard
                key={section.id}
                title={section.title}
                description={section.description}
                summary={summary}
                thumbnails={thumbnails}
                onEdit={() => setActiveSectionId(section.id)}
              />
            );
          })}

          {/* Child collections — list-style sub-sections managed on their own pages */}
          {homePage.childCollections.map((child) => {
            const href =
              child.id === "homePrograms"
                ? "/admin/pages/home/programs"
                : "/admin/pages/home/events";
            return (
              <Card
                key={child.id}
                as="button"
                interactive
                onClick={() => router.push(href)}
                className="flex w-full items-center justify-between gap-4 p-4"
              >
                <div className="text-left">
                  <h3 className="text-sm font-bold tracking-wide text-ink uppercase">
                    {child.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    Manage entries{child.max ? ` (up to ${child.max})` : ""}.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-soft" />
              </Card>
            );
          })}
        </div>
      )}

      <SectionEditor
        open={Boolean(activeSection)}
        section={activeSection}
        values={data}
        onClose={() => setActiveSectionId(null)}
        onSave={saveFields}
      />
    </div>
  );
}
