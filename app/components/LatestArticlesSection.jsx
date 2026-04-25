"use client";

import { Query } from "appwrite";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, viewport } from "../../lib/animations";
import { createDatabasesClient } from "../../lib/appwriteClient";

const fallbackLatestArticles = [
  {
    author: "SDEAS Foundation",
    date: "March 2026",
    title: "Youth Skill Development Workshop Successfully Conducted",
    excerpt:
      "Hands-on sessions helped students gain practical knowledge for career readiness and employment opportunities.",
    image: "/flag2.jpeg",
  },
  {
    author: "SDEAS Foundation",
    date: "February 2026",
    title: "CSR Partnership Discussion with Industry Leaders",
    excerpt:
      "Corporate and industry partners joined us to design high-impact CSR projects for youth empowerment.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    highlighted: true,
  },
  {
    author: "SDEAS Foundation",
    date: "January 2026",
    title: "Community Development and Education Awareness Event",
    excerpt:
      "Our volunteers and trainers organized awareness activities to support education and social welfare in local communities.",
    image:
      "https://images.unsplash.com/photo-1605106702734-205df224ecce?auto=format&fit=crop&w=1200&q=80",
  },
];

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

export default function LatestArticlesSection() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [latestArticles, setLatestArticles] = useState(fallbackLatestArticles);

  useEffect(() => {
    const loadEventCardFromHome = async () => {
      const homeSecondaryCollectionId =
        config.collections.homeTwo || "home_page_two";

      if (!databases || !config.databaseId || !homeSecondaryCollectionId) {
        return;
      }

      try {
        const result = await databases.listDocuments(
          config.databaseId,
          homeSecondaryCollectionId,
          [Query.orderDesc("$createdAt"), Query.limit(100)],
        );

        const mapped = (result.documents || [])
          .map((doc, index) => {
            const image =
              typeof doc.EventsImage === "string" ? doc.EventsImage.trim() : "";
            const title =
              typeof doc.EventsHeading === "string"
                ? doc.EventsHeading.trim()
                : "";
            const excerpt =
              typeof doc.EventsText === "string" ? doc.EventsText.trim() : "";

            if (!image || !title || !excerpt) return null;

            return {
              author: "SDEAS Foundation",
              date:
                typeof doc.$createdAt === "string"
                  ? new Date(doc.$createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Latest",
              title,
              excerpt,
              image,
              highlighted: index === 1,
            };
          })
          .filter(Boolean);

        if (mapped.length) {
          setLatestArticles(mapped);
        }
      } catch {
        // keep fallback article
      }
    };

    loadEventCardFromHome();
  }, [config.collections.homeTwo, config.databaseId, databases]);

  return (
    <section className="bg-[#f8faf8] py-14 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10">
        <motion.div
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div>
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-xs font-bold tracking-[0.3em] text-[#63c37a] uppercase"
            >
              Stay Updated
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl font-bold text-[#1d2238] md:text-5xl"
            >
              Events &amp; Updates
            </motion.h2>
          </div>
          <motion.a
            variants={fadeInUp}
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#63c37a] transition-colors hover:text-[#459557]"
          >
            View All Updates
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#63c37a]/50">
              →
            </span>
          </motion.a>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {latestArticles.map((article) => (
            <motion.article
              key={article.title}
              variants={fadeInUp}
              className="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="px-6 py-6 md:px-7 md:py-7">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#94a3b8]">
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium md:text-sm">
                    <UserIcon />
                    <span>{article.author}</span>
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium md:text-sm">
                    <CalendarIcon />
                    <span>{article.date}</span>
                  </p>
                </div>

                <h3
                  className={`mt-4 font-serif text-xl font-bold leading-snug md:text-2xl ${
                    article.highlighted ? "text-[#3da85a]" : "text-[#1d2238]"
                  }`}
                >
                  {article.title}
                </h3>

                <div className="mt-4 h-0.5 w-8 rounded-full bg-[#63c37a]" />

                <p className="mt-4 text-sm leading-7 text-[#64748b] md:text-base">
                  {article.excerpt}
                </p>

                <a
                  href="/partner-with-us"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#63c37a] transition-colors hover:text-[#459557] md:text-base"
                >
                  Read Update
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
