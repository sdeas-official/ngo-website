"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { aboutPage } from "@/features/admin/config/pages.config";
import { useAboutDocument } from "@/features/admin/data/useAboutDocument";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { SectionEditor } from "@/components/admin/shell/SectionEditor";
import { Card } from "@/components/admin/ui/Card";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { computeSectionPreview } from "@/features/admin/utils/sectionPreview";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function AboutPageEditor() {
  const router = useRouter();
  const { data, isLoading, error, saveFields } = useAboutDocument();
  const [activeSectionId, setActiveSectionId] = useState(null);

  usePageChrome({
    breadcrumb: "Pages",
    breadcrumbHref: "/admin",
    title: "About Us",
    status: error ? { label: "Load error", tone: "alert" } : { label: "Saved", tone: "success" },
  });

  const activeSection = aboutPage.sections.find((s) => s.id === activeSectionId) || null;
  const sectionById = (id) => aboutPage.sections.find((s) => s.id === id);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">{aboutPage.description}</p>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonCards count={7} />
      ) : (
        <div className="space-y-3">
          {aboutPage.overview.map((item, index) => {
            if (item.type === "section") {
              const section = sectionById(item.id);
              if (!section) return null;
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
            }

            return (
              <Card
                key={`link-${index}`}
                as="button"
                interactive
                onClick={() => router.push(item.href)}
                className="flex w-full items-center justify-between gap-4 p-4"
              >
                <div className="text-left">
                  <h3 className="text-sm font-bold tracking-wide text-ink uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                  Manage <ChevronRight className="h-4 w-4" />
                </span>
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
