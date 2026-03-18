"use client";

import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { BlogCard } from "../components/BlogCard";

const blogPosts = [
  {
    author: "SDEAS Editorial Team",
    title: "Successful Boiler Training Batch Completion - 200 Students Placed",
    content:
      "We are thrilled to announce the successful completion of our latest Industrial Boiler Operation training batch, with 99% of students securing employment with leading industries across India.",
    date: "March 1, 2026",
    image:
      "https://images.unsplash.com/photo-1767595789539-cd012af80914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "boiler-training-batch-completion",
  },
  {
    author: "SDEAS Communications",
    title: "New CSR Partnership Announcement with Leading Corporation",
    content:
      "SDEAS Welfare Foundation partners with a major corporate entity to expand skill development programs and reach 5,000 additional students over the next two years.",
    date: "February 25, 2026",
    image:
      "https://images.unsplash.com/photo-1670299160449-58cccb9545ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "csr-partnership-announcement",
  },
  {
    author: "SDEAS Healthcare Unit",
    title: "Free Health Camp Conducted in Rural Odisha - 500+ Beneficiaries",
    content:
      "Our recent healthcare initiative in rural Odisha provided free medical consultations, diagnostics, and medicines to over 500 community members in underserved areas.",
    date: "February 18, 2026",
    image:
      "https://images.unsplash.com/photo-1603540879030-cf3ef7505a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "health-camp-odisha",
  },
  {
    author: "SDEAS Field Programs",
    title: "Women Empowerment Program Launch in 10 Rural Districts",
    content:
      "Introducing specialized skill development programs for women in rural communities, focusing on entrepreneurship, traditional crafts, and digital literacy.",
    date: "February 10, 2026",
    image:
      "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "women-empowerment-program",
  },
  {
    author: "SDEAS Safety Team",
    title: "Fire Safety Awareness Campaign Reaches 50 Schools",
    content:
      "Our comprehensive fire safety and disaster management training program has successfully reached over 50 schools, training 10,000+ students and teachers.",
    date: "January 28, 2026",
    image:
      "https://images.unsplash.com/photo-1766862769365-64368bf24df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "fire-safety-campaign",
  },
  {
    author: "SDEAS Success Desk",
    title: "Student Success Story: From Training to Career Growth",
    content:
      "Meet Rajesh Kumar, who transformed his life through our boiler operation training program and now works as a senior technician at a leading power plant.",
    date: "January 15, 2026",
    image:
      "https://images.unsplash.com/photo-1628147529780-36964fbb8d54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    slug: "student-success-story",
  },
];

export default function Blog() {
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
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
