// Seeds about_page + team_members with the values the About page used to
// hardcode, so the admin starts pre-filled and the live page is unchanged.
// Idempotent: skips a collection that already has documents.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/seed-about.mjs

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
async function isEmpty(colId) {
  return (await db.listDocuments(DB, colId)).total === 0;
}

const ABOUT_PAGE = {
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
  missionEyebrow: "Our Purpose",
  missionHeading: "Our Mission",
  visionEyebrow: "Our Goal",
  visionHeading: "Our Vision",
  visionImages: [
    "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517739277509-06f1c761b6a9?auto=format&fit=crop&w=800&q=80",
  ],
  valuesEyebrow: "What We Stand For",
  valuesHeading: "Our Core Values",
  valuesSubtitle:
    "The principles that guide every decision and action we take in service of our communities.",
  coreValues: JSON.stringify([
    { icon: "👥", title: "Community First", desc: "We prioritize the needs and aspirations of the communities we serve in everything we do." },
    { icon: "🎯", title: "Excellence", desc: "We are committed to delivering high-quality programs and measurable, lasting impact." },
    { icon: "🔍", title: "Transparency", desc: "We operate with integrity and accountability in all our activities and partnerships." },
    { icon: "🌱", title: "Sustainability", desc: "We create lasting solutions that empower communities for long-term success and growth." },
  ]),
  teamEyebrow: "The People",
  teamHeading: "Our Leadership",
  teamSubtitle:
    "Dedicated professionals committed to driving social change and community empowerment.",
};

const TEAM = [
  {
    name: "Mr. Bikash Patra",
    role: "Founder & Director",
    designation: "Assistant Fire Officer, Technical Head",
    image:
      "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sortOrder: 1,
  },
  {
    name: "Program Coordinator",
    role: "Head of Training Programs",
    designation: "Skill Development Specialist",
    image:
      "https://images.unsplash.com/photo-1758873269317-51888e824b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sortOrder: 2,
  },
  {
    name: "Field Coordinator",
    role: "Community Outreach Lead",
    designation: "Rural Development Specialist",
    image:
      "https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    sortOrder: 3,
  },
];

const run = async () => {
  console.log("\nWaiting for attributes…");
  await Promise.all([waitForAttributes("about_page"), waitForAttributes("team_members")]);
  console.log("Ready.\n");

  if (await isEmpty("about_page")) {
    await db.createDocument(DB, "about_page", ID.unique(), ABOUT_PAGE);
    console.log("  ✓ seeded about_page");
  } else {
    console.log("  · about_page already has content — skipped");
  }

  if (await isEmpty("team_members")) {
    for (const m of TEAM) await db.createDocument(DB, "team_members", ID.unique(), m);
    console.log(`  ✓ seeded ${TEAM.length} team_members`);
  } else {
    console.log("  · team_members already has content — skipped");
  }

  console.log("\nSeeding complete.\n");
};

run().catch((e) => {
  console.error("\nSeeding failed:", e.message);
  process.exit(1);
});
