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
