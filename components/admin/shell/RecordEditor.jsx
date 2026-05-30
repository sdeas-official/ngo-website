"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FieldRenderer } from "@/components/admin/fields/FieldRenderer";
import { useToast } from "@/components/admin/ui/Toast";
import { useUnsavedChanges } from "@/features/admin/state/UnsavedChangesProvider";
import { useAdminCounts } from "@/features/admin/state/AdminCountsProvider";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { extractYouTubeVideoId } from "@/features/admin/utils/youtube";

// Grouped record editor for collection items. Driven entirely by the collection
// config (editor.groups + toForm/toPayload/validate). Handles create/update,
// delete, required + YouTube validation, dirty guard, and navigation back to list.
export function RecordEditor({ config, doc, backHref }) {
  const router = useRouter();
  const repo = useMemo(() => createAdminRepo(), []);
  const { toast } = useToast();
  const { setDirty, confirmDiscard } = useUnsavedChanges();
  const { refresh } = useAdminCounts();

  const isNew = !doc;
  const [form, setForm] = useState(() => (doc ? config.toForm(doc) : { ...config.emptyValues }));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setForm(doc ? config.toForm(doc) : { ...config.emptyValues });
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, config]);

  const allFields = useMemo(
    () => config.editor.groups.flatMap((g) => g.fields),
    [config],
  );

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function validate(payload) {
    const next = {};
    allFields.forEach((field) => {
      const value = form[field.key];
      if (field.required) {
        const empty =
          value == null ||
          (typeof value === "string" && !value.trim()) ||
          (Array.isArray(value) && value.filter(Boolean).length === 0);
        if (empty) next[field.key] = `${field.label} is required.`;
      }
      if (field.type === "youtube" && value && !extractYouTubeVideoId(value)) {
        next[field.key] = "Enter a valid YouTube video URL.";
      }
    });
    return next;
  }

  async function handleSave() {
    const payload = config.toPayload(form);
    const fieldErrors = validate(payload);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      toast({ message: "Please fix the highlighted fields.", tone: "error" });
      return;
    }
    const configError = config.validate ? config.validate(payload) : "";
    if (configError) {
      toast({ message: configError, tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        await repo.create(config.collectionKey, payload);
        toast({ message: `${config.singular} created`, tone: "success" });
      } else {
        await repo.update(config.collectionKey, doc.$id, payload);
        toast({ message: `${config.singular} updated`, tone: "success" });
      }
      setDirty(false);
      refresh();
      router.push(backHref);
    } catch (e) {
      toast({ message: e?.message || "Save failed.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setConfirmDelete(false);
    try {
      await repo.remove(config.collectionKey, doc.$id);
      setDirty(false);
      refresh();
      toast({ message: `${config.singular} deleted`, tone: "success" });
      router.push(backHref);
    } catch (e) {
      toast({ message: e?.message || "Delete failed.", tone: "error" });
    }
  }

  function goBack() {
    if (confirmDiscard()) {
      setDirty(false);
      router.push(backHref);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Back to {config.label}
        </button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : isNew ? `Create ${config.singular}` : "Save"}
        </Button>
      </div>

      {config.editor.groups.map((group) => (
        <Card key={group.title} className="p-5">
          <p className="mb-4 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">
            {group.title}
          </p>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={(v) => setField(field.key, v)}
                error={errors[field.key]}
              />
            ))}
          </div>
        </Card>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        {!isNew ? (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" /> Delete {config.singular}
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : isNew ? `Create ${config.singular}` : "Save"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
