"use client";

import { useEffect, useMemo, useState } from "react";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { Button } from "@/components/admin/ui/Button";
import { FieldRenderer } from "@/components/admin/fields/FieldRenderer";
import { useToast } from "@/components/admin/ui/Toast";
import { useUnsavedChanges } from "@/features/admin/state/UnsavedChangesProvider";
import { validateSectionFields } from "@/features/admin/utils/sectionPreview";

// Right slide-over that edits ONE page section (2–5 fields). Owns its own draft
// state, dirty tracking (wired to the global guard), required-field validation,
// and save. Reused by Home and About page editors.
export function SectionEditor({ open, section, values, onClose, onSave }) {
  const { toast } = useToast();
  const { setDirty, confirmDiscard } = useUnsavedChanges();
  const [draft, setDraft] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Seed the draft from current values whenever a section opens.
  const seed = useMemo(() => {
    if (!section) return {};
    return section.fields.reduce((acc, f) => {
      acc[f.key] = values?.[f.key] ?? (f.type === "toggle" ? false : "");
      return acc;
    }, {});
  }, [section, values]);

  useEffect(() => {
    if (open) {
      setDraft(seed);
      setErrors({});
    }
  }, [open, seed]);

  function setField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function requestClose() {
    if (confirmDiscard()) {
      setDirty(false);
      onClose();
    }
  }

  async function handleSave() {
    if (!section) return;
    const validation = validateSectionFields(section, draft);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(draft);
      setDirty(false);
      toast({ message: `${section.title} saved`, tone: "success" });
      onClose();
    } catch (e) {
      toast({ message: e?.message || "Save failed.", tone: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SlideOver
      open={open}
      title={section?.title || ""}
      description={section?.description}
      onRequestClose={requestClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={requestClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save section"}
          </Button>
        </div>
      }
    >
      {section ? (
        <div className="space-y-5">
          {section.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={draft[field.key]}
              onChange={(v) => setField(field.key, v)}
              error={errors[field.key]}
            />
          ))}
        </div>
      ) : null}
    </SlideOver>
  );
}
