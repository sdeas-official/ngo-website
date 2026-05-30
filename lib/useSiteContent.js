"use client";

import { useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import { createDatabasesClient } from "./appwriteClient";

// Public-site content hooks. They read the Appwrite singletons and fall back to
// the values the site used to hardcode, so the page renders identically even when
// a field is empty or Appwrite is unreachable.

function mergeDefined(defaults, incoming) {
  const out = { ...defaults };
  if (!incoming) return out;
  for (const [key, value] of Object.entries(incoming)) {
    const empty =
      value == null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    if (!empty) out[key] = value;
  }
  return out;
}

function parse(value, fallback) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export const HOME_DEFAULTS = {
  HeroImage: "/Gemini_Generated_Image_qxe6jxqxe6jxqxe6.png",
  heroTitleTop: "Empowering Youth...",
  heroTitleBottom: "Empowering Nation",
  heroSubtitle:
    "SDEAS Welfare Foundation is a non-profit organization dedicated to empowering youth through skill development, education, and community development initiatives.",
  heroCtaLabel: "DONATE NOW",
  heroCtaHref: "/partner-with-us",
  heroStatNumbers: ["4,000+", "50+", "5+"],
  heroStatLabels: ["Youth Trained", "Programs Run", "Years of Impact"],
  missionEyebrow: "About Us",
  missionHeading: "Our Mission",
  AboutUsText:
    "SDEAS Welfare Foundation is committed to developing and empowering youth through skill development, industrial training, and community programs. We collaborate with industries and CSR initiatives to create practical career opportunities.",
  AboutUsImage: "/aboutus.jpeg",
  missionCtaLabel: "LEARN MORE",
  missionCtaHref: "/about",
  visionEyebrow: "What We Do",
  visionHeading: "Our Vision",
  OurVisionText:
    "To create a society where every young individual has access to skill development, education, and employment opportunities, enabling them to become self-reliant and responsible citizens.",
  OurMissionImageOne: "/flag2.jpeg",
  OurMissionImageTwo: "/last boiler.jpeg",
  OurMissionImageThree: "/ok.jpeg",
  visionCtaLabel: "LEARN MORE",
  visionCtaHref: "/about",
  csrEyebrow: "CSR Partnership",
  csrHeading: "Partner With Us for Social Impact",
  csrText:
    "SDEAS Welfare Foundation actively collaborates with industries and corporate organizations to implement CSR initiatives focused on skill development, youth empowerment, and community development.",
  csrCtaLabel: "PARTNER NOW",
  csrCtaHref: "/partner-with-us",
  csrVideo: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
};

export function useHomeContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(HOME_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId) return;
    let mounted = true;

    const fetchNewest = async (collectionId) => {
      if (!collectionId) return {};
      try {
        const res = await databases.listDocuments(config.databaseId, collectionId, [
          Query.orderDesc("$createdAt"),
          Query.limit(1),
        ]);
        return res.documents?.[0] || {};
      } catch {
        return {};
      }
    };

    (async () => {
      const [home, landing, homeTwo] = await Promise.all([
        fetchNewest(config.collections.home),
        fetchNewest(config.collections.homeLanding),
        fetchNewest(config.collections.homeTwo),
      ]);
      if (!mounted) return;
      setContent(mergeDefined(HOME_DEFAULTS, { ...home, ...homeTwo, ...landing }));
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return content;
}

export const SITE_DEFAULTS = {
  brandName: "SDEAS Welfare Foundation",
  logo: "/NGO LOGO.png",
  navItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Partner With Us", href: "/partner-with-us" },
    { label: "Members", href: "/members" },
    { label: "Contact", href: "/contact" },
  ],
  footerAbout:
    "SDEAS Welfare Foundation empowers youth through skill development, education, and community initiatives across Odisha and beyond.",
  footerColumns: [],
  socialLinks: { facebook: "#", twitter: "#", youtube: "#", linkedin: "#" },
  contactEmail: "info@sdeasfoundation.org",
  contactPhone: "+91 93486 29818",
  contactAddress: "Rourkela, Odisha, India",
  getInTouchHeading: "Get In Touch",
  getInTouchText:
    "Have a question or want to collaborate? Reach out and our team will get back to you.",
  copyright: "©2026 SDEAS Welfare Foundation. All Rights Reserved.",
};

export function useSiteSettings() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [settings, setSettings] = useState(SITE_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.siteSettings) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.siteSettings,
          [Query.orderDesc("$createdAt"), Query.limit(1)],
        );
        const doc = res.documents?.[0];
        if (!doc || !mounted) return;
        setSettings(
          mergeDefined(SITE_DEFAULTS, {
            ...doc,
            navItems: parse(doc.navItems, SITE_DEFAULTS.navItems),
            footerColumns: parse(doc.footerColumns, SITE_DEFAULTS.footerColumns),
            socialLinks: parse(doc.socialLinks, SITE_DEFAULTS.socialLinks),
          }),
        );
      } catch {
        // keep defaults
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return settings;
}

export const ABOUT_DEFAULTS = {
  heroEyebrow: "About Us",
  heroTitleTop: "Empowering Youth,",
  heroTitleBottom: "Building a Nation",
  heroSubtitle:
    "Transforming lives through skill development, education, and community empowerment across India.",
  heroImage:
    "https://images.unsplash.com/photo-1670299160449-58cccb9545ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  statNumbers: ["4,000+", "99%", "50+", "10+"],
  statLabels: ["Youth Trained", "Placement Rate", "Industry Partners", "Years of Impact"],
  storyEyebrow: "Who We Are",
  storyHeading: "Our Story",
  storyBadgeLabel: "Placement Rate",
  storyBadgeValue: "99%",
  OurStoryText:
    "SDEAS Welfare Foundation was founded with a clear vision: to bridge the critical gap between education and employment opportunities for youth in rural and underserved communities across India.\nWe recognized that many young people have potential and ambition but lack access to industry-relevant skills. Through strategic partnerships with leading industries, we developed training programs that align with real market demands.\nOur flagship Industrial Boiler Operation program has achieved an exceptional 99% placement rate, transforming the lives of over 4,000 students across Eastern India.",
  OurStoryImage:
    "https://images.unsplash.com/photo-1670299160449-58cccb9545ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  missionEyebrow: "Our Purpose",
  missionHeading: "Our Mission",
  OurMissionText:
    "To empower youth and communities through quality education, industry-aligned skill development, and comprehensive social welfare programs. We strive to create self-reliant individuals and thriving communities by providing access to training, healthcare, and livelihood opportunities that transform lives and contribute to nation-building.",
  OurMissionImage:
    "https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  visionEyebrow: "Our Goal",
  visionHeading: "Our Vision",
  OurVisionText:
    "To establish ourselves as a leading force in social transformation across India — creating a future where every youth has access to quality skill development and every community has access to essential healthcare and economic opportunity.\nWe envision an India where empowered communities drive economic growth and social progress, with no one left behind.",
  visionImages: [
    "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517739277509-06f1c761b6a9?auto=format&fit=crop&w=800&q=80",
  ],
  valuesEyebrow: "What We Stand For",
  valuesHeading: "Our Core Values",
  valuesSubtitle:
    "The principles that guide every decision and action we take in service of our communities.",
  coreValues: [
    { icon: "👥", title: "Community First", desc: "We prioritize the needs and aspirations of the communities we serve in everything we do." },
    { icon: "🎯", title: "Excellence", desc: "We are committed to delivering high-quality programs and measurable, lasting impact." },
    { icon: "🔍", title: "Transparency", desc: "We operate with integrity and accountability in all our activities and partnerships." },
    { icon: "🌱", title: "Sustainability", desc: "We create lasting solutions that empower communities for long-term success and growth." },
  ],
  teamEyebrow: "The People",
  teamHeading: "Our Leadership",
  teamSubtitle:
    "Dedicated professionals committed to driving social change and community empowerment.",
};

// Reads the About page content (about_us_page + about_page) and the team list,
// each merged over the former hardcoded defaults.
export function useAboutContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(ABOUT_DEFAULTS);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (!databases || !config.databaseId) return;
    let mounted = true;

    const fetchNewest = async (collectionId) => {
      if (!collectionId) return {};
      try {
        const res = await databases.listDocuments(config.databaseId, collectionId, [
          Query.orderDesc("$createdAt"),
          Query.limit(1),
        ]);
        return res.documents?.[0] || {};
      } catch {
        return {};
      }
    };

    (async () => {
      const [aboutDoc, aboutPageDoc] = await Promise.all([
        fetchNewest(config.collections.about),
        fetchNewest(config.collections.aboutPage),
      ]);
      if (!mounted) return;

      const merged = mergeDefined(ABOUT_DEFAULTS, {
        ...aboutDoc,
        ...aboutPageDoc,
        coreValues: parse(aboutPageDoc.coreValues, ABOUT_DEFAULTS.coreValues),
      });
      setContent(merged);

      // Team members
      try {
        if (config.collections.teamMembers) {
          const res = await databases.listDocuments(
            config.databaseId,
            config.collections.teamMembers,
            [Query.limit(50)],
          );
          if (!mounted) return;
          const members = (res.documents || [])
            .map((d) => ({
              name: typeof d.name === "string" ? d.name : "",
              role: typeof d.role === "string" ? d.role : "",
              designation: typeof d.designation === "string" ? d.designation : "",
              image: typeof d.image === "string" ? d.image : "",
              sortOrder: typeof d.sortOrder === "number" ? d.sortOrder : 0,
            }))
            .filter((m) => m.name)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          setTeam(members);
        }
      } catch {
        setTeam(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return { content, team };
}

export const PROGRAMS_DEFAULTS = {
  heroEyebrow: "Our Programs",
  heroTitleTop: "Skills, Health & Community",
  heroTitleBottom: "Transformation at Scale",
  heroSubtitle:
    "Comprehensive initiatives designed to empower communities and create lasting impact through education, healthcare and sustainable development.",
  heroImage:
    "https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  specialHeading: "Special Programs & Initiatives",
  specialSubtitle:
    "Targeted interventions addressing safety, preparedness, and partnership-driven social impact.",
  specialPrograms: [
    { icon: "Flame", title: "Fire & Safety Awareness", desc: "Comprehensive fire safety training and awareness programs for industries, schools, and communities." },
    { icon: "Shield", title: "Disaster Management", desc: "Preparedness, response, and recovery training to build resilient communities capable of handling emergencies." },
    { icon: "BookOpen", title: "CSR Collaborative Programs", desc: "Partnership initiatives with corporate entities aligned to measurable and high-impact community goals." },
  ],
  ctaHeading: "Ready to Make a Difference?",
  ctaSubtitle:
    "Join our programs as a participant, volunteer, or partner organization. Together, we can create lasting change in communities across India.",
  ctaPrimaryLabel: "Get Involved",
  ctaPrimaryHref: "/get-involved",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};

// Reads the Programs page chrome (hero, special-programs grid, CTA) from the
// programs_content singleton, merged over the former hardcoded defaults.
export function useProgramsContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(PROGRAMS_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.programsContent) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.programsContent,
          [Query.orderDesc("$createdAt"), Query.limit(1)],
        );
        const doc = res.documents?.[0];
        if (!doc || !mounted) return;
        setContent(
          mergeDefined(PROGRAMS_DEFAULTS, {
            ...doc,
            specialPrograms: parse(doc.specialPrograms, PROGRAMS_DEFAULTS.specialPrograms),
          }),
        );
      } catch {
        // keep defaults
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return content;
}

export const BLOG_PAGE_DEFAULTS = {
  heroEyebrow: "Blog & News",
  heroHeading: "Stories of Growth & Impact",
  heroSubtitle:
    "Stay updated with our latest programs, success stories, and community impact.",
  heroImage:
    "https://images.unsplash.com/photo-1758599667729-a6f0f8bd213b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  featuredLabel: "Featured Story",
  recentEyebrow: "Recent Updates",
  recentHeading: "Latest Articles",
  recentSubtitle: "Explore our latest news, program updates, and impact stories.",
};

// Reads the Blog page chrome (hero + section headings) from blog_content,
// merged over the former hardcoded defaults.
export function useBlogContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(BLOG_PAGE_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.blogContent) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.blogContent,
          [Query.orderDesc("$createdAt"), Query.limit(1)],
        );
        const doc = res.documents?.[0];
        if (!doc || !mounted) return;
        setContent(mergeDefined(BLOG_PAGE_DEFAULTS, doc));
      } catch {
        // keep defaults
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return content;
}

export function useOngoingProjects() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.ongoingProjects) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.ongoingProjects,
          [Query.limit(50)],
        );
        if (!mounted) return;
        const docs = (res.documents || [])
          .map((d) => ({
            title: typeof d.title === "string" ? d.title : "",
            location: typeof d.location === "string" ? d.location : "",
            image: typeof d.image === "string" ? d.image : "",
            description: typeof d.description === "string" ? d.description : "",
            sortOrder: typeof d.sortOrder === "number" ? d.sortOrder : 0,
          }))
          .filter((p) => p.title || p.image)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setProjects(docs);
      } catch {
        setProjects(null); // null → caller uses its own fallback
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return projects;
}

export const GALLERY_DEFAULTS = {
  heroEyebrow: "Media Gallery",
  heroHeading: "Moments of Impact",
  heroSubtitle:
    "Capturing transformation, learning, and community empowerment through our initiatives.",
  heroImage:
    "https://images.unsplash.com/photo-1758599667729-a6f0f8bd213b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  photoEyebrow: "Photo Gallery",
  photoHeading: "Explore Our Work",
  photoSubtitle:
    "Browse events, training sessions, field activities, and success stories.",
  videoEyebrow: "Video Gallery",
  videoHeading: "Stories in Motion",
  videoSubtitle:
    "Training highlights, testimonials, and community impact snapshots.",
  videos: [
    { title: "Industrial Training Program Overview", desc: "A glimpse into our practical training methodology and student experience." },
    { title: "Student Testimonials", desc: "Real stories from learners whose lives were transformed through our programs." },
  ],
};

// Reads the Gallery page chrome (hero, photo & video section headings, video
// cards) from the gallery_content singleton, merged over the former defaults.
export function useGalleryContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(GALLERY_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.galleryContent) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.galleryContent,
          [Query.orderDesc("$createdAt"), Query.limit(1)],
        );
        const doc = res.documents?.[0];
        if (!doc || !mounted) return;
        setContent(
          mergeDefined(GALLERY_DEFAULTS, {
            ...doc,
            videos: parse(doc.videos, GALLERY_DEFAULTS.videos),
          }),
        );
      } catch {
        // keep defaults
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return content;
}

export const PARTNER_DEFAULTS = {
  heroEyebrow: "Partner With Us",
  heroHeading: "Be Part of the Change",
  heroSubtitle:
    "Support our mission through donations, volunteering, and strategic partnerships that transform lives.",
  heroImage:
    "https://images.unsplash.com/photo-1728584388081-819a78aa30ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  donateEyebrow: "Support Our Mission",
  donateHeading: "Choose Your Impact",
  donateSubtitle:
    "Your donation directly creates opportunities in skills, healthcare, and livelihood development.",
  volunteerEyebrow: "Volunteer With Us",
  volunteerHeading: "Become a Volunteer",
  volunteerIntro:
    "Join our passionate team making a measurable difference in communities. Whether you have a few hours a week or can support long-term, there is a role for you.",
  volunteerRoles: [
    { title: "Training Assistants", desc: "Help facilitate workshops and provide mentorship to students." },
    { title: "Community Coordinators", desc: "Assist in organizing field activities and healthcare camps." },
    { title: "Administrative Support", desc: "Support documentation, communication, and coordination." },
  ],
  formHeading: "Volunteer Application",
  partnersEyebrow: "Our Network",
  partnersHeading: "Partners & Sponsors",
  partnersSubtitle:
    "We collaborate with leading organizations to maximize impact and scale social outcomes.",
  partnersList: ["Industry Partners", "CSR Foundations", "Educational Institutions", "Government Bodies"],
  ctaHeading: "Interested in Partnership?",
  ctaText:
    "Join us as a corporate partner, CSR sponsor, or collaborating organization. Let's create meaningful impact together.",
  ctaButtonLabel: "Discuss Partnership",
  ctaButtonHref: "/contact",
};

// Reads the Partner-With-Us page chrome (hero, section headings, volunteer roles,
// partners list, CTA) from the partner_page singleton, merged over defaults.
export function usePartnerContent() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [content, setContent] = useState(PARTNER_DEFAULTS);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.partnerPage) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.partnerPage,
          [Query.orderDesc("$createdAt"), Query.limit(1)],
        );
        const doc = res.documents?.[0];
        if (!doc || !mounted) return;
        setContent(
          mergeDefined(PARTNER_DEFAULTS, {
            ...doc,
            volunteerRoles: parse(doc.volunteerRoles, PARTNER_DEFAULTS.volunteerRoles),
          }),
        );
      } catch {
        // keep defaults
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return content;
}

// Reads the donation tiers from the donation_tiers collection, sorted. Returns
// null on failure so the caller can fall back to its own hardcoded cards.
export function useDonationTiers() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [tiers, setTiers] = useState(null);

  useEffect(() => {
    if (!databases || !config.databaseId || !config.collections.donationTiers) return;
    let mounted = true;

    (async () => {
      try {
        const res = await databases.listDocuments(
          config.databaseId,
          config.collections.donationTiers,
          [Query.limit(50)],
        );
        if (!mounted) return;
        const docs = (res.documents || [])
          .map((d) => {
            const price = Number(d.donationPrice);
            const benefits = Array.isArray(d.donationBenefits)
              ? d.donationBenefits.filter((b) => typeof b === "string" && b.trim()).map((b) => b.trim())
              : [];
            return {
              title: typeof d.donationTitle === "string" ? d.donationTitle.trim() : "",
              amount: Number.isFinite(price) && price > 0 ? price.toLocaleString("en-IN") : "",
              description: typeof d.description === "string" ? d.description.trim() : "",
              features: benefits.length ? benefits : ["Direct social impact support"],
              highlighted: typeof d.best === "boolean" ? d.best : false,
              sortOrder: typeof d.sortOrder === "number" ? d.sortOrder : 0,
            };
          })
          .filter((t) => t.title && t.amount)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setTiers(docs.length ? docs : null);
      } catch {
        setTiers(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [databases, config]);

  return tiers;
}
