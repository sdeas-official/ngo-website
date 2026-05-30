// Creates + seeds the `blog_content` singleton (blog page hero + section
// headings). The blog posts themselves stay in the existing `blog_page`
// collection. Idempotent. Run: APPWRITE_API_KEY=xxx node scripts/setup-blog.mjs

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

const run = async () => {
  console.log("\nblog_content — singleton");
  try {
    await db.createCollection(DB, "blog_content", "Blog Page Content", await publicPermissions(), false, true);
    console.log("  ✓ collection blog_content");
  } catch (e) {
    if (isConflict(e)) console.log("  · collection blog_content (exists)");
    else throw e;
  }

  await str("blog_content", "heroEyebrow", 120);
  await str("blog_content", "heroHeading", 255);
  await str("blog_content", "heroSubtitle", 30000);
  await str("blog_content", "heroImage", 1000);
  await str("blog_content", "featuredLabel", 80);
  await str("blog_content", "recentEyebrow", 120);
  await str("blog_content", "recentHeading", 200);
  await str("blog_content", "recentSubtitle", 30000);

  console.log("\nWaiting for attributes…");
  await waitForAttributes("blog_content");

  const existing = await db.listDocuments(DB, "blog_content");
  if (existing.total === 0) {
    await db.createDocument(DB, "blog_content", ID.unique(), SEED);
    console.log("  ✓ seeded blog_content");
  } else {
    console.log("  · blog_content already has content — skipped");
  }
  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nFailed:", e.message);
  process.exit(1);
});
