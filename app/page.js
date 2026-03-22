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
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewport,
} from "../lib/animations";

export default function Home() {
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
                Empowering <TextHighlight>Youth</TextHighlight>
              </span>
              <span className="block text-[#111827]">
                ... Empowering Nation
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-xl text-base text-[#5b667d] md:mt-6 md:text-xl"
            >
              SDEAS Welfare Foundation is a non-profit organization dedicated to
              empowering youth through skill development, education, and
              community development initiatives.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 md:mt-10">
              <a
                href="/partner-with-us"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-7 text-base font-bold tracking-wide text-white transition-colors hover:bg-[#459557] md:h-14 md:px-10 md:text-lg"
              >
                DONATE NOW
              </a>
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
              src="/Gemini_Generated_Image_qxe6jxqxe6jxqxe6.png"
              alt="SDEAS youth skill development and training"
              width={1100}
              height={1250}
              priority
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
              About Us
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl"
            >
              <TextHighlight>Our Mission</TextHighlight>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
            >
              SDEAS Welfare Foundation is committed to developing and empowering
              youth through skill development, industrial training, and
              community programs. We collaborate with industries and CSR
              initiatives to create practical career opportunities.
            </motion.p>

            <motion.a
              variants={fadeInUp}
              href="/about"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              LEARN MORE
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
              src="/aboutus.jpeg"
              alt="Skill and community development initiative"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#efefef] py-14 md:py-24">
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
              What We Do
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238]"
            >
              <TextHighlight>Our Vision</TextHighlight>
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
                src="/flag2.jpeg"
                alt="Skill development sessions"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42 md:h-auto md:rounded-4xl">
              <Image
                src="/last boiler.jpeg"
                alt="Community and youth support"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative h-34 overflow-hidden rounded-3xl sm:h-42 md:h-auto md:rounded-4xl">
              <Image
                src="/ok.jpeg"
                alt="Education and training activities"
                fill
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
                What We Do
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl"
              >
                <TextHighlight>Our Vision</TextHighlight>
              </motion.h2>
            </div>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
            >
              To create a society where every young individual has access to
              skill development, education, and employment opportunities,
              enabling them to become self-reliant and responsible citizens.
            </motion.p>

            <motion.a
              variants={fadeInUp}
              href="/about"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              LEARN MORE
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
              CSR Partnership
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 font-serif text-4xl font-bold leading-tight text-[#1d2238] md:text-6xl"
            >
              Partner With Us for Social Impact
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl"
            >
              SDEAS Welfare Foundation actively collaborates with industries and
              corporate organizations to implement CSR initiatives focused on
              skill development, youth empowermentt, and community development.
            </motion.p>

            <motion.a
              variants={fadeInUp}
              href="/partner-with-us"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              PARTNER NOW
            </motion.a>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
              alt="Hands joined to symbolize partnership"
              className="h-72 w-full object-cover sm:h-90 md:h-115"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <a
              href="/partner-with-us"
              aria-label="Partner with SDEAS Welfare Foundation"
              className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#63c37a] text-3xl text-white shadow-lg transition-colors hover:bg-[#459557] md:h-28 md:w-28 md:text-5xl"
            >
              ▶
            </a>
          </motion.div>
        </div>
      </section>

      <LatestArticlesSection />

      <GetInTouchSection />

      <FooterSection />
    </div>
  );
}
