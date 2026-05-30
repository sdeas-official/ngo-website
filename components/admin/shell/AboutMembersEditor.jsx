"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SlideOver } from "@/components/admin/ui/SlideOver";
import { Button } from "@/components/admin/ui/Button";
import { TextField } from "@/components/admin/fields/TextField";
import { TextArea } from "@/components/admin/fields/TextArea";
import { ImageField } from "@/components/admin/fields/ImageField";
import { useToast } from "@/components/admin/ui/Toast";
import { useUnsavedChanges } from "@/features/admin/state/UnsavedChangesProvider";

const emptyMember = () => ({ MembersImage: "", MemberPosition: "", MemberDescription: "" });

// Slide-over for managing the team-member repeater. Saves through the About
// document hook, which reconciles the rows.
export function AboutMembersEditor({ open, members, onClose, onSave }) {
  const { toast } = useToast();
  const { setDirty, confirmDiscard } = useUnsavedChanges();
  const [draft, setDraft] = useState([emptyMember()]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(members && members.length ? members.map((m) => ({ ...m })) : [emptyMember()]);
    }
  }, [open, members]);

  function update(index, key, value) {
    setDraft((prev) => prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)));
    setDirty(true);
  }
  function add() {
    setDraft((prev) => [...prev, emptyMember()]);
    setDirty(true);
  }
  function remove(index) {
    setDraft((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [emptyMember()];
    });
    setDirty(true);
  }
  function requestClose() {
    if (confirmDiscard()) {
      setDirty(false);
      onClose();
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(draft);
      setDirty(false);
      toast({ message: "Team members saved", tone: "success" });
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
      title="Team Members"
      description="Add, edit, or remove the people shown on your About page."
      onRequestClose={requestClose}
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button variant="secondary" size="sm" onClick={add}>
            <Plus className="h-4 w-4" /> Add member
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={requestClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save members"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {draft.map((member, index) => (
          <div key={index} className="rounded-2xl border border-field bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.08em] text-ink-soft uppercase">
                Member {index + 1}
              </p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
            <div className="space-y-3">
              <ImageField
                label="Photo"
                value={member.MembersImage}
                onChange={(v) => update(index, "MembersImage", v)}
              />
              <TextField
                label="Position"
                value={member.MemberPosition}
                onChange={(v) => update(index, "MemberPosition", v)}
                placeholder="e.g. Program Director"
              />
              <TextArea
                label="Description"
                value={member.MemberDescription}
                onChange={(v) => update(index, "MemberDescription", v)}
                placeholder="Short bio"
              />
            </div>
          </div>
        ))}
      </div>
    </SlideOver>
  );
}
