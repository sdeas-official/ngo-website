"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Query } from "appwrite";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { BlogCard } from "../../components/BlogCard";
import { createDatabasesClient } from "@/lib/appwriteClient";

function formatDate(value) {
  if (typeof value !== "string" || !value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function mapPost(doc) {
  if (!doc) return null;
  return {
    id: doc.$id,
    title: typeof doc.title === "string" ? doc.title.trim() : "",
    author: typeof doc.author === "string" ? doc.author.trim() : "",
    content: typeof doc.content === "string" ? doc.content.trim() : "",
    image: typeof doc.mainImage === "string" ? doc.mainImage.trim() : "",
    tag: typeof doc.tags === "string" ? doc.tags.trim() : "",
    date: formatDate(doc.publishedDate),
  };
}

export default function BlogPostPage({ params }) {
  const { id } = use(params);
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.blog) {
      setStatus("notfound");
      return;
    }
    let mounted = true;

    (async () => {
      try {
        const doc = await databases.getDocument(config.databaseId, config.collections.blog, id);
        if (!mounted) return;
        setPost(mapPost(doc));
        setStatus("ready");

        try {
          const res = await databases.listDocuments(config.databaseId, config.collections.blog, [
            Query.orderDesc("publishedDate"),
            Query.limit(4),
          ]);
          if (!mounted) return;
          setRelated((res.documents || []).map(mapPost).filter((p) => p && p.id !== id).slice(0, 3));
        } catch {
          /* ignore */
        }
      } catch {
        if (mounted) setStatus("notfound");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config, id]);

  const paragraphs = (post?.content || "").split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {status === "loading" ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-24 md:px-8">
          <div className="h-6 w-32 animate-pulse rounded-full bg-[#eef2ee]" />
          <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-[#eef2ee]" />
          <div className="mt-3 h-12 w-2/3 animate-pulse rounded-2xl bg-[#eef2ee]" />
          <div className="mt-8 h-80 w-full animate-pulse rounded-3xl bg-[#eef2ee]" />
        </div>
      ) : status === "notfound" ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-28 text-center md:px-8">
          <p className="text-6xl">📝</p>
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#1d2238]">Article not found</h1>
          <p className="mt-3 text-[#5f6879]">
            This post may have been removed or the link is incorrect.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-7 text-sm font-bold text-white transition-colors hover:bg-[#2f7d46]"
          >
            ← Back to Blog
          </Link>
        </div>
      ) : (
        <article>
          {/* Header band */}
          <div className="border-b border-[#eef1ee] bg-gradient-to-b from-[#f7fbf8] to-white">
            <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-12 md:px-8 md:pt-14">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#63c37a] transition-colors hover:text-[#2f7d46]"
              >
                ← Back to Blog
              </Link>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-[#8a93a3]">
                {post.tag ? (
                  <span className="rounded-full bg-[#63c37a] px-3.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
                    {post.tag}
                  </span>
                ) : null}
                {post.date ? <span>{post.date}</span> : null}
                {post.date ? <span className="h-1 w-1 rounded-full bg-[#cdd3da]" /> : null}
                <span>{readingTime(post.content)} min read</span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-extrabold leading-[1.1] text-[#1d2238] md:text-5xl">
                {post.title}
              </h1>

              {post.author ? (
                <div className="mt-7 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#63c37a] to-[#2f7d46] text-base font-bold text-white">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1d2238]">{post.author}</p>
                    <p className="text-xs text-[#8a93a3]">SDEAS Welfare Foundation</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Cover image */}
          {post.image ? (
            <div className="mx-auto -mt-px w-full max-w-4xl px-4 pt-10 md:px-8">
              <div className="overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(17,24,39,0.14)]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-64 w-full object-cover sm:h-80 md:h-[30rem]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : null}

          {/* Body */}
          <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
            <div className="space-y-6">
              {paragraphs.length ? (
                paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-[1.075rem] leading-[1.85] text-[#3b4356] md:text-lg"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-lg leading-[1.85] text-[#3b4356]">{post.content}</p>
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-14 flex flex-col gap-5 border-t border-[#e8f0ea] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#63c37a] bg-white px-7 text-sm font-bold text-[#63c37a] transition-colors hover:bg-[#63c37a] hover:text-white"
              >
                ← All articles
              </Link>
              <Link
                href="/partner-with-us"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-7 text-sm font-bold text-white transition-colors hover:bg-[#2f7d46]"
              >
                Support our work →
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {related.length ? (
            <section className="border-t border-[#eef1ee] bg-[#f7fbf8] py-14 md:py-20">
              <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#1d2238] md:text-4xl">
                    More Articles
                  </h2>
                  <Link
                    href="/blog"
                    className="hidden text-sm font-bold text-[#63c37a] transition-colors hover:text-[#2f7d46] sm:inline"
                  >
                    View all →
                  </Link>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {related.map((p) => (
                    <BlogCard
                      key={p.id}
                      title={p.title}
                      author={p.author}
                      date={p.date}
                      content={p.content}
                      image={p.image}
                      tag={p.tag}
                      href={`/blog/${p.id}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </article>
      )}

      <FooterSection />
    </div>
  );
}
