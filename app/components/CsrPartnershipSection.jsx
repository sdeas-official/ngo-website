"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, fadeInRight, staggerContainer, viewport } from "../../lib/animations";
import { extractYouTubeVideoId, youTubeThumbnails } from "../../lib/youtube";

function VideoModal({ videoId, title, onClose }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label="Close video"
        >
          Close
        </button>

        <div className="overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

// Real YouTube thumbnail with graceful quality fallback. maxresdefault isn't
// generated for every video — and crucially YouTube serves its 120×90 gray
// "no thumbnail" placeholder with an HTTP 200, so onError never fires. We detect
// that placeholder by its tiny width on load and drop to hqdefault (always real).
function YouTubeThumbnail({ videoId, alt }) {
  const sources = youTubeThumbnails(videoId);
  const [srcIndex, setSrcIndex] = useState(0);

  const advance = () => setSrcIndex((i) => Math.min(i + 1, sources.length - 1));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[srcIndex]}
      alt={alt}
      onError={advance}
      onLoad={(e) => {
        // YouTube's placeholder image is 120px wide; the real maxres is ≥1280.
        if (e.currentTarget.naturalWidth <= 120 && srcIndex < sources.length - 1) {
          advance();
        }
      }}
      className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-90 md:h-115"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

// The "CSR Partnership" home-page section: editable text/CTA + a click-to-play
// YouTube video with its real thumbnail. Content comes from useHomeContent().
export default function CsrPartnershipSection({ content }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeVideoId(content.csrVideo);

  return (
    <section className="bg-white py-14 md:py-24">
      {isPlaying && videoId ? (
        <VideoModal
          videoId={videoId}
          title="CSR Partnership Video"
          onClose={() => setIsPlaying(false)}
        />
      ) : null}

      <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xl font-semibold text-[#63c37a] md:text-2xl"
          >
            {content.csrEyebrow}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 font-serif text-4xl font-bold leading-tight text-[#1d2238] md:text-6xl"
          >
            {content.csrHeading}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
          >
            {content.csrText}
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={content.csrCtaHref}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
          >
            {content.csrCtaLabel}
          </motion.a>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {videoId ? (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="group relative block w-full"
              aria-label="Play CSR partnership video"
            >
              <YouTubeThumbnail videoId={videoId} alt="CSR partnership video" />

              <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />

              <span className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#63c37a] text-3xl text-white shadow-lg transition-transform group-hover:scale-105 md:h-28 md:w-28 md:text-5xl">
                ▶
              </span>
            </button>
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-[#0f172a] text-sm font-medium text-white/70 sm:h-90 md:h-115">
              Add a YouTube URL in the admin to show the video.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
