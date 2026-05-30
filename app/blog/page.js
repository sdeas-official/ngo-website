"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { BlogCard } from "../components/BlogCard";
import { createDatabasesClient } from "@/lib/appwriteClient";
import { Query } from "appwrite";
import { useBlogContent } from "@/lib/useSiteContent";

function readingTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#eef1ee] bg-white">
      <div className="aspect-[16/10] w-full animate-pulse bg-[#eef2ee]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[#eef2ee]" />
        <div className="h-5 w-full animate-pulse rounded-full bg-[#eef2ee]" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-[#eef2ee]" />
        <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-[#eef2ee]" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#eef2ee]" />
      </div>
    </div>
  );
}

export default function Blog() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const content = useBlogContent();
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadBlogPosts = async () => {
      if (!databases || !config.databaseId || !config.collections.blog) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await databases.listDocuments(
          config.databaseId,
          config.collections.blog,
          [Query.orderDesc("publishedDate"), Query.limit(100)],
        );

        const posts = (result.documents || []).map((doc) => ({
          title: typeof doc.title === "string" ? doc.title.trim() : "",
          author: typeof doc.author === "string" ? doc.author.trim() : "",
          content: typeof doc.content === "string" ? doc.content.trim() : "",
          image: typeof doc.mainImage === "string" ? doc.mainImage.trim() : "",
          tag: typeof doc.tags === "string" ? doc.tags.trim() : "",
          date:
            typeof doc.publishedDate === "string"
              ? new Date(doc.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "",
          slug: doc.$id,
        }));

        setBlogPosts(posts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, [databases, config]);

  // Distinct tags for the filter bar.
  const tags = useMemo(() => {
    const set = new Set();
    blogPosts.forEach((p) => p.tag && set.add(p.tag));
    return ["All", ...Array.from(set)];
  }, [blogPosts]);

  // Apply tag + search filters.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogPosts.filter((p) => {
      const matchTag = activeTag === "All" || p.tag === activeTag;
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
  }, [blogPosts, activeTag, search]);

  const isDefaultView = activeTag === "All" && !search.trim();
  const featuredPost = isDefaultView ? filtered[0] : null;
  const gridPosts = isDefaultView ? filtered.slice(1) : filtered;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[52vh] items-center md:min-h-[60vh]">
          <img
            src={content.heroImage}
            alt="Blog and news"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c3d20]/90 via-[#14532d]/75 to-[#14532d]/40" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-[#a7f3c0] uppercase">
              <span className="h-px w-8 bg-[#a7f3c0]" />
              {content.heroEyebrow}
            </span>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-extrabold leading-[1.05] text-white md:text-6xl">
              {content.heroHeading}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-xl">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar: search + category filter */}
      <section className="sticky top-0 z-30 border-b border-[#eef1ee] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-350 flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  activeTag === tag
                    ? "bg-[#63c37a] text-white shadow-[0_6px_16px_rgba(99,195,122,0.4)]"
                    : "bg-[#f1f5f1] text-[#5f6879] hover:bg-[#e3eee5] hover:text-[#2f7d46]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <svg
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa3b0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3-3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-[#e6eae6] bg-[#f7faf7] py-2.5 pr-4 pl-10 text-sm text-[#1d2238] outline-none transition-colors placeholder:text-[#9aa3b0] focus:border-[#63c37a] focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      {isLoading ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-[16/11] w-full animate-pulse rounded-3xl bg-[#eef2ee]" />
              <div className="flex flex-col justify-center gap-4">
                <div className="h-4 w-32 animate-pulse rounded-full bg-[#eef2ee]" />
                <div className="h-10 w-full animate-pulse rounded-2xl bg-[#eef2ee]" />
                <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-[#eef2ee]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[#eef2ee]" />
              </div>
            </div>
          </div>
        </section>
      ) : featuredPost ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid overflow-hidden rounded-[2rem] border border-[#eef1ee] bg-white shadow-[0_10px_40px_rgba(17,24,39,0.07)] transition-all duration-300 hover:shadow-[0_28px_60px_rgba(20,83,45,0.16)] lg:grid-cols-2"
            >
              <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold tracking-wide text-[#2f7d46] uppercase shadow-sm backdrop-blur">
                  ★ {content.featuredLabel}
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8a93a3]">
                  {featuredPost.tag ? (
                    <span className="rounded-full bg-[#eef7f0] px-3 py-1 font-bold text-[#2f7d46] capitalize">
                      {featuredPost.tag}
                    </span>
                  ) : null}
                  {featuredPost.date ? <span>{featuredPost.date}</span> : null}
                  <span className="h-1 w-1 rounded-full bg-[#cdd3da]" />
                  <span>{readingTime(featuredPost.content)} min read</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1d2238] transition-colors group-hover:text-[#2f7d46] md:text-[2.6rem]">
                  {featuredPost.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#5f6879] line-clamp-3 md:text-lg">
                  {featuredPost.content}
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#63c37a] to-[#2f7d46] text-sm font-bold text-white">
                    {(featuredPost.author || "S").charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1d2238]">
                      {featuredPost.author || "SDEAS"}
                    </p>
                    <p className="text-xs text-[#8a93a3]">Author</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#63c37a] transition-transform duration-300 group-hover:translate-x-1">
                    Read story →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Grid */}
      <section className="bg-[#f7fbf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-bold tracking-[0.25em] text-[#63c37a] uppercase">
              {content.recentEyebrow}
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#1d2238] md:text-5xl">
              {isDefaultView
                ? content.recentHeading
                : `${filtered.length} ${filtered.length === 1 ? "article" : "articles"} found`}
            </h2>
            {isDefaultView ? (
              <p className="mx-auto mt-4 max-w-2xl text-[#5f6879] md:text-lg">
                {content.recentSubtitle}
              </p>
            ) : null}
          </div>

          {isLoading ? (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : gridPosts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              {gridPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  author={post.author}
                  date={post.date}
                  content={post.content}
                  image={post.image}
                  tag={post.tag}
                  href={`/blog/${post.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-[#cfe3d4] bg-white px-6 py-14 text-center">
              <p className="text-5xl">🔍</p>
              <h3 className="mt-4 font-serif text-2xl font-bold text-[#1d2238]">
                No articles found
              </h3>
              <p className="mt-2 text-[#5f6879]">
                Try a different category or clear your search.
              </p>
              {(activeTag !== "All" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTag("All");
                    setSearch("");
                  }}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#63c37a] px-6 text-sm font-bold text-white transition-colors hover:bg-[#2f7d46]"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
