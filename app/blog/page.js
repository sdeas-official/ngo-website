"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { BlogCard } from "../components/BlogCard";
import { createDatabasesClient } from "@/lib/appwriteClient";
import { Query } from "appwrite";

export default function Blog() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] items-center md:min-h-[62vh]">
          <img
            src="https://images.unsplash.com/photo-1758599667729-a6f0f8bd213b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
            alt="Blog and news"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d73]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Blog & News
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Stories of Growth & Impact
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Stay updated with our latest programs, success stories, and
              community impact.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          {featuredPost && (
            <div className="overflow-hidden rounded-3xl border border-[#63c37a1f] bg-white shadow-[0_12px_34px_rgba(17,24,39,0.12)] lg:grid lg:grid-cols-2">
              <div className="h-56 sm:h-64 md:h-72 lg:h-96">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 md:p-9 lg:p-10">
                <span className="inline-flex rounded-full bg-[#63c37a] px-4 py-1 text-sm font-semibold text-white">
                  Featured Story
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1d2238] md:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-sm font-semibold text-[#63c37a] md:text-base">
                  By {featuredPost.author}
                </p>
                <p className="mt-1 text-sm text-[#5f6879] md:text-base">
                  Posted on {featuredPost.date}
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#5f6879] md:text-lg">
                  {featuredPost.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Recent Updates
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Latest Articles
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Explore our latest news, program updates, and impact stories.
            </p>
          </div>

          {recentPosts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  author={post.author}
                  date={post.date}
                  content={post.content}
                  image={post.image}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center text-[#5f6879]">
              <p>No blog posts available yet.</p>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
