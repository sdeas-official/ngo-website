"use client";

import Image from "next/image";
import { motion } from "motion/react";
import OngoingProjectsCarousel from "./components/OngoingProjectsCarousel";
import LatestArticlesSection from "./components/LatestArticlesSection";
import GetInTouchSection from "./components/GetInTouchSection";
import FooterSection from "./components/FooterSection";
import { TextHighlight } from "./components/TextHighlight";
import Navbar from "./components/Navbar";
import ProgramCardsSection from "./components/ProgramCardsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CsrPartnershipSection from "./components/CsrPartnershipSection";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewport,
} from "../lib/animations";
import { useHomeContent } from "../lib/useSiteContent";

export default function Home() {
  const content = useHomeContent();

  const heroStats = (content.heroStatNumbers || []).map((number, index) => ({
    number,
    label: (content.heroStatLabels || [])[index] || "",
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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

      <CsrPartnershipSection content={content} />

      <LatestArticlesSection />

      <GetInTouchSection />

      <FooterSection />
    </div>
  );
}
