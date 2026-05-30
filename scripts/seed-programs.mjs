// Seeds programs_content with the values the Programs page used to hardcode.
// Idempotent: skips if the collection already has a document.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/seed-programs.mjs

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
async function waitForAttributes(colId, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const attrs = await db.listAttributes(DB, colId);
    if (attrs.attributes.every((a) => a.status === "available")) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for ${colId}.`);
}

const PROGRAMS_CONTENT = {
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
  specialPrograms: JSON.stringify([
    { icon: "Flame", title: "Fire & Safety Awareness", desc: "Comprehensive fire safety training and awareness programs for industries, schools, and communities." },
    { icon: "Shield", title: "Disaster Management", desc: "Preparedness, response, and recovery training to build resilient communities capable of handling emergencies." },
    { icon: "BookOpen", title: "CSR Collaborative Programs", desc: "Partnership initiatives with corporate entities aligned to measurable and high-impact community goals." },
  ]),
  ctaHeading: "Ready to Make a Difference?",
  ctaSubtitle:
    "Join our programs as a participant, volunteer, or partner organization. Together, we can create lasting change in communities across India.",
  ctaPrimaryLabel: "Get Involved",
  ctaPrimaryHref: "/get-involved",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryHref: "/contact",
};

const run = async () => {
  console.log("\nWaiting for attributes…");
  await waitForAttributes("programs_content");
  console.log("Ready.\n");

  const existing = await db.listDocuments(DB, "programs_content");
  if (existing.total === 0) {
    await db.createDocument(DB, "programs_content", ID.unique(), PROGRAMS_CONTENT);
    console.log("  ✓ seeded programs_content");
  } else {
    console.log("  · programs_content already has content — skipped");
  }
  console.log("\nSeeding complete.\n");
};

run().catch((e) => {
  console.error("\nSeeding failed:", e.message);
  process.exit(1);
});
