"use client";

import Image from "next/image";
import { useState } from "react";
import OngoingProjectsCarousel from "./components/OngoingProjectsCarousel";
import LatestArticlesSection from "./components/LatestArticlesSection";
import GetInTouchSection from "./components/GetInTouchSection";
import FooterSection from "./components/FooterSection";
import { TextHighlight } from "./components/TextHighlight";
import Navbar from "./components/Navbar";

export default function Home() {
  const [activeProgramCard, setActiveProgramCard] = useState(0);

  const programCards = [
    {
      title: "Skill Development Training",
      image: "/indtrain.jpeg",
      alt: "Skill development training",
    },
    {
      title: "Industrial Training Programs",
      image: "/skilldev.jpeg",
      alt: "Industrial training programs",
    },
    {
      title: "Youth Empowerment Workshops",
      image: "/skill.jpeg",
      alt: "Youth empowerment workshops",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-white">
        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-350 grid-cols-1 items-center gap-8 px-4 pt-8 pb-6 md:min-h-[calc(100vh-96px)] md:px-8 md:pt-12 md:pb-0 lg:grid-cols-2 lg:gap-12 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-[#63c37a]">
                Empowering <TextHighlight>Youth</TextHighlight>
              </span>
              <span className="block text-[#111827]">… Empowering Nation</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-[#5b667d] md:mt-6 md:text-xl">
              SDEAS Welfare Foundation is a non-profit organization dedicated to
              empowering youth through skill development, education, and
              community development initiatives.
            </p>

            <div className="mt-8 flex justify-center md:block md:mt-10">
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-7 text-base font-bold tracking-wide text-white transition-colors hover:bg-[#459557] md:h-14 md:px-10 md:text-lg"
              >
                DONATE NOW
              </a>
            </div>
          </div>

          <div className="relative flex h-full items-end justify-center overflow-visible lg:justify-end">
            <Image
              src="/Gemini_Generated_Image_qxe6jxqxe6jxqxe6.png"
              alt="SDEAS youth skill development and training"
              width={1100}
              height={1250}
              priority
              className="h-auto max-h-[62vh] w-full max-w-136 object-contain sm:max-h-[70vh] sm:w-[78vw] lg:max-h-[92vh] lg:w-[58vw] lg:max-w-245 xl:w-[55vw]"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="flex flex-col md:flex-row">
          {programCards.map((card, index) => {
            const isActive = activeProgramCard === index;

            return (
              <article
                key={card.title}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => setActiveProgramCard(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveProgramCard(index);
                  }
                }}
                className={`group relative isolate min-h-72 overflow-hidden p-6 transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63c37a] sm:min-h-80 md:min-h-88 md:p-10 ${
                  isActive ? "md:basis-[60%]" : "md:basis-[20%]"
                }`}
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    isActive ? "scale-105" : "scale-100 group-hover:scale-108"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-linear-to-t from-[#0f172acc] via-[#0f172a6e] to-[#63c37a33] transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-90"
                  }`}
                />
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/15 to-transparent" />

                <div className="relative flex h-full flex-col justify-end text-white">
                  <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-white/80 uppercase">
                    Program
                  </p>
                  <h3 className="max-w-[16ch] font-serif text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl">
                    {card.title}
                  </h3>
                  <a
                    href="#"
                    className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/35 px-5 py-2 text-sm font-semibold tracking-[0.12em] text-white transition-all duration-300 ${
                      isActive
                        ? "bg-white/15 hover:bg-white hover:text-[#0f172a]"
                        : "bg-white/8 hover:bg-white/20"
                    }`}
                  >
                    LEARN MORE <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#efefef] py-14 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              About Us
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
              <TextHighlight>Our Mission</TextHighlight>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl">
              SDEAS Welfare Foundation is committed to developing and empowering
              youth through skill development, industrial training, and
              community programs. We collaborate with industries and CSR
              initiatives to create practical career opportunities.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              LEARN MORE
            </a>
          </div>

          <div className="relative h-72 overflow-hidden rounded-2xl bg-[#d9d9d9] sm:h-90 md:h-105">
            <Image
              src="/aboutus.jpeg"
              alt="Skill and community development initiative"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#efefef] py-14 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Mobile-only heading shown above photos */}
          <div className="lg:hidden">
            <p className="text-xl font-semibold text-[#63c37a]">What We Do</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238]">
              <TextHighlight>Our Vision</TextHighlight>
            </h2>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:h-155 md:gap-6">
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
          </div>

          <div className="max-w-2xl">
            {/* Desktop-only heading shown beside photos */}
            <div className="hidden lg:block">
              <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
                What We Do
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-none text-[#1d2238] md:text-6xl">
                <TextHighlight>Our Vision</TextHighlight>
              </h2>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl">
              To create a society where every young individual has access to
              skill development, education, and employment opportunities,
              enabling them to become self-reliant and responsible citizens.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      <OngoingProjectsCarousel />

      <section className="bg-white py-14 md:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              CSR Partnership
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#1d2238] md:text-6xl">
              Partner With Us for Social Impact
            </h2>

            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:mt-8 md:text-xl">
              SDEAS Welfare Foundation actively collaborates with industries and
              corporate organizations to implement CSR initiatives focused on
              skill development, youth empowerment, and community development.
            </p>

            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557] md:mt-12 md:h-14 md:px-10 md:text-lg"
            >
              PARTNER NOW
            </a>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
              alt="Hands joined to symbolize partnership"
              className="h-72 w-full object-cover sm:h-90 md:h-115"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <a
              href="#"
              aria-label="Partner with SDEAS Welfare Foundation"
              className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#63c37a] text-3xl text-white shadow-lg transition-colors hover:bg-[#459557] md:h-28 md:w-28 md:text-5xl"
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
