"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { TeamCard } from "../components/TeamCard";
import { TextHighlight } from "../components/TextHighlight";
import { useAboutContent } from "../../lib/useSiteContent";

export default function About() {
  const { content, team } = useAboutContent();
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayStats, setDisplayStats] = useState([]);
  const [activeStatSlide, setActiveStatSlide] = useState(0);

  const parsedStats = useMemo(() => {
    const numbers = content.statNumbers || [];
    const labels = content.statLabels || [];
    return numbers.map((number, i) => ({
      number: String(number),
      label: labels[i] || "",
      value: Number.parseInt(String(number).replace(/[^0-9]/g, ""), 10) || 0,
      suffix: String(number).replace(/[0-9,]/g, ""),
    }));
  }, [content.statNumbers, content.statLabels]);

  useEffect(() => {
    const target = statsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1500;
    let animationFrame = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayStats(parsedStats.map((stat) => Math.round(stat.value * progress)));
      if (progress < 1) animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimated, parsedStats]);

  useEffect(() => {
    if (!parsedStats.length) return undefined;
    const timer = setInterval(() => {
      setActiveStatSlide((prev) => (prev + 1) % parsedStats.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [parsedStats.length]);

  const storyParagraphs = (content.OurStoryText || "").split("\n").filter(Boolean);
  const missionParagraphs = (content.OurMissionText || "").split("\n").filter(Boolean);
  const visionParagraphs = (content.OurVisionText || "").split("\n").filter(Boolean);
  const visionImages = content.visionImages || [];
  const coreValues = content.coreValues || [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[75vh] w-full items-center">
          <img
            src={content.heroImage}
            alt="Teamwork"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-24 md:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.25em] text-[#63c37a] uppercase mb-5">
                {content.heroEyebrow}
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {content.heroTitleTop}
                <br />
                <span className="text-[#63c37a]">{content.heroTitleBottom}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base text-white/75 md:text-xl">
                {content.heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-[#63c37a] py-3 md:py-14">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          {/* Mobile slideshow */}
          <div className="md:hidden">
            <div className="relative min-h-16 overflow-hidden">
              {parsedStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`absolute inset-0 text-center transition-all duration-500 ${
                    activeStatSlide === index
                      ? "translate-x-0 opacity-100"
                      : "pointer-events-none translate-x-6 opacity-0"
                  }`}
                >
                  <p className="font-serif text-2xl font-extrabold leading-none text-white">
                    {(displayStats[index] ?? 0).toLocaleString()}
                    {stat.suffix}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wide text-white/80 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-center gap-1.5">
              {parsedStats.map((stat, index) => (
                <span
                  key={`${stat.label}-dot`}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    activeStatSlide === index ? "bg-white" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-4">
            {parsedStats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-4xl font-extrabold text-white md:text-5xl">
                  {(displayStats[index] ?? 0).toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="mt-2 text-sm font-medium tracking-wide text-white/75 uppercase md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Story ────────────────────────────────────────────────── */}
      <section id="our-story" className="bg-white py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="relative">
            <div className="relative h-80 overflow-hidden rounded-3xl sm:h-96 md:h-112">
              <img
                src={content.OurStoryImage}
                alt="Teamwork and community"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating stat badge */}
            <div className="absolute -bottom-5 right-6 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.15)] border border-slate-100">
              <p className="text-xs font-semibold text-[#5f6879] uppercase tracking-widest">
                {content.storyBadgeLabel}
              </p>
              <p className="mt-0.5 font-serif text-3xl font-extrabold text-[#63c37a]">
                {content.storyBadgeValue}
              </p>
            </div>
          </div>

          <div className="max-w-2xl pt-6 lg:pt-0">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              {content.storyEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>{content.storyHeading}</TextHighlight>
            </h2>
            {storyParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission ──────────────────────────────────────────────────── */}
      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              {content.missionEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>{content.missionHeading}</TextHighlight>
            </h2>
            {missionParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="relative h-80 overflow-hidden rounded-3xl sm:h-96 md:h-105">
            <img
              src={content.OurMissionImage}
              alt="Industrial training"
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* ─── Vision ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Mobile-only heading shown above photos */}
          <div className="lg:hidden">
            <p className="text-xl font-semibold text-[#63c37a]">{content.visionEyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238]">
              <TextHighlight>{content.visionHeading}</TextHighlight>
            </h2>
            {visionParagraphs.map((paragraph, idx) => (
              <p key={idx} className="mt-4 text-base leading-relaxed text-[#5f6879]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="relative row-span-2 h-72 overflow-hidden rounded-3xl sm:h-88 md:h-auto">
              <img
                src={visionImages[0]}
                alt="Community development"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42">
              <img
                src={visionImages[1]}
                alt="Youth empowerment"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42">
              <img
                src={visionImages[2]}
                alt="Skill development"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Text */}
          <div className="max-w-2xl">
            {/* Desktop heading */}
            <div className="hidden lg:block">
              <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
                {content.visionEyebrow}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
                <TextHighlight>{content.visionHeading}</TextHighlight>
              </h2>
            </div>

            {visionParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ─────────────────────────────────────────────────────── */}
      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              {content.teamEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>{content.teamHeading}</TextHighlight>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              {content.teamSubtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team === null ? (
              <p className="text-[#5f6879]">Loading team information...</p>
            ) : team.length > 0 ? (
              team.map((member) => <TeamCard key={member.name} {...member} />)
            ) : (
              <p className="text-[#5f6879]">No team members added yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Core Values ──────────────────────────────────────────────── */}
      <section className="bg-[#f0fdf4] py-20 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              {content.valuesEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              {content.valuesHeading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-[#5f6879] md:text-lg">
              {content.valuesSubtitle}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((val) => (
              <div
                key={val.title}
                className="group rounded-3xl border border-[#63c37a]/20 bg-white p-8 shadow-[0_4px_20px_rgba(99,195,122,0.08)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,195,122,0.18)] hover:border-[#63c37a]/50"
              >
                <span className="text-4xl">{val.icon}</span>
                <h3 className="mt-5 font-serif text-2xl font-bold text-[#1d2238]">
                  {val.title}
                </h3>
                <span className="mt-4 block h-0.5 w-8 bg-[#63c37a] transition-all duration-300 group-hover:w-14" />
                <p className="mt-4 text-sm leading-relaxed text-[#5f6879] md:text-base">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
