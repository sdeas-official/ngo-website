"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { galleryFields } from "@/features/admin/config/pages.config";
import { useDocument } from "@/features/admin/data/useDocument";
import { useCloudinaryUpload } from "@/features/admin/data/useCloudinaryUpload";
import { Tabs } from "@/components/admin/ui/Tabs";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";
import { usePageChrome } from "@/features/admin/state/PageChromeProvider";
import { cn } from "@/lib/admin/cn";

// Gallery uses direct-manipulation autosave: each add/remove persists immediately
// (with an undo toast) — content managers expect photo tools to "just save".
export default function GalleryManagerPage() {
  const { data, setData, isLoading, error, save } = useDocument("gallery");
  const { uploadMany } = useCloudinaryUpload();
  const { toast } = useToast();
  const inputRef = useRef(null);

  const [tab, setTab] = useState("AllImages");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  usePageChrome({
    breadcrumb: "Pages",
    breadcrumbHref: "/admin",
    title: "Gallery",
    status: error ? { label: "Load error", tone: "alert" } : { label: "Auto-saves", tone: "neutral" },
  });

  function imagesFor(key) {
    return Array.isArray(data[key]) ? data[key].filter((i) => typeof i === "string") : [];
  }

  // Persist a full gallery object (all three categories) to the single document.
  async function persist(next) {
    const payload = galleryFields.reduce((acc, f) => {
      acc[f.key] = (next[f.key] || []).filter(Boolean);
      return acc;
    }, {});
    await save(payload);
  }

  async function handleFiles(files) {
    const list = Array.from(files || []);
    if (!list.length) return;
    setBusy(true);
    try {
      const urls = await uploadMany(list);
      const next = { ...data, [tab]: [...imagesFor(tab), ...urls] };
      setData(next);
      await persist(next);
      toast({ message: `${urls.length} image(s) added`, tone: "success" });
    } catch (e) {
      toast({ message: e?.message || "Upload failed.", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function removeAt(index) {
    const current = imagesFor(tab);
    const removed = current[index];
    const next = { ...data, [tab]: current.filter((_, i) => i !== index) };
    setData(next);
    try {
      await persist(next);
      toast({
        message: "Image removed",
        tone: "success",
        action: {
          label: "Undo",
          onClick: async () => {
            const restored = { ...next, [tab]: [...next[tab].slice(0, index), removed, ...next[tab].slice(index)] };
            setData(restored);
            await persist(restored);
          },
        },
      });
    } catch (e) {
      toast({ message: e?.message || "Remove failed.", tone: "error" });
    }
  }

  const current = imagesFor(tab);

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={galleryFields.map((f) => ({ key: f.key, label: f.label, count: imagesFor(f.key).length }))}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* Upload zone */}
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
          "flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed bg-white px-4 py-6 text-sm font-medium text-ink transition-colors",
          dragOver ? "border-brand-500 bg-brand-500/5" : "border-line",
        )}
      >
        <UploadCloud className="h-5 w-5 text-brand-600" />
        {busy ? "Uploading…" : `Drag photos here to add to ${galleryFields.find((f) => f.key === tab)?.label}, or click to upload`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      ) : current.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {current.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-xl border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove image"
                className="absolute top-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-ink-soft">
          No images in this category yet. Upload some above.
        </div>
      )}
    </div>
  );
}
