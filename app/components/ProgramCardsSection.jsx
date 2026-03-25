"use client";

import Image from "next/image";
import { Query } from "appwrite";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, viewport } from "../../lib/animations";
import { createDatabasesClient } from "../../lib/appwriteClient";

const fallbackProgramCards = [
  {
    title: "Skill Development Training",
    image: "/indtrain.jpeg",
    alt: "Skill development training",
    description:
      "Hands-on training programs that equip youth with industry-relevant skills to secure meaningful employment and build independent futures.",
  },
  {
    title: "Industrial Training Programs",
    image: "/skilldev.jpeg",
    alt: "Industrial training programs",
    description:
      "Structured partnerships with industries to provide real-world exposure, mentorship, and practical experience for young aspirants.",
  },
  {
    title: "Youth Empowerment Workshops",
    image: "/skill.jpeg",
    alt: "Youth empowerment workshops",
    description:
      "Community-driven workshops focused on leadership, confidence, and life skills that help youth realize their full potential.",
  },
];

export default function ProgramCardsSection() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [programCards, setProgramCards] = useState(fallbackProgramCards);

  useEffect(() => {
    const loadProgramCardFromHome = async () => {
      const homeOurProgramsCollectionId =
        config.collections.homeOurPrograms || "home_our_programs";

      if (!databases || !config.databaseId || !homeOurProgramsCollectionId) {
        return;
      }

      try {
        const result = await databases.listDocuments(
          config.databaseId,
          homeOurProgramsCollectionId,
          [Query.orderDesc("$createdAt"), Query.limit(100)],
        );

        const mapped = (result.documents || [])
          .map((doc) => {
            const image =
              typeof doc.programImage === "string"
                ? doc.programImage.trim()
                : typeof doc.ourProgrammsImage === "string"
                  ? doc.ourProgrammsImage.trim()
                  : "";
            const title =
              typeof doc.programTitle === "string"
                ? doc.programTitle.trim()
                : typeof doc.ourProgrammsTitle === "string"
                  ? doc.ourProgrammsTitle.trim()
                  : "";
            const description =
              typeof doc.programDescription === "string"
                ? doc.programDescription.trim()
                : typeof doc.ourProgrammsText === "string"
                  ? doc.ourProgrammsText.trim()
                  : "";

            if (!image || !title || !description) return null;

            return {
              title,
              image,
              alt: title,
              description,
            };
          })
          .filter(Boolean);

        if (mapped.length) {
          setProgramCards(mapped);
        }
      } catch {
        // keep fallback card
      }
    };

    loadProgramCardFromHome();
  }, [config.collections.homeTwo, config.databaseId, databases]);

  return (
    <section className="relative z-10 bg-[#f8faf8] py-20 md:py-28">
      {/* Section Header */}
      <motion.div
        className="mx-auto mb-14 max-w-7xl px-6 md:px-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-xs font-bold tracking-[0.3em] text-[#63c37a] uppercase"
            >
              What We Do
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl font-bold leading-tight text-[#111827] sm:text-5xl md:text-6xl"
            >
              Our Programs
            </motion.h2>
          </div>
          <motion.p
            variants={fadeInUp}
            className="max-w-md text-base leading-relaxed text-[#5b667d] md:text-right"
          >
            Each initiative is designed to create lasting impact in the lives of
            young people across communities.
          </motion.p>
        </div>

        {/* Decorative divider */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-[#e2e8f0]" />
          <div className="h-2 w-2 rotate-45 bg-[#63c37a]" />
          <div className="h-px w-12 bg-[#63c37a]" />
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="mx-auto max-w-7xl px-6 md:px-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programCards.map((card, index) => (
            <motion.article
              key={card.title}
              variants={fadeInUp}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative isolate flex min-h-105 cursor-pointer flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Background image */}
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

              {/* Top accent bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-[#63c37a] transition-all duration-500 group-hover:h-1.5" />

              {/* Watermark number */}
              <span className="absolute right-5 top-5 select-none font-serif text-6xl font-black leading-none text-white/10 transition-all duration-500 group-hover:text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div className="relative mt-auto flex flex-col gap-4 p-7">
                <span className="w-fit rounded-full border border-[#63c37a]/50 bg-[#63c37a]/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#a3e4b0] uppercase">
                  Program
                </span>

                <h3 className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {card.title}
                </h3>

                {/* Description revealed on hover */}
                <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 transition-all duration-500 ease-out group-hover:max-h-24">
                  {card.description}
                </p>

                <a
                  href="/programs"
                  className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#63c37a] transition-all duration-300 hover:gap-3 hover:text-white"
                >
                  Learn More
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#63c37a]/60 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
