"use client";

import { useMemo, useState } from "react";
import { Play, X } from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Skill Development Workshop",
    category: "Training",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Industrial Training Program",
    category: "Training",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1603540879030-cf3ef7505a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Healthcare Camp",
    category: "Healthcare",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1728584388081-819a78aa30ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Community Development",
    category: "Community",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1767595789539-cd012af80914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Student Success Stories",
    category: "Success",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1766862769365-64368bf24df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Fire Safety Training",
    category: "Training",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Women Empowerment Program",
    category: "Community",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1758599667729-a6f0f8bd213b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Volunteer Activities",
    category: "Community",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1628147529780-36964fbb8d54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Job Placement Success",
    category: "Success",
  },
];

const categories = ["All", "Training", "Healthcare", "Community", "Success"];

const videos = [
  {
    title: "Industrial Training Program Overview",
    desc: "A glimpse into our practical training methodology and student experience.",
  },
  {
    title: "Student Testimonials",
    desc: "Real stories from learners whose lives were transformed through our programs.",
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPhotos = useMemo(() => {
    if (activeFilter === "All") return photos;
    return photos.filter((photo) => photo.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] items-center md:min-h-[62vh]">
          <img
            src="https://images.unsplash.com/photo-1758599667729-a6f0f8bd213b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
            alt="Gallery"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d70]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Media Gallery
            </p>
            <h1 className="mt-4 font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Moments of Impact
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Capturing transformation, learning, and community empowerment
              through our initiatives.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Photo Gallery
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Explore Our Work
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Browse events, training sessions, field activities, and success
              stories.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors md:px-6 md:text-base ${
                    activeFilter === category
                      ? "bg-[#63c37a] text-white"
                      : "bg-[#f1f5f9] text-[#576076] hover:bg-[#e2e8f0]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedImage(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl text-left shadow-[0_8px_30px_rgba(17,24,39,0.12)] transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0f172abf] via-transparent to-transparent" />
                <div className="absolute right-4 bottom-4 left-4">
                  <h4 className="text-lg font-bold text-white">
                    {photo.title}
                  </h4>
                  <span className="mt-2 inline-block rounded-full bg-[#63c37a] px-3 py-1 text-xs font-semibold text-white">
                    {photo.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Video Gallery
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Stories in Motion
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Training highlights, testimonials, and community impact snapshots.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.title}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(17,24,39,0.10)]"
              >
                <div className="flex aspect-video items-center justify-center bg-[#e8f8ec]">
                  <div className="text-center">
                    <span className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#63c37a] text-white">
                      <Play size={30} className="ml-1" />
                    </span>
                    <p className="text-sm font-semibold text-[#576076]">
                      Play Video
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                    {video.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6879]">
                    {video.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172ae6] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1d2238]"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
          >
            <X size={24} />
          </button>

          <div
            className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-[72vh] w-full object-cover"
            />
            <div className="p-5 md:p-6">
              <h3 className="font-serif text-2xl font-bold text-[#1d2238]">
                {selectedImage.title}
              </h3>
              <span className="mt-3 inline-block rounded-full bg-[#63c37a] px-3 py-1 text-xs font-semibold text-white">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
