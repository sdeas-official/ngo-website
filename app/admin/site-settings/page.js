"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useDocument } from "@/features/admin/data/useDocument";
import { safeParseJson } from "@/features/admin/utils/json";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { SkeletonCards } from "@/components/admin/ui/Skeleton";
import { TextField } from "@/components/admin/fields/TextField";
import { TextArea } from "@/components/admin/fields/TextArea";
import { ImageField } from "@/components/admin/fields/ImageField";
import { LinkListField } from "@/components/admin/fields/LinkListField";
import { useToast } from "@/components/admin/ui/Toast";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";
import { useUnsavedChanges } from "@/features/admin/state/UnsavedChangesProvider";

const SOCIALS = ["facebook", "twitter", "instagram", "youtube", "linkedin"];

export default function SiteSettingsPage() {
  const { data, isLoading, error, save } = useDocument("siteSettings");
  const { toast } = useToast();
  const { setDirty } = useUnsavedChanges();
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  usePageChrome({
    breadcrumb: "Site",
    breadcrumbHref: "/admin",
    title: "Site Settings",
    status: error ? { label: "Load error", tone: "alert" } : { label: "Saved", tone: "success" },
  });

  // Hydrate the editable form once the document loads (parse JSON fields).
  useEffect(() => {
    if (form || isLoading) return;
    setForm({
      brandName: data.brandName || "",
      logo: data.logo || "",
      navItems: safeParseJson(data.navItems, []),
      footerAbout: data.footerAbout || "",
      footerColumns: safeParseJson(data.footerColumns, []),
      socialLinks: safeParseJson(data.socialLinks, {}),
      contactEmail: data.contactEmail || "",
      contactPhone: data.contactPhone || "",
      contactAddress: data.contactAddress || "",
      getInTouchHeading: data.getInTouchHeading || "",
      getInTouchText: data.getInTouchText || "",
      copyright: data.copyright || "",
    });
  }, [data, isLoading, form]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function setColumn(index, patch) {
    setForm((prev) => ({
      ...prev,
      footerColumns: prev.footerColumns.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
    setDirty(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await save({
        brandName: form.brandName.trim(),
        logo: form.logo.trim(),
        navItems: JSON.stringify(form.navItems || []),
        footerAbout: form.footerAbout.trim(),
        footerColumns: JSON.stringify(form.footerColumns || []),
        socialLinks: JSON.stringify(form.socialLinks || {}),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        contactAddress: form.contactAddress.trim(),
        getInTouchHeading: form.getInTouchHeading.trim(),
        getInTouchText: form.getInTouchText.trim(),
        copyright: form.copyright.trim(),
      });
      setDirty(false);
      toast({ message: "Site settings saved", tone: "success" });
    } catch (e) {
      toast({ message: e?.message || "Save failed.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !form) return <SkeletonCards count={5} />;

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save settings"}
        </Button>
      </div>

      <Card className="space-y-4 p-5">
        <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Brand</p>
        <TextField label="Brand name" value={form.brandName} onChange={(v) => set("brandName", v)} />
        <ImageField label="Logo" value={form.logo} onChange={(v) => set("logo", v)} />
      </Card>

      <Card className="space-y-4 p-5">
        <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Navigation menu</p>
        <LinkListField value={form.navItems} onChange={(v) => set("navItems", v)} />
      </Card>

      <Card className="space-y-4 p-5">
        <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Contact details</p>
        <TextField label="Email" value={form.contactEmail} onChange={(v) => set("contactEmail", v)} />
        <TextField label="Phone" value={form.contactPhone} onChange={(v) => set("contactPhone", v)} />
        <TextField label="Address" value={form.contactAddress} onChange={(v) => set("contactAddress", v)} />
      </Card>

      <Card className="space-y-4 p-5">
        <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Get in touch section</p>
        <TextField label="Heading" value={form.getInTouchHeading} onChange={(v) => set("getInTouchHeading", v)} />
        <TextArea label="Text" value={form.getInTouchText} onChange={(v) => set("getInTouchText", v)} />
      </Card>

      <Card className="space-y-4 p-5">
        <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Social links</p>
        {SOCIALS.map((key) => (
          <TextField
            key={key}
            label={key[0].toUpperCase() + key.slice(1)}
            value={form.socialLinks?.[key] || ""}
            onChange={(v) => set("socialLinks", { ...form.socialLinks, [key]: v })}
          />
        ))}
      </Card>

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Footer</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              set("footerColumns", [...(form.footerColumns || []), { title: "", links: [] }])
            }
          >
            <Plus className="h-4 w-4" /> Add column
          </Button>
        </div>
        <TextArea label="Footer about text" value={form.footerAbout} onChange={(v) => set("footerAbout", v)} />

        {(form.footerColumns || []).map((col, index) => (
          <div key={index} className="rounded-2xl border border-field bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                type="text"
                value={col.title || ""}
                onChange={(e) => setColumn(index, { title: e.target.value })}
                placeholder="Column title"
                className="flex-1 rounded-xl border border-field bg-white px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() =>
                  set("footerColumns", form.footerColumns.filter((_, i) => i !== index))
                }
                aria-label="Remove column"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <LinkListField
              value={col.links || []}
              onChange={(links) => setColumn(index, { links })}
            />
          </div>
        ))}

        <TextField label="Copyright text" value={form.copyright} onChange={(v) => set("copyright", v)} />
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
