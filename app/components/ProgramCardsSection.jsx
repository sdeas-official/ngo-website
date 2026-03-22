"use client";

import Image from "next/image";
import { useState } from "react";

const programCards = [
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative z-10 bg-[#f8faf8] py-20 md:py-28">
      {/* Section Header */}
      <div className="mx-auto mb-14 max-w-7xl px-6 md:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-[#63c37a] uppercase">
              What We Do
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-[#111827] sm:text-5xl md:text-6xl">
              Our Programs
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[#5b667d] md:text-right">
            Each initiative is designed to create lasting impact in the lives of
            young people across communities.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#e2e8f0]" />
          <div className="h-2 w-2 rotate-45 bg-[#63c37a]" />
          <div className="h-px w-12 bg-[#63c37a]" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-0">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programCards.map((card, index) => (
            <article
              key={card.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative isolate flex min-h-[420px] cursor-pointer flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Background image */}
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

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
                  href="#"
                  className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#63c37a] transition-all duration-300 hover:gap-3 hover:text-white"
                >
                  Learn More
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#63c37a]/60 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}