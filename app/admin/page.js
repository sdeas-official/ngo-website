"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  PenSquare,
  Target,
  Inbox,
  Mail,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { Dot } from "@/components/admin/ui/Badge";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";
import { useAdminCounts } from "@/features/admin/state/AdminCountsProvider";

const QUICK_EDITS = [
  { label: "Home", hint: "hero, banners, sections", href: "/admin/pages/home", icon: FileText },
  { label: "Gallery", hint: "add photos", href: "/admin/pages/gallery", icon: ImageIcon },
  { label: "New Blog", hint: "write a post", href: "/admin/collections/blog/new", icon: PenSquare },
  { label: "Programs", hint: "edit programs", href: "/admin/collections/programs", icon: Target },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { counts, isLoading } = useAdminCounts();

  usePageChrome({ breadcrumb: "Overview", title: "Dashboard" });

  const attention = [
    {
      key: "registrations",
      label: "Registrations",
      sub: "pending approval",
      value: counts.registrationsPending,
      href: "/admin/inbox/registrations",
      icon: Inbox,
      tone: "alert",
    },
    {
      key: "contact",
      label: "Contact messages",
      sub: "received",
      value: counts.contact,
      href: "/admin/inbox/contact",
      icon: Mail,
      tone: "brand",
    },
    {
      key: "partner",
      label: "Partner requests",
      sub: "received",
      value: undefined,
      href: "/admin/inbox/partner",
      icon: Handshake,
      tone: "brand",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-2xl font-bold text-ink">Good to see you 👋</h3>
        <p className="mt-1 text-sm text-ink-soft">Here&apos;s what needs your attention.</p>
      </div>

      {/* Needs attention */}
      <section>
        <p className="mb-3 text-xs font-bold tracking-[0.14em] text-ink-soft uppercase">
          Needs attention
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {attention.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.key}
                as="button"
                interactive
                onClick={() => router.push(item.href)}
                className="p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.tone === "alert" && item.value ? <Dot tone="alert" /> : null}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  {isLoading ? (
                    <Skeleton className="h-7 w-10" />
                  ) : (
                    <span className="text-2xl font-bold text-ink">{item.value ?? "—"}</span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-ink-soft">{item.sub}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick edit */}
      <section>
        <p className="mb-3 text-xs font-bold tracking-[0.14em] text-ink-soft uppercase">
          Quick edit
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_EDITS.map((q) => {
            const Icon = q.icon;
            return (
              <Card
                key={q.label}
                as="button"
                interactive
                onClick={() => router.push(q.href)}
                className="flex flex-col gap-2 p-4"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                  {q.label} <ArrowRight className="h-3.5 w-3.5 text-ink-soft" />
                </span>
                <span className="text-xs text-ink-soft">{q.hint}</span>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
