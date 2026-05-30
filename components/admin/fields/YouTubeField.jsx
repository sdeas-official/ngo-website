"use client";

import { cn } from "@/lib/admin/cn";
import { inputClass, labelClass } from "@/components/admin/fields/fieldStyles";
import { extractYouTubeVideoId } from "@/features/admin/utils/youtube";

// YouTube URL input with a live embed preview once a valid video id is detected.
export function YouTubeField({ label, value, onChange, error, required }) {
  const videoId = extractYouTubeVideoId(value || "");

  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className={cn(inputClass, error && "border-rose-300 focus:border-rose-400")}
      />
      <p className="mt-2 text-xs text-ink-soft">Paste a YouTube watch, share, or embed URL.</p>

      {value && videoId ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-field bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video preview"
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : null}

      {value && !videoId ? (
        <p className="mt-2 text-xs font-medium text-amber-700">
          That doesn&apos;t look like a valid YouTube URL yet.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
