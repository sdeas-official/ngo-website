// Idempotent schema migration for full Programs-page editability.
// Creates `programs_content` (singleton: hero, special-programs grid, bottom CTA).
// The main program blocks already live in the existing `programs_page` collection.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/migrate-programs.mjs

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

async function str(colId, key, size) {
  try {
    await db.createStringAttribute(DB, colId, key, size, false);
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

const TEXT = 30000;

const run = async () => {
  const perms = await publicPermissions();
  console.log("\nprograms_content — singleton");
  await ensureCollection("programs_content", "Programs Page Content", perms);
  await str("programs_content", "heroEyebrow", 120);
  await str("programs_content", "heroTitleTop", 255);
  await str("programs_content", "heroTitleBottom", 255);
  await str("programs_content", "heroSubtitle", TEXT);
  await str("programs_content", "heroImage", 1000);
  await str("programs_content", "specialHeading", 200);
  await str("programs_content", "specialSubtitle", TEXT);
  await str("programs_content", "specialPrograms", TEXT); // JSON [{icon,title,desc}]
  await str("programs_content", "ctaHeading", 200);
  await str("programs_content", "ctaSubtitle", TEXT);
  await str("programs_content", "ctaPrimaryLabel", 100);
  await str("programs_content", "ctaPrimaryHref", 255);
  await str("programs_content", "ctaSecondaryLabel", 100);
  await str("programs_content", "ctaSecondaryHref", 255);
  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nMigration failed:", e.message);
  process.exit(1);
});
