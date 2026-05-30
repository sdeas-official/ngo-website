"use client";

import { useRef, useState } from "react";
import { UploadCloud, Trash2, Link2 } from "lucide-react";
import { cn } from "@/lib/admin/cn";
import { labelClass } from "@/components/admin/fields/fieldStyles";
import { useCloudinaryUpload } from "@/features/admin/data/useCloudinaryUpload";

// Image picker: drag-or-click upload to Cloudinary with live progress, preview,
// remove, and a collapsed "paste a URL" advanced option for power users. Replaces
// the duplicated url-input + upload-pill pattern repeated across the legacy panel.
export function ImageField({ label, value, onChange, error }) {
  const inputRef = useRef(null);
  const [showUrl, setShowUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { upload, isUploading, progress, error: uploadError, isConfigured } = useCloudinaryUpload();

  async function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      onChange(url);
    } catch {
      // error surfaced via uploadError below
    }
  }

  return (
    <div>
      {label ? <label className={labelClass}>{label}</label> : null}

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-field bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label || ""} className="h-44 w-full object-cover" />
          <div className="flex items-center justify-end gap-2 border-t border-line p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-brand-500 bg-white px-3 text-xs font-semibold text-brand-600 hover:bg-brand-500 hover:text-white"
            >
              <UploadCloud className="h-3.5 w-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-300 bg-white px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-white px-4 py-8 text-center transition-colors",
            dragOver ? "border-brand-500 bg-brand-500/5" : "border-line",
            error && "border-rose-300",
          )}
        >
          <UploadCloud className="h-7 w-7 text-brand-600" />
          <span className="text-sm font-medium text-ink">
            {isUploading ? `Uploading… ${progress}%` : "Drag an image here, or click to upload"}
          </span>
          {isUploading ? (
            <span className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </span>
          ) : null}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Advanced: paste a URL directly */}
      <button
        type="button"
        onClick={() => setShowUrl((s) => !s)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink"
      >
        <Link2 className="h-3.5 w-3.5" /> {showUrl ? "Hide URL" : "Or paste an image URL"}
      </button>
      {showUrl ? (
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full rounded-xl border border-field bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-500"
        />
      ) : null}

      {!isConfigured ? (
        <p className="mt-2 text-xs text-amber-700">
          Image uploads are disabled until Cloudinary is configured.
        </p>
      ) : null}
      {(error || uploadError) ? (
        <p className="mt-2 text-xs font-medium text-rose-600">{error || uploadError}</p>
      ) : null}
    </div>
  );
}
