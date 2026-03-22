"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, viewport } from "../../lib/animations";

export default function GetInTouchSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3f3f3]">
      {/* Mobile: full image visible + text stacked below */}
      <div className="md:hidden">
        <div className="relative w-full">
          <Image
            src="/Gemini_Generated_Image_keeg33keeg33keeg.png"
            alt="People pulling rope together"
            width={800}
            height={600}
            priority={false}
            className="h-auto w-full object-contain"
          />
        </div>
        <motion.div
          className="px-4 py-10 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.p
            variants={fadeInUp}
            className="text-lg font-medium text-[#1a1f3b]"
          >
            Partner With Us
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mt-2 font-serif text-3xl font-bold leading-tight text-[#171a34]"
          >
            Let&apos;s Build Youth Careers Together
          </motion.h2>
          <motion.a
            variants={fadeInUp}
            href="#"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#63c37a] px-6 text-base font-bold text-white transition-colors hover:bg-[#459557]"
          >
            Call / Text: 9348629818
          </motion.a>
        </motion.div>
      </div>

      {/* Desktop: overlay image with text */}
      <div className="relative hidden h-160 w-full md:block lg:h-184">
        <Image
          src="/Gemini_Generated_Image_keeg33keeg33keeg.png"
          alt="People pulling rope together"
          fill
          priority={false}
          className="object-cover object-center"
        />
        <motion.div
          className="relative z-10 mx-auto flex h-full w-full max-w-350 flex-col items-center justify-center px-4 text-center md:px-8 lg:px-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xl font-medium text-[#1a1f3b] md:text-3xl"
          >
            Partner With Us
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="mt-2 font-serif text-4xl font-bold leading-tight text-[#171a34] md:text-6xl"
          >
            Let&apos;s Build Youth Careers Together
          </motion.h2>
          <motion.a
            variants={fadeInUp}
            href="#"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-12 text-xl font-bold text-white transition-colors hover:bg-[#459557]"
          >
            Call / Text: 9348629818
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
