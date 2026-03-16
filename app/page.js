"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import OngoingProjectsCarousel from "./components/OngoingProjectsCarousel";
import LatestArticlesSection from "./components/LatestArticlesSection";
import GetInTouchSection from "./components/GetInTouchSection";
import FooterSection from "./components/FooterSection";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <nav className="relative flex h-24 w-full items-center justify-between px-4 md:px-8 lg:px-10">
          <a
            href="#"
            className="flex items-center gap-3"
            aria-label="SDEAS Welfare Foundation Home"
          >
            <Image
              src="/logo.jpeg"
              alt="SDEAS Welfare Foundation"
              width={220}
              height={56}
              priority
              className="h-12 w-auto object-contain md:h-14"
            />
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-base font-medium text-[#576076] xl:flex">
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                About
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                CSR Projects
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                Partner With Us
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-[#171a34]">
                Contact
              </a>
            </li>
          </ul>

          <div className="flex items-center justify-end pl-6 md:pl-8">
            <a
              href="#"
              className={`inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-[#63c37a] px-8 text-lg font-semibold transition-colors ${
                isScrolled
                  ? "bg-[#63c37a] text-[#ffffff] hover:bg-transparent hover:text-[#63c37a]"
                  : "bg-transparent text-[#63c37a] hover:bg-[#63c37a] hover:text-[#ffffff]"
              }`}
            >
              <span className="text-sm">❤</span>
              Donate
            </a>
          </div>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden bg-white">
        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-350 grid-cols-1 items-center gap-8 px-4 pt-12 pb-0 md:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold leading-tight text-[#111827] md:text-6xl lg:text-7xl">
              <span className="text-[#63c37a]">Empowering Youth</span>
              <span className="text-[#111827]">… Empowering Nation</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-[#5b667d] md:text-xl">
              SDEAS Welfare Foundation is a non-profit organization dedicated to
              empowering youth through skill development, education, and
              community development initiatives.
            </p>

            <a
              href="#"
              className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-10 text-lg font-bold tracking-wide text-white transition-colors hover:bg-[#459557]"
            >
              DONATE NOW
            </a>
          </div>

          <div className="relative flex h-full items-end justify-center overflow-visible lg:justify-end">
            <Image
              src="/Gemini_Generated_Image_owy26wowy26wowy2.png"
              alt="SDEAS youth skill development and training"
              width={1100}
              height={1250}
              priority
              className="h-auto max-h-[92vh] w-[92vw] max-w-none object-contain sm:w-[70vw] lg:w-[58vw] lg:max-w-245 xl:w-[55vw]"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <article className="group relative isolate min-h-120 overflow-hidden px-8 py-14 md:px-10">
            <Image
              src="/indtrain.jpeg"
              alt="Skill development training"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#63c37a]/40 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-60" />

            <div className="relative flex h-full flex-col justify-end text-white">
              <h3 className="max-w-[16ch] font-serif text-3xl leading-tight font-semibold md:text-4xl">
                Skill Development Training
              </h3>
              <a
                href="#"
                className="mt-8 inline-flex text-lg font-bold tracking-wide text-white transition-opacity hover:opacity-80"
              >
                LEARN MORE
              </a>
            </div>
          </article>

          <article className="group relative isolate min-h-120 overflow-hidden px-8 py-14 md:px-10">
            <Image
              src="/skilldev.jpeg"
              alt="Industrial training programs"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#63c37a]/40 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-60" />

            <div className="relative flex h-full flex-col justify-end text-white">
              <h3 className="max-w-[16ch] font-serif text-3xl leading-tight font-semibold md:text-4xl">
                Industrial Training Programs
              </h3>
              <a
                href="#"
                className="mt-8 inline-flex text-lg font-bold tracking-wide text-white transition-opacity hover:opacity-80"
              >
                LEARN MORE
              </a>
            </div>
          </article>

          <article className="group relative isolate min-h-120 overflow-hidden px-8 py-14 md:px-10">
            <Image
              src="/skill.jpeg"
              alt="Youth empowerment workshops"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#63c37a]/40 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-60" />

            <div className="relative flex h-full flex-col justify-end text-white">
              <h3 className="max-w-[16ch] font-serif text-3xl leading-tight font-semibold md:text-4xl">
                Youth Empowerment Workshops
              </h3>
              <a
                href="#"
                className="mt-8 inline-flex text-lg font-bold tracking-wide text-white transition-opacity hover:opacity-80"
              >
                LEARN MORE
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              About Us
            </p>
            <h2 className="mt-4 font-serif text-5xl font-bold leading-none text-[#1d2238] md:text-6xl">
              Our Mission
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-[#5f6879] md:text-xl">
              SDEAS Welfare Foundation is committed to developing and empowering
              youth through skill development, industrial training, and
              community programs. We collaborate with industries and CSR
              initiatives to create practical career opportunities.
            </p>

            <a
              href="#"
              className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-10 text-lg font-bold text-white transition-colors hover:bg-[#459557]"
            >
              LEARN MORE
            </a>
          </div>

          <div className="relative h-105 overflow-hidden rounded-2xl bg-[#d9d9d9]">
            <Image
              src="/aboutus.jpeg"
              alt="Skill and community development initiative"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#efefef] py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="grid h-140 grid-cols-2 grid-rows-2 gap-6 md:h-155">
            <div className="relative row-span-2 overflow-hidden rounded-4xl">
              <Image
                src="/flag2.jpeg"
                alt="Skill development sessions"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative overflow-hidden rounded-4xl">
              <Image
                src="/last boiler.jpeg"
                alt="Community and youth support"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative overflow-hidden rounded-4xl">
              <Image
                src="/ok.jpeg"
                alt="Education and training activities"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              What We Do
            </p>
            <h2 className="mt-4 font-serif text-5xl font-bold leading-none text-[#1d2238] md:text-6xl">
              Our Vision
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-[#5f6879] md:text-xl">
              To create a society where every young individual has access to
              skill development, education, and employment opportunities,
              enabling them to become self-reliant and responsible citizens.
            </p>

            <a
              href="#"
              className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-10 text-lg font-bold text-white transition-colors hover:bg-[#459557]"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      <OngoingProjectsCarousel />

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              CSR Partnership
            </p>
            <h2 className="mt-4 font-serif text-5xl font-bold leading-tight text-[#1d2238] md:text-6xl">
              Partner With Us for Social Impact
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-[#5f6879] md:text-xl">
              SDEAS Welfare Foundation actively collaborates with industries and
              corporate organizations to implement CSR initiatives focused on
              skill development, youth empowerment, and community development.
            </p>

            <a
              href="#"
              className="mt-12 inline-flex h-14 items-center justify-center rounded-full bg-[#63c37a] px-10 text-lg font-bold text-white transition-colors hover:bg-[#459557]"
            >
              PARTNER NOW
            </a>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
              alt="Hands joined to symbolize partnership"
              className="h-115 w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <a
              href="#"
              aria-label="Partner with SDEAS Welfare Foundation"
              className="absolute left-1/2 top-1/2 inline-flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#63c37a] text-5xl text-white shadow-lg transition-colors hover:bg-[#459557]"
            >
              ▶
            </a>
          </div>
        </div>
      </section>

      <LatestArticlesSection />

      <GetInTouchSection />

      <FooterSection />
    </div>
  );
}
