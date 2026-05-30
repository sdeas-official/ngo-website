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
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
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

/* ─── Progress bar at the top of the page ─────────────────────────────── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        background: "rgba(99,195,122,0.15)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #63c37a, #4aac65)",
          transition: "width 0.1s linear",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

/* ─── Skeleton shimmer ────────────────────────────────────────────────── */
function Skeleton({ w, h, r = "999px", mt = 0 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginTop: mt,
        background:
          "linear-gradient(90deg, #f0f4f0 25%, #e4ede5 50%, #f0f4f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite",
      }}
    />
  );
}

/* ─── Inline styles object ───────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#fafcfa",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    overflowX: "hidden",
  },

  /* Loading */
  loadingWrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "6rem 2rem",
  },

  /* Not Found */
  notFoundWrap: {
    maxWidth: 520,
    margin: "0 auto",
    padding: "8rem 2rem",
    textAlign: "center",
  },
  notFoundEmoji: { fontSize: 64, lineHeight: 1 },
  notFoundTitle: {
    marginTop: 20,
    fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
    fontWeight: 700,
    color: "#111827",
    fontFamily: "'Georgia', serif",
    letterSpacing: "-0.02em",
  },
  notFoundBody: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 1.6,
    fontFamily: "sans-serif",
  },
  notFoundBtn: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: 32,
    height: 48,
    padding: "0 28px",
    borderRadius: 999,
    background: "#63c37a",
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.01em",
    textDecoration: "none",
    transition: "background 0.2s, transform 0.15s",
  },

  /* Back link */
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#459557",
    textDecoration: "none",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    transition: "color 0.2s",
    padding: "6px 0",
  },

  /* Article header */
  headerWrap: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "3.5rem 2rem 0",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    minHeight: 28 /* always takes space even with no tag */,
  },
  tag: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 999,
    background: "#e6f5ea",
    color: "#2d7a40",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "sans-serif",
  },
  dateTxt: {
    fontSize: 13,
    color: "#9ca3af",
    fontFamily: "sans-serif",
    letterSpacing: "0.02em",
  },
  headline: {
    marginTop: 18,
    fontSize: "clamp(2rem, 5vw, 3.25rem)",
    fontWeight: 700,
    lineHeight: 1.18,
    color: "#0d1117",
    letterSpacing: "-0.025em",
  },
  dividerLine: {
    width: 48,
    height: 3,
    background: "#63c37a",
    borderRadius: 2,
    marginTop: 24,
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    fontFamily: "sans-serif",
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #63c37a, #3da858)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(99,195,122,0.35)",
  },
  authorLabel: {
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  authorName: { fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 1 },

  /* Hero image */
  heroWrap: {
    maxWidth: 920,
    margin: "2.5rem auto 0",
    padding: "0 1.5rem",
    boxSizing: "border-box",
    width: "100%",
    overflow: "hidden",
  },
  heroInner: {
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  heroImg: {
    width: "100%",
    maxWidth: "100%",
    height: "clamp(220px, 45vw, 520px)",
    objectFit: "cover",
    display: "block",
  },
  /* subtle gradient fade at bottom of hero */
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    background: "linear-gradient(to top, rgba(10,14,10,0.18), transparent)",
    pointerEvents: "none",
  },

  /* Pull-quote style first paragraph  */
  lede: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
    lineHeight: 1.75,
    color: "#1f2937",
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "0.005em",
    borderLeft: "3px solid #63c37a",
    paddingLeft: 24,
    marginBottom: "1.75rem",
  },

  /* Body */
  bodyWrap: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "3.5rem 2rem 4rem",
  },
  paragraph: {
    fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
    lineHeight: 1.85,
    color: "#374151",
    marginBottom: "1.5rem",
  },
  bottomBar: {
    marginTop: "3rem",
    paddingTop: "2rem",
    borderTop: "1px solid #e5ebe6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    fontFamily: "sans-serif",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    height: 44,
    padding: "0 24px",
    borderRadius: 999,
    border: "1.5px solid #63c37a",
    background: "#fff",
    color: "#459557",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.02em",
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s, transform 0.15s",
  },
  shareLabel: {
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  /* Related section */
  relatedSection: {
    background: "#fff",
    borderTop: "1px solid #e5ebe6",
    paddingTop: "4rem",
    paddingBottom: "5rem",
  },
  relatedInner: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "0 2rem",
  },
  relatedEyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#63c37a",
    fontFamily: "sans-serif",
  },
  relatedHeading: {
    marginTop: 8,
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: 700,
    color: "#0d1117",
    letterSpacing: "-0.02em",
  },
  relatedGrid: {
    marginTop: 32,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
};

export default function BlogPostPage({ params }) {
  const { id } = use(params);
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.blog) {
      setStatus("notfound");
      return;
    }
    let mounted = true;

    (async () => {
      try {
        const doc = await databases.getDocument(
          config.databaseId,
          config.collections.blog,
          id,
        );
        if (!mounted) return;
        setPost(mapPost(doc));
        setStatus("ready");

        try {
          const res = await databases.listDocuments(
            config.databaseId,
            config.collections.blog,
            [Query.orderDesc("publishedDate"), Query.limit(4)],
          );
          if (!mounted) return;
          setRelated(
            (res.documents || [])
              .map(mapPost)
              .filter((p) => p && p.id !== id)
              .slice(0, 3),
          );
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

  const paragraphs = (post?.content || "").split("\n").filter(Boolean);

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .back-link:hover { color: #1d7a35 !important; }
        .back-btn:hover  { background: #63c37a !important; color: #fff !important; transform: translateY(-1px); }
        .notfound-btn:hover { background: #459557 !important; transform: translateY(-1px); }
        .article-enter { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .hero-enter    { animation: fadeIn 0.8s ease 0.1s both; }
        .body-enter    { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .hero-img { transition: opacity 0.5s ease, transform 0.6s ease; }
        .hero-img.loaded { opacity: 1; transform: scale(1); }
        .hero-img.loading { opacity: 0; transform: scale(1.02); }
      `}</style>

      <style>{`
        img { max-width: 100%; }
        article { overflow-x: hidden; width: 100%; }
      `}</style>

      {status === "ready" && <ReadingProgress />}

      <div style={s.page}>
        <Navbar />

        {/* ── Loading skeleton ── */}
        {status === "loading" && (
          <div style={s.loadingWrap}>
            <Skeleton w="80px" h="12px" />
            <Skeleton w="40%" h="11px" mt={32} />
            <Skeleton w="100%" h="52px" r="8px" mt={12} />
            <Skeleton w="70%" h="52px" r="8px" mt={8} />
            <div
              style={{
                marginTop: 28,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Skeleton w="44px" h="44px" r="50%" />
              <Skeleton w="120px" h="12px" />
            </div>
            <Skeleton w="100%" h="420px" r="24px" mt={36} />
          </div>
        )}

        {/* ── Not found ── */}
        {status === "notfound" && (
          <div style={s.notFoundWrap}>
            <p style={s.notFoundEmoji}>📝</p>
            <h1 style={s.notFoundTitle}>Article not found</h1>
            <p style={s.notFoundBody}>
              This post may have been removed or the link is incorrect.
            </p>
            <Link href="/blog" style={s.notFoundBtn} className="notfound-btn">
              ← Back to Blog
            </Link>
          </div>
        )}

        {/* ── Article ── */}
        {status === "ready" && post && (
          <article>
            {/* Header */}
            <div style={s.headerWrap} className="article-enter">
              <Link href="/blog" style={s.backLink} className="back-link">
                ← All articles
              </Link>

              <div style={s.metaRow}>
                {post.tag && <span style={s.tag}>{post.tag}</span>}
                {post.date && <span style={s.dateTxt}>{post.date}</span>}
              </div>

              <h1 style={s.headline}>{post.title}</h1>
              <div style={s.dividerLine} />

              {post.author && (
                <div style={s.authorRow}>
                  <div style={s.authorAvatar}>
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={s.authorLabel}>Written by</p>
                    <p style={s.authorName}>{post.author}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hero image */}
            {post.image && (
              <div style={s.heroWrap} className="hero-enter">
                <div style={s.heroInner}>
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    onLoad={() => setImgLoaded(true)}
                    className={`hero-img ${imgLoaded ? "loaded" : "loading"}`}
                    style={s.heroImg}
                  />
                  <div style={s.heroOverlay} />
                </div>
              </div>
            )}

            {/* Body */}
            <div style={s.bodyWrap} className="body-enter">
              <div>
                {paragraphs.length ? (
                  paragraphs.map((para, idx) =>
                    idx === 0 && para.length > 60 ? (
                      <p key={idx} style={s.lede}>
                        {para}
                      </p>
                    ) : (
                      <p key={idx} style={s.paragraph}>
                        {para}
                      </p>
                    ),
                  )
                ) : (
                  <p style={s.paragraph}>{post.content}</p>
                )}
              </div>

              <div style={s.bottomBar}>
                <Link href="/blog" style={s.backBtn} className="back-btn">
                  ← Back to all articles
                </Link>
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <section style={s.relatedSection}>
                <div style={s.relatedInner}>
                  <p style={s.relatedEyebrow}>Keep reading</p>
                  <h2 style={s.relatedHeading}>More Articles</h2>
                  <div style={s.relatedGrid}>
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
            )}
          </article>
        )}
        <FooterSection />
      </div>
    </>
  );
}
