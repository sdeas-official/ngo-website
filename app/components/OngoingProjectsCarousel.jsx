"use client";

import { useMemo, useState } from "react";

const projects = [
  {
    title: "Skill Development Training for Underprivileged Youth",
    location: "Rourkela, Odisha",
    image: "/skill.jpeg",
  },
  {
    title: "Industrial Training Program with Industry Mentors",
    location: "Odisha, India",
    image: "/proj2.jpeg",
  },
  {
    title: "Youth Empowerment Workshops and Career Guidance",
    location: "Eastern India",
    image: "/last boiler.jpeg",
  },
  {
    title: "CSR Community Development and Education Support",
    location: "Rural Odisha",
    image: "/flag4.jpeg",
  },
];

export default function OngoingProjectsCarousel() {
  const [index, setIndex] = useState(0);
  const total = projects.length;

  const current = useMemo(() => projects[index], [index]);

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <section className="bg-white py-14 md:py-24">
      <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              CSR Projects
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#1d2238] sm:text-4xl md:text-5xl">
              Ongoing Programs for Skill Development
            </h2>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-[#1d2238] transition-colors hover:bg-[#1d2238] hover:text-white"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-[#1d2238] transition-colors hover:bg-[#1d2238] hover:text-white"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={current.image}
            alt={current.title}
            className="h-84 w-full object-cover sm:h-96 md:h-130"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 md:p-10">
            <p className="text-base font-medium uppercase tracking-[0.2em] text-white/90">
              {current.location}
            </p>
            <h3 className="mt-2 max-w-3xl font-serif text-2xl font-bold leading-tight sm:text-3xl md:mt-3 md:text-5xl">
              {current.title}
            </h3>
            <a
              href="#"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#63c37a] px-6 text-sm font-bold text-white transition-colors hover:bg-[#459557] md:mt-6 md:h-12 md:px-8 md:text-base"
            >
              SUPPORT NOW
            </a>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={prev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2238] transition-colors hover:bg-[#1d2238] hover:text-white"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2238] transition-colors hover:bg-[#1d2238] hover:text-white"
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {projects.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                slideIndex === index ? "w-8 bg-[#63c37a]" : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
