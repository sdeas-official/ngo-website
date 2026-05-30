// Creates + seeds the `gallery_content` singleton (gallery page hero, photo &
// video section headings, and the video cards). The photos themselves stay in
// the existing `gallery_page` collection. Idempotent.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/setup-gallery.mjs

import { readFileSync } from "node:fs";
import { Client, Databases, ID, Permission, Role } from "node-appwrite";

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

const isConflict = (e) => e?.code === 409 || /already exists/i.test(e?.message || "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TEXT = 30000;

async function str(colId, key, size) {
  try {
    await db.createStringAttribute(DB, colId, key, size, false);
    console.log(`  ✓ ${colId}.${key}`);
  } catch (e) {
    if (isConflict(e)) console.log(`  · ${colId}.${key} (exists)`);
    else throw e;
  }
}
async function publicPermissions() {
  try {
    const ref = await db.getCollection(DB, "home_our_programs");
    if (ref.$permissions?.length) return ref.$permissions;
  } catch {}
  return [Permission.read(Role.any()), Permission.create(Role.any()), Permission.update(Role.any()), Permission.delete(Role.any())];
}
async function waitForAttributes(colId, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const attrs = await db.listAttributes(DB, colId);
    if (attrs.attributes.every((a) => a.status === "available")) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for ${colId}.`);
}

const SEED = {
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
  videos: JSON.stringify([
    { title: "Industrial Training Program Overview", desc: "A glimpse into our practical training methodology and student experience." },
    { title: "Student Testimonials", desc: "Real stories from learners whose lives were transformed through our programs." },
  ]),
};

const run = async () => {
  console.log("\ngallery_content — singleton");
  try {
    await db.createCollection(DB, "gallery_content", "Gallery Page Content", await publicPermissions(), false, true);
    console.log("  ✓ collection gallery_content");
  } catch (e) {
    if (isConflict(e)) console.log("  · collection gallery_content (exists)");
    else throw e;
  }

  await str("gallery_content", "heroEyebrow", 120);
  await str("gallery_content", "heroHeading", 255);
  await str("gallery_content", "heroSubtitle", TEXT);
  await str("gallery_content", "heroImage", 1000);
  await str("gallery_content", "photoEyebrow", 120);
  await str("gallery_content", "photoHeading", 255);
  await str("gallery_content", "photoSubtitle", TEXT);
  await str("gallery_content", "videoEyebrow", 120);
  await str("gallery_content", "videoHeading", 255);
  await str("gallery_content", "videoSubtitle", TEXT);
  await str("gallery_content", "videos", TEXT); // JSON [{title,desc}]

  console.log("\nWaiting for attributes…");
  await waitForAttributes("gallery_content");

  const existing = await db.listDocuments(DB, "gallery_content");
  if (existing.total === 0) {
    await db.createDocument(DB, "gallery_content", ID.unique(), SEED);
    console.log("  ✓ seeded gallery_content");
  } else {
    console.log("  · gallery_content already has content — skipped");
  }
  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nFailed:", e.message);
  process.exit(1);
});
