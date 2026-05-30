"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { aboutPage } from "@/features/admin/config/pages.config";
import { useAboutDocument } from "@/features/admin/data/useAboutDocument";
import { SectionCard } from "@/components/admin/ui/SectionCard";
import { SectionEditor } from "@/components/admin/shell/SectionEditor";
import { AboutMembersEditor } from "@/components/admin/shell/AboutMembersEditor";
import { Card } from "@/components/admin/ui/Card";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { computeSectionPreview } from "@/features/admin/utils/sectionPreview";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";

export default function AboutPageEditor() {
  const { page, members, isLoading, error, save } = useAboutDocument();
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [membersOpen, setMembersOpen] = useState(false);

  usePageChrome({
    breadcrumb: "Pages",
    breadcrumbHref: "/admin",
    title: "About Us",
    status: error ? { label: "Load error", tone: "alert" } : { label: "Saved", tone: "success" },
  });

  const activeSection = aboutPage.sections.find((s) => s.id === activeSectionId) || null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">{aboutPage.description}</p>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonCards count={4} />
      ) : (
        <div className="space-y-3">
          {aboutPage.sections.map((section) => {
            const { summary, thumbnails } = computeSectionPreview(section, page);
            return (
              <SectionCard
                key={section.id}
                title={section.title}
                summary={summary}
                thumbnails={thumbnails}
                onEdit={() => setActiveSectionId(section.id)}
              />
            );
          })}

          <Card as="button" interactive onClick={() => setMembersOpen(true)} className="flex w-full items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3 text-left">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-wide text-ink uppercase">Team Members</h3>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {members.filter((m) => m.MemberPosition || m.MembersImage).length} member(s)
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-600">Manage →</span>
          </Card>
        </div>
      )}

      <SectionEditor
        open={Boolean(activeSection)}
        section={activeSection}
        values={page}
        onClose={() => setActiveSectionId(null)}
        onSave={(draft) => save({ ...page, ...draft }, members)}
      />

      <AboutMembersEditor
        open={membersOpen}
        members={members}
        onClose={() => setMembersOpen(false)}
        onSave={(nextMembers) => save(page, nextMembers)}
      />
    </div>
  );
}
