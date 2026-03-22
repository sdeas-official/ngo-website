"use client";

import {
  GraduationCap,
  Heart,
  Users,
  Shield,
  Flame,
  BookOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { Button } from "../components/Button";
import ProgramSection from "../components/ProgramSection";
import { createDatabasesClient } from "../../lib/appwriteClient";

const programSectionsFallback = [
  {
    title: "Education & Skill Development",
    description:
      "Our flagship program bridges the gap between education and industry requirements through focused technical training and employer partnerships.",
    image:
      "https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    imageAlt: "Industrial Training",
    icon: GraduationCap,
    points: [
      "4,000+ students successfully trained",
      "99% placement rate with leading industries",
      "Industry-certified curriculum and hands-on training",
      "Job placement assistance and career guidance",
    ],
    cta: {
      label: "Contact",
      to: "/partner-with-us",
    },
    sectionClassName: "",
    reverse: false,
  },
  {
    title: "Healthcare & Awareness Camps",
    description:
      "We organize free medical camps and awareness drives in underserved communities, delivering essential healthcare support where it is needed most.",
    image:
      "https://images.unsplash.com/photo-1603540879030-cf3ef7505a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    imageAlt: "Healthcare Camp",
    icon: Heart,
    points: [
      "10,000+ beneficiaries served through outreach programs",
      "50+ medical camps conducted in underserved areas",
      "Health awareness sessions on hygiene and preventive care",
      "Partnership with healthcare professionals and volunteers",
    ],
    cta: {
      label: "Contact",
      to: "/partner-with-us",
    },
    sectionClassName: "bg-[#f7fdf8]",
    reverse: true,
  },
  {
    title: "Community Development Programs",
    description:
      "Empowering rural communities through sustainable livelihoods, entrepreneurship support, and holistic local development.",
    image:
      "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    imageAlt: "Community Development",
    icon: Users,
    points: [
      "Rural livelihood support through practical skill training",
      "Women empowerment and entrepreneurship initiatives",
      "Infrastructure support for education, water, and community needs",
      "Long-term engagement with measurable social outcomes",
    ],
    cta: {
      label: "Contact",
      to: "/partner-with-us",
    },
    sectionClassName: "",
    reverse: false,
  },
];

const specialPrograms = [
  {
    icon: Flame,
    title: "Fire & Safety Awareness",
    desc: "Comprehensive fire safety training and awareness programs for industries, schools, and communities.",
  },
  {
    icon: Shield,
    title: "Disaster Management",
    desc: "Preparedness, response, and recovery training to build resilient communities capable of handling emergencies.",
  },
  {
    icon: BookOpen,
    title: "CSR Collaborative Programs",
    desc: "Partnership initiatives with corporate entities aligned to measurable and high-impact community goals.",
  },
];

export default function Programs() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [programSections, setProgramSections] = useState(
    programSectionsFallback,
  );

  useEffect(() => {
    const loadPrograms = async () => {
      if (!databases || !config.databaseId || !config.collections.programs) {
        return;
      }

      try {
        const result = await databases.listDocuments(
          config.databaseId,
          config.collections.programs,
          [Query.orderDesc("$createdAt"), Query.limit(100)],
        );

        const icons = [GraduationCap, Heart, Users];

        const mapped = result.documents
          .map((doc, index) => {
            const rawPoints = Array.isArray(doc.importantPoints)
              ? doc.importantPoints
              : typeof doc.importantPoints === "string"
                ? doc.importantPoints.split(/\n|,/)
                : [];

            const points = rawPoints
              .filter((item) => typeof item === "string")
              .map((item) => item.trim())
              .filter(Boolean);

            return {
              title: typeof doc.title === "string" ? doc.title : "",
              description: typeof doc.mainText === "string" ? doc.mainText : "",
              image: typeof doc.image === "string" ? doc.image : "",
              imageAlt:
                typeof doc.title === "string" && doc.title.trim()
                  ? doc.title
                  : "Program",
              icon: icons[index % icons.length],
              points,
              cta: {
                label: "Contact",
                to: "/partner-with-us",
              },
              sectionClassName: index % 2 === 1 ? "bg-[#f7fdf8]" : "",
              reverse: index % 2 === 1,
            };
          })
          .filter(
            (item) =>
              item.title &&
              item.description &&
              item.image &&
              item.points.length,
          );

        if (mapped.length) {
          setProgramSections(mapped);
        }
      } catch {
        // keep fallback
      }
    };

    loadPrograms();
  }, [config.collections.programs, config.databaseId, databases]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] w-full items-center md:min-h-[62vh] xl:min-h-[66vh]">
          <img
            src="https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
            alt="Training program"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d66]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Our Programs
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Skills, Health & Community
              <br />
              <span className="text-[#d1fae5]">Transformation at Scale</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Comprehensive initiatives designed to empower communities and
              create lasting impact through education, healthcare and
              sustainable development.
            </p>
          </div>
        </div>
      </section>

      {programSections.map((program) => (
        <ProgramSection
          key={program.title}
          title={program.title}
          description={program.description}
          image={program.image}
          imageAlt={program.imageAlt}
          points={program.points}
          cta={program.cta}
          Icon={program.icon}
          reverse={program.reverse}
          sectionClassName={program.sectionClassName}
        />
      ))}

      <section className="bg-[#f0fdf4] py-16 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Special Programs & Initiatives
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Targeted interventions addressing safety, preparedness, and
              partnership-driven social impact.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.title}
                  className="rounded-3xl border border-[#63c37a1f] bg-white p-7 shadow-[0_6px_24px_rgba(17,24,39,0.08)]"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#63c37a1a] text-[#63c37a]">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                    {program.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f6879]">
                    {program.desc}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button to="/partner-with-us" size="sm">
                      Contact →
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#63c37a] py-16 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 text-center md:px-8 lg:px-10">
          <h2 className="font-serif text-4xl font-bold text-white md:text-6xl">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-white/90 md:text-xl">
            Join our programs as a participant, volunteer, or partner
            organization. Together, we can create lasting change in communities
            across India.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button to="/get-involved" variant="secondary" size="lg">
              Get Involved
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#1d2238]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
