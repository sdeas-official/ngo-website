"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { TeamCard } from "../components/TeamCard";
import { TextHighlight } from "../components/TextHighlight";
import { createDatabasesClient } from "@/lib/appwriteClient";
import { Query } from "appwrite";

const stats = [
  { number: "4,000+", label: "Youth Trained" },
  { number: "99%", label: "Placement Rate" },
  { number: "50+", label: "Industry Partners" },
  { number: "10+", label: "Years of Impact" },
];

const values = [
  {
    icon: "👥",
    title: "Community First",
    desc: "We prioritize the needs and aspirations of the communities we serve in everything we do.",
  },
  {
    icon: "🎯",
    title: "Excellence",
    desc: "We are committed to delivering high-quality programs and measurable, lasting impact.",
  },
  {
    icon: "🔍",
    title: "Transparency",
    desc: "We operate with integrity and accountability in all our activities and partnerships.",
  },
  {
    icon: "🌱",
    title: "Sustainability",
    desc: "We create lasting solutions that empower communities for long-term success and growth.",
  },
];

export default function About() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayStats, setDisplayStats] = useState(stats.map(() => 0));
  const [activeStatSlide, setActiveStatSlide] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const parsedStats = useMemo(
    () =>
      stats.map((stat) => ({
        ...stat,
        value: Number.parseInt(stat.number.replace(/[^0-9]/g, ""), 10) || 0,
        suffix: stat.number.replace(/[0-9,]/g, ""),
      })),
    [],
  );

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

      setDisplayStats(
        parsedStats.map((stat) => Math.round(stat.value * progress)),
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimated, parsedStats]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStatSlide((prev) => (prev + 1) % parsedStats.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [parsedStats.length]);

  useEffect(() => {
    const loadAboutData = async () => {
      if (!databases || !config.databaseId || !config.collections.about) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await databases.listDocuments(
          config.databaseId,
          config.collections.about,
          [Query.limit(100)],
        );

        if (result.documents && result.documents.length > 0) {
          const doc = result.documents[0];

          // Extract about data (story, mission, vision)
          const aboutInfo = {
            OurStoryImage:
              typeof doc.OurStoryImage === "string"
                ? doc.OurStoryImage.trim()
                : "",
            OurStoryText:
              typeof doc.OurStoryText === "string"
                ? doc.OurStoryText.trim()
                : "",
            OurMissionImage:
              typeof doc.OurMissionImage === "string"
                ? doc.OurMissionImage.trim()
                : "",
            OurMissionText:
              typeof doc.OurMissionText === "string"
                ? doc.OurMissionText.trim()
                : "",
            OurVisionImage:
              typeof doc.OurVisionImage === "string"
                ? doc.OurVisionImage.trim()
                : "",
            OurVisionText:
              typeof doc.OurVisionText === "string"
                ? doc.OurVisionText.trim()
                : "",
          };

          setAboutData(aboutInfo);

          // Extract team members
          if (Array.isArray(doc.Members) && doc.Members.length > 0) {
            const members = doc.Members.filter(
              (member) => member && typeof member === "object",
            ).map((member) => ({
              name:
                typeof member.MembersName === "string"
                  ? member.MembersName.trim()
                  : "Team Member",
              role:
                typeof member.MemberRole === "string"
                  ? member.MemberRole.trim()
                  : "",
              designation:
                typeof member.MemberDescription === "string"
                  ? member.MemberDescription.trim()
                  : "",
              image:
                typeof member.MembersImage === "string"
                  ? member.MembersImage.trim()
                  : "",
            }));
            setTeam(members);
          }
        }
      } catch (error) {
        console.error("Failed to load about data:", error);
        setAboutData(null);
        setTeam([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAboutData();
  }, [databases, config]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[75vh] w-full items-center">
          <img
            src="https://images.unsplash.com/photo-1670299160449-58cccb9545ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMHRvZ2V0aGVyJTIwdGVhbXdvcmslMjB1bml0eXxlbnwxfHx8fDE3NzI4MjQ5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Teamwork"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-24 md:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.25em] text-[#63c37a] uppercase mb-5">
                About Us
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Empowering Youth,
                <br />
                <span className="text-[#63c37a]">Building a Nation</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base text-white/75 md:text-xl">
                Transforming lives through skill development, education, and
                community empowerment across India.
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
                    {displayStats[index].toLocaleString()}
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
                  {displayStats[index].toLocaleString()}
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
                src={
                  aboutData?.OurStoryImage ||
                  "https://images.unsplash.com/photo-1670299160449-58cccb9545ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                }
                alt="Teamwork and community"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating stat badge */}
            <div className="absolute -bottom-5 right-6 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.15)] border border-slate-100">
              <p className="text-xs font-semibold text-[#5f6879] uppercase tracking-widest">
                Placement Rate
              </p>
              <p className="mt-0.5 font-serif text-3xl font-extrabold text-[#63c37a]">
                99%
              </p>
            </div>
          </div>

          <div className="max-w-2xl pt-6 lg:pt-0">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Who We Are
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>Our Story</TextHighlight>
            </h2>
            {aboutData?.OurStoryText ? (
              aboutData.OurStoryText.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="mt-8 text-base leading-relaxed text-[#5f6879] md:text-lg">
                  SDEAS Welfare Foundation was founded with a clear vision: to
                  bridge the critical gap between education and employment
                  opportunities for youth in rural and underserved communities
                  across India.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg">
                  We recognized that many young people have potential and
                  ambition but lack access to industry-relevant skills. Through
                  strategic partnerships with leading industries, we developed
                  training programs that align with real market demands.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg">
                  Our flagship Industrial Boiler Operation program has achieved
                  an exceptional 99% placement rate, transforming the lives of
                  over 4,000 students across Eastern India.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Mission ──────────────────────────────────────────────────── */}
      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Our Purpose
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>Our Mission</TextHighlight>
            </h2>
            {aboutData?.OurMissionText ? (
              aboutData.OurMissionText.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="mt-8 text-base leading-relaxed text-[#5f6879] md:text-lg">
                To empower youth and communities through quality education,
                industry-aligned skill development, and comprehensive social
                welfare programs. We strive to create self-reliant individuals
                and thriving communities by providing access to training,
                healthcare, and livelihood opportunities that transform lives
                and contribute to nation-building.
              </p>
            )}
          </div>

          <div className="relative h-80 overflow-hidden rounded-3xl sm:h-96 md:h-105">
            <img
              src={
                aboutData?.OurMissionImage ||
                "https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              }
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
            <p className="text-xl font-semibold text-[#63c37a]">Our Goal</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238]">
              <TextHighlight>Our Vision</TextHighlight>
            </h2>
            {aboutData?.OurVisionText ? (
              aboutData.OurVisionText.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="mt-4 text-base leading-relaxed text-[#5f6879]"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="mt-6 text-base leading-relaxed text-[#5f6879]">
                  To establish ourselves as a leading force in social
                  transformation across India — creating a future where every
                  youth has access to quality skill development and every
                  community has access to essential healthcare and economic
                  opportunity.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#5f6879]">
                  We envision an India where empowered communities drive
                  economic growth and social progress, with no one left behind.
                </p>
              </>
            )}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="relative row-span-2 h-72 overflow-hidden rounded-3xl sm:h-88 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Community development"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                alt="Youth empowerment"
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42">
              <img
                src="https://images.unsplash.com/photo-1517739277509-06f1c761b6a9?auto=format&fit=crop&w=800&q=80"
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
                Our Goal
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
                <TextHighlight>Our Vision</TextHighlight>
              </h2>
            </div>

            {aboutData?.OurVisionText ? (
              aboutData.OurVisionText.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-lg">
                  To establish ourselves as a leading force in social
                  transformation across India — creating a future where every
                  youth has access to quality skill development and every
                  community has access to essential healthcare and economic
                  opportunity.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg">
                  We envision an India where empowered communities drive
                  economic growth and social progress, with no one left behind.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Team ─────────────────────────────────────────────────────── */}
      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              The People
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              Our <TextHighlight>Leadership</TextHighlight>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              Dedicated professionals committed to driving social change and
              community empowerment.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.length > 0 ? (
              team.map((member) => <TeamCard key={member.name} {...member} />)
            ) : (
              <p className="text-[#5f6879]">Loading team information...</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Core Values ──────────────────────────────────────────────── */}
      <section className="bg-[#f0fdf4] py-20 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              What We Stand For
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              Our Core Values
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-[#5f6879] md:text-lg">
              The principles that guide every decision and action we take in
              service of our communities.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val) => (
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
