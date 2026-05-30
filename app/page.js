"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import OngoingProjectsCarousel from "./components/OngoingProjectsCarousel";
import LatestArticlesSection from "./components/LatestArticlesSection";
import GetInTouchSection from "./components/GetInTouchSection";
import FooterSection from "./components/FooterSection";
import { TextHighlight } from "./components/TextHighlight";
import Navbar from "./components/Navbar";
import ProgramCardsSection from "./components/ProgramCardsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewport,
} from "../lib/animations";
import { useHomeContent } from "../lib/useSiteContent";

function extractYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return "";

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    return "";
  } catch {
    return "";
  }
}

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

export default function Home() {
  const content = useHomeContent();
  const [activeCsrVideo, setActiveCsrVideo] = useState(false);
  const csrVideoId = extractYouTubeVideoId(content.csrVideo);

  const heroStats = (content.heroStatNumbers || []).map((number, index) => ({
    number,
    label: (content.heroStatLabels || [])[index] || "",
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {activeCsrVideo && csrVideoId && (
        <VideoModal
          videoId={csrVideoId}
          title="CSR Partnership Video"
          onClose={() => setActiveCsrVideo(false)}
        />
      )}

      <section className="relative isolate overflow-hidden bg-white">
        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-8 pb-6 md:min-h-[calc(100vh-96px)] md:px-8 md:pb-0 lg:grid-cols-2 lg:gap-1 lg:px-0">
          {/* LEFT — text block */}
          <motion.div
            className="flex flex-col items-start"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block text-[#63c37a]">
                <TextHighlight>{content.heroTitleTop}</TextHighlight>
              </span>
              <span className="block text-[#111827]">
                {content.heroTitleBottom}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-xl text-base text-[#5b667d] md:mt-6 md:text-xl"
            >
              {content.heroSubtitle}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 md:mt-10">
              <a
                href={content.heroCtaHref}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-7 text-base font-bold tracking-wide text-white shadow-[0_6px_24px_rgba(99,195,122,0.4)] transition-all hover:bg-[#459557] hover:shadow-[0_8px_30px_rgba(99,195,122,0.5)] md:h-14 md:px-10 md:text-lg"
              >
                {content.heroCtaLabel}
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap gap-8 border-t border-[#e5e7eb] pt-8 md:mt-12 md:gap-10"
            >
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-[#63c37a] md:text-3xl">
                    {stat.number}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#5b667d]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — image: anchored to bottom on desktop */}
          <motion.div
            className="relative flex h-full items-end justify-center lg:justify-end"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <Image
              src={content.HeroImage}
              alt="SDEAS youth skill development and training"
              width={1100}
              height={1250}
              priority
              unoptimized
              className="h-auto max-h-[62vh] w-full max-w-sm object-contain sm:max-h-[70vh] sm:max-w-md lg:max-h-[92vh] lg:max-w-xl"
            />
          </motion.div>
        </div>
      </section>

      <ProgramCardsSection />

      <section className="bg-[#efefef] py-14 md:py-24">
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
              {content.missionEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl"
            >
              <TextHighlight>{content.missionHeading}</TextHighlight>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
            >
              {content.AboutUsText}
            </motion.p>

            <motion.a
              variants={fadeInUp}
              href={content.missionCtaHref}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              {content.missionCtaLabel}
            </motion.a>
          </motion.div>

          <motion.div
            className="relative h-72 overflow-hidden rounded-2xl bg-[#d9d9d9] sm:h-90 md:h-105"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <Image
              src={content.AboutUsImage}
              alt="Skill and community development initiative"
              fill
              unoptimized
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Mobile-only heading shown above photos */}
          <motion.div
            className="lg:hidden"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              variants={fadeInUp}
              className="text-xl font-semibold text-[#63c37a]"
            >
              {content.visionEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238]"
            >
              <TextHighlight>{content.visionHeading}</TextHighlight>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 grid-rows-2 gap-4 md:h-155 md:gap-6"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="relative row-span-2 h-72 overflow-hidden rounded-3xl sm:h-88 md:h-auto md:rounded-4xl">
              <Image
                src={content.OurMissionImageOne}
                alt="Skill development sessions"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42 md:h-auto md:rounded-4xl">
              <Image
                src={content.OurMissionImageTwo}
                alt="Community and youth support"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42 md:h-auto md:rounded-4xl">
              <Image
                src={content.OurMissionImageThree}
                alt="Education and training activities"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {/* Desktop-only heading shown beside photos */}
            <div className="hidden lg:block">
              <motion.p
                variants={fadeInUp}
                className="text-xl font-semibold text-[#63c37a] md:text-2xl"
              >
                {content.visionEyebrow}
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl"
              >
                <TextHighlight>{content.visionHeading}</TextHighlight>
              </motion.h2>
            </div>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
            >
              {content.OurVisionText}
            </motion.p>

            <motion.a
              variants={fadeInUp}
              href={content.visionCtaHref}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              {content.visionCtaLabel}
            </motion.a>
          </motion.div>
        </div>
      </section>

      <OngoingProjectsCarousel />

      <TestimonialsSection />

      <section className="bg-white py-14 md:py-24">
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
            {csrVideoId ? (
              <button
                type="button"
                onClick={() => setActiveCsrVideo(true)}
                className="group relative block w-full"
                aria-label="Play CSR partnership video"
              >
                <img
                  src={`https://img.youtube.com/vi/${csrVideoId}/maxresdefault.jpg`}
                  alt="CSR partnership video"
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-90 md:h-115"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />

                <span className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#63c37a] text-3xl text-white shadow-lg transition-transform group-hover:scale-105 md:h-28 md:w-28 md:text-5xl">
                  ▶
                </span>
              </button>
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-[#0f172a] text-sm font-medium text-white/70 sm:h-90 md:h-115">
                Invalid YouTube URL
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <LatestArticlesSection />

      <GetInTouchSection />

      <FooterSection />
    </div>
  );
}
