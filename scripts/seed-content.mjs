// Seeds the new collections (home_landing, site_settings, ongoing_projects) with
// the values currently hardcoded on the site, so the admin starts pre-filled and
// the live site looks identical after wiring. Idempotent: skips a collection that
// already has documents. Waits for attributes to finish processing first.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/seed-content.mjs

import { readFileSync } from "node:fs";
import { Client, Databases, ID } from "node-appwrite";

function readEnv() {
  const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

const env = readEnv();
const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) {
  console.error("Missing APPWRITE_API_KEY env var.");
  process.exit(1);
}

const DB = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(apiKey);
const db = new Databases(client);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wait until every attribute of a collection reports status "available".
async function waitForAttributes(colId, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const attrs = await db.listAttributes(DB, colId);
    const pending = attrs.attributes.filter((a) => a.status !== "available");
    if (!pending.length) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for ${colId} attributes to process.`);
}

async function isEmpty(colId) {
  const res = await db.listDocuments(DB, colId);
  return res.total === 0;
}

const HOME_LANDING = {
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
  missionCtaLabel: "LEARN MORE",
  missionCtaHref: "/about",
  visionEyebrow: "What We Do",
  visionHeading: "Our Vision",
  visionCtaLabel: "LEARN MORE",
  visionCtaHref: "/about",
  csrEyebrow: "CSR Partnership",
  csrHeading: "Partner With Us for Social Impact",
  csrText:
    "SDEAS Welfare Foundation actively collaborates with industries and corporate organizations to implement CSR initiatives focused on skill development, youth empowerment, and community development.",
  csrCtaLabel: "PARTNER NOW",
  csrCtaHref: "/partner-with-us",
};

const SITE_SETTINGS = {
  brandName: "SDEAS Welfare Foundation",
  logo: "/NGO LOGO.png",
  navItems: JSON.stringify([
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Partner With Us", href: "/partner-with-us" },
    { label: "Contact", href: "/contact" },
  ]),
  footerAbout:
    "SDEAS Welfare Foundation empowers youth through skill development, education, and community initiatives across Odisha and beyond.",
  footerColumns: JSON.stringify([
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Gallery", href: "/gallery" },
        { label: "Blog", href: "/blog" },
        { label: "Partner With Us", href: "/partner-with-us" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Our Causes",
      links: [
        { label: "Skill Development Training", href: "/programs" },
        { label: "Youth Empowerment Workshops", href: "/programs" },
        { label: "CSR Community Projects", href: "/partner-with-us" },
      ],
    },
  ]),
  socialLinks: JSON.stringify({
    facebook: "#",
    twitter: "#",
    youtube: "#",
    linkedin: "#",
  }),
  contactEmail: "info@sdeasfoundation.org",
  contactPhone: "+91 93486 29818",
  contactAddress: "Rourkela, Odisha, India",
  getInTouchHeading: "Get In Touch",
  getInTouchText:
    "Have a question or want to collaborate? Reach out and our team will get back to you.",
  copyright: "©2026 SDEAS Welfare Foundation. All Rights Reserved.",
};

const ONGOING_PROJECTS = [
  { title: "Skill Development Training for Underprivileged Youth", location: "Rourkela, Odisha", image: "/skill.jpeg", sortOrder: 1 },
  { title: "Industrial Training Program with Industry Mentors", location: "Odisha, India", image: "/proj2.jpeg", sortOrder: 2 },
  { title: "Youth Empowerment Workshops and Career Guidance", location: "Eastern India", image: "/last boiler.jpeg", sortOrder: 3 },
  { title: "CSR Community Development and Education Support", location: "Rural Odisha", image: "/flag4.jpeg", sortOrder: 4 },
];

const run = async () => {
  console.log("\nWaiting for attributes to finish processing…");
  await Promise.all([
    waitForAttributes("home_landing"),
    waitForAttributes("site_settings"),
    waitForAttributes("ongoing_projects"),
  ]);
  console.log("Attributes ready.\n");

  if (await isEmpty("home_landing")) {
    await db.createDocument(DB, "home_landing", ID.unique(), HOME_LANDING);
    console.log("  ✓ seeded home_landing");
  } else {
    console.log("  · home_landing already has content — skipped");
  }

  if (await isEmpty("site_settings")) {
    await db.createDocument(DB, "site_settings", ID.unique(), SITE_SETTINGS);
    console.log("  ✓ seeded site_settings");
  } else {
    console.log("  · site_settings already has content — skipped");
  }

  if (await isEmpty("ongoing_projects")) {
    for (const p of ONGOING_PROJECTS) {
      await db.createDocument(DB, "ongoing_projects", ID.unique(), p);
    }
    console.log(`  ✓ seeded ${ONGOING_PROJECTS.length} ongoing_projects`);
  } else {
    console.log("  · ongoing_projects already has content — skipped");
  }

  console.log("\nSeeding complete.\n");
};

run().catch((e) => {
  console.error("\nSeeding failed:", e.message);
  process.exit(1);
});
