// Idempotent schema migration for full About-page editability.
// Creates `about_page` (singleton: hero/stats/headings/badge/vision images/core
// values) and `team_members` (the leadership list). Safe to re-run.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/migrate-about.mjs

import { readFileSync } from "node:fs";
import { Client, Databases, Permission, Role } from "node-appwrite";

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

const ok = (l) => console.log(`  ✓ ${l}`);
const skip = (l) => console.log(`  · ${l} (exists)`);
const isConflict = (e) => e?.code === 409 || /already exists/i.test(e?.message || "");

async function str(colId, key, size, { array = false } = {}) {
  try {
    await db.createStringAttribute(DB, colId, key, size, false, undefined, array);
    ok(`${colId}.${key}`);
  } catch (e) {
    if (isConflict(e)) skip(`${colId}.${key}`);
    else throw e;
  }
}
async function integer(colId, key) {
  try {
    await db.createIntegerAttribute(DB, colId, key, false);
    ok(`${colId}.${key}`);
  } catch (e) {
    if (isConflict(e)) skip(`${colId}.${key}`);
    else throw e;
  }
}
async function ensureCollection(id, name, perms) {
  try {
    await db.createCollection(DB, id, name, perms, false, true);
    ok(`collection ${id}`);
  } catch (e) {
    if (isConflict(e)) skip(`collection ${id}`);
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

const TEXT = 30000; // forces off-row TEXT storage

const run = async () => {
  const perms = await publicPermissions();

  console.log("\n[1/2] about_page — singleton");
  await ensureCollection("about_page", "About Page Content", perms);
  await str("about_page", "heroEyebrow", 120);
  await str("about_page", "heroTitleTop", 255);
  await str("about_page", "heroTitleBottom", 255);
  await str("about_page", "heroSubtitle", TEXT);
  await str("about_page", "heroImage", 1000);
  await str("about_page", "statNumbers", 50, { array: true });
  await str("about_page", "statLabels", 150, { array: true });
  await str("about_page", "storyEyebrow", 120);
  await str("about_page", "storyHeading", 200);
  await str("about_page", "storyBadgeLabel", 120);
  await str("about_page", "storyBadgeValue", 60);
  await str("about_page", "missionEyebrow", 120);
  await str("about_page", "missionHeading", 200);
  await str("about_page", "visionEyebrow", 120);
  await str("about_page", "visionHeading", 200);
  await str("about_page", "visionImages", 1000, { array: true });
  await str("about_page", "valuesEyebrow", 120);
  await str("about_page", "valuesHeading", 200);
  await str("about_page", "valuesSubtitle", TEXT);
  await str("about_page", "coreValues", TEXT); // JSON [{icon,title,desc}]
  await str("about_page", "teamEyebrow", 120);
  await str("about_page", "teamHeading", 200);
  await str("about_page", "teamSubtitle", TEXT);

  console.log("\n[2/2] team_members — collection");
  await ensureCollection("team_members", "Team Members", perms);
  await str("team_members", "name", 255);
  await str("team_members", "role", 255);
  await str("team_members", "designation", 1000);
  await str("team_members", "image", 1000);
  await integer("team_members", "sortOrder");

  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nMigration failed:", e.message);
  process.exit(1);
});
