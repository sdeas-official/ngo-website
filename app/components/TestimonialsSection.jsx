"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Query } from "appwrite";
import { createDatabasesClient } from "../../lib/appwriteClient";
import { fadeInUp, staggerContainer, viewport } from "../../lib/animations";

function extractYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return "";
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be")
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch")
        return parsed.searchParams.get("v") || "";
      if (parsed.pathname.startsWith("/shorts/"))
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      if (parsed.pathname.startsWith("/embed/"))
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
    }
    return "";
  } catch {
    return "";
  }
}

const fallbackTestimonials = [
  {
    name: "Ritika Das",
    role: "Community Partner",
    image: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    text: "SDEAS has created visible change in the communities we support. Their team is transparent, committed, and deeply impact-focused.",
  },
  {
    name: "Prakash Kumar",
    role: "Parent",
    image: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    text: "My son gained confidence and practical skills through SDEAS training. Today, he has a stable job and supports our family.",
  },
  {
    name: "Ananya Sahu",
    role: "Volunteer Mentor",
    image: "https://youtu.be/aqz-KE-bpKQ",
    text: "Working with SDEAS is meaningful. Every batch of youth we mentor carries new hope, capability, and confidence into their future.",
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

function VideoModal({ videoId, name, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
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
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label="Close video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Close
        </button>
        <div className="overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`${name} testimonial`}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        {name && (
          <p className="mt-3 text-center text-sm font-medium tracking-wide text-white/50">
            {name}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial, index, onPlay }) {
  const youtubeId = extractYouTubeVideoId(testimonial.image);
  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : null;

  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_2px_20px_rgba(30,50,40,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(30,50,40,0.14)]">
      {/* ── Thumbnail ── */}
      <div className="relative overflow-hidden">
        {youtubeId ? (
          <button
            onClick={() => onPlay(youtubeId, testimonial.name)}
            className="group/thumb relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63c37a] focus-visible:ring-offset-2"
            aria-label={`Play ${testimonial.name}'s testimonial`}
          >
            <img
              src={thumbnailUrl}
              alt={`${testimonial.name} testimonial`}
              className="aspect-video w-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />

            {/* Watch Story pill */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#63c37a]" />
              Watch Story
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-15 w-15 items-center justify-center rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.30)] transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:shadow-[0_12px_40px_rgba(0,0,0,0.40)]">
                {/* Animated ring */}
                <span className="absolute inset-0 rounded-full border-2 border-[#63c37a] opacity-0 transition-all duration-500 group-hover/thumb:scale-[1.35] group-hover/thumb:opacity-30" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#63c37a"
                  className="h-7 w-7 translate-x-0.5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-[#0f172a] text-sm font-medium text-white/60">
            Invalid YouTube URL
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
        {/* Big decorative quote */}
        <span
          className="pointer-events-none absolute right-5 top-1 select-none font-serif text-[100px] font-bold leading-none text-[#63c37a]/10"
          aria-hidden="true"
        >
          "
        </span>

        {/* Quote */}
        <p className="relative z-10 flex-1 text-[15px] leading-relaxed text-[#4b5563]">
          "{testimonial.text}"
        </p>

        {/* Green gradient divider */}
        <div className="my-5 h-px bg-linear-to-r from-[#63c37a]/40 via-[#63c37a]/15 to-transparent" />

        {/* Author row */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#63c37a] to-[#3da85a] text-[13px] font-bold tracking-wide text-white shadow-sm">
            {initials}
          </div>

          {/* Name + role */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#1d2238]">
              {testimonial.name}
            </p>
            {testimonial.role && (
              <p className="truncate text-xs font-semibold text-[#63c37a]">
                {testimonial.role}
              </p>
            )}
          </div>

          {/* Play CTA pill */}
          {youtubeId && (
            <button
              onClick={() => onPlay(youtubeId, testimonial.name)}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-[#63c37a]/35 bg-[#f0faf3] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#3da85a] transition-all hover:border-[#63c37a] hover:bg-[#63c37a] hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [activeVideo, setActiveVideo] = useState(null);

  const shouldUseInfiniteScroll = testimonials.length > 3;

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!databases || !config.databaseId || !config.collections.testimonials)
        return;
      try {
        const result = await databases.listDocuments(
          config.databaseId,
          config.collections.testimonials,
          [Query.orderDesc("$createdAt"), Query.limit(100)],
        );
        const mapped = result.documents
          .map((doc) => ({
            name: typeof doc.name === "string" ? doc.name : "",
            role: typeof doc.role === "string" ? doc.role : "",
            image: typeof doc.image === "string" ? doc.image : "",
            text: typeof doc.text === "string" ? doc.text : "",
          }))
          .filter((item) => item.name && item.image && item.text);
        if (mapped.length) setTestimonials(mapped);
      } catch {
        // keep fallback
      }
    };
    loadTestimonials();
  }, [config.collections.testimonials, config.databaseId, databases]);

  const handlePlay = (videoId, name) => setActiveVideo({ videoId, name });
  const handleClose = () => setActiveVideo(null);

  return (
    <>
      {activeVideo && (
        <VideoModal
          videoId={activeVideo.videoId}
          name={activeVideo.name}
          onClose={handleClose}
        />
      )}

      <section className="relative overflow-hidden bg-[#f6faf7] py-16 md:py-28">
        {/* Background blobs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-[#63c37a]/7 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#63c37a]/9 blur-3xl" />
          {/* Subtle dot grid */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#1d2238" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative mx-auto w-full px-4 md:px-8 lg:px-10">
          {/* Header */}
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#63c37a]/30 bg-white px-4 py-1.5 text-sm font-semibold text-[#3da85a] shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-[#63c37a]" />
              Testimonials
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-5 font-serif text-4xl font-bold leading-tight text-[#1d2238] md:text-[3.5rem]"
            >
              Voices of Impact
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-4 max-w-xl text-[#5f6879] md:text-lg"
            >
              Hear what our partners, families, and volunteers say about the
              change we create together.
            </motion.p>
          </motion.div>

          {/* Cards grid / scroll */}
          {shouldUseInfiniteScroll ? (
            <div className="mt-12 overflow-hidden">
              <div className="flex w-max animate-[testimonial-scroll_34s_linear_infinite] hover:[animation-play-state:paused]">
                {[...testimonials, ...testimonials].map(
                  (testimonial, index) => (
                    <div
                      key={`${testimonial.name}-scroll-${index}`}
                      className="mx-3 w-[84vw] max-w-95 shrink-0 sm:w-[68vw] md:w-[42vw] xl:w-[29vw]"
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        index={index}
                        onPlay={handlePlay}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.name}-${index}`}
                  testimonial={testimonial}
                  index={index}
                  onPlay={handlePlay}
                />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes testimonial-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>
    </>
  );
}
