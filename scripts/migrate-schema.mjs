// Idempotent Appwrite schema migration for full landing-page editability.
// Creates new collections (ongoing_projects, site_settings) and adds optional
// attributes to home_page. Safe to re-run: existing attributes/collections are
// skipped (409 conflicts swallowed). All home_page additions are OPTIONAL so
// existing documents remain valid.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/migrate-schema.mjs
//
// NOTE: This only creates SCHEMA. Default content is seeded by seed-content.mjs
// after attributes finish processing.

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

const ok = (label) => console.log(`  ✓ ${label}`);
const skip = (label) => console.log(`  · ${label} (already exists)`);

function isConflict(e) {
  return e?.code === 409 || /already exists/i.test(e?.message || "");
}

async function str(colId, key, size, { required = false, array = false } = {}) {
  try {
    await db.createStringAttribute(DB, colId, key, size, required, undefined, array);
    ok(`${colId}.${key} (string${array ? "[]" : ""})`);
  } catch (e) {
    if (isConflict(e)) skip(`${colId}.${key}`);
    else throw e;
  }
}

async function integer(colId, key, { required = false } = {}) {
  try {
    await db.createIntegerAttribute(DB, colId, key, required);
    ok(`${colId}.${key} (integer)`);
  } catch (e) {
    if (isConflict(e)) skip(`${colId}.${key}`);
    else throw e;
  }
}

// Reuse permissions from an existing collection so new collections behave like
// the rest of the app (public client reads + writes, matching current model).
async function publicPermissions() {
  try {
    const ref = await db.getCollection(DB, "home_our_programs");
    if (ref.$permissions?.length) return ref.$permissions;
  } catch {
    // fall through to a sensible default
  }
  return [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
  ];
}

async function ensureCollection(id, name, permissions) {
  try {
    await db.createCollection(DB, id, name, permissions, false, true);
    ok(`collection ${id}`);
  } catch (e) {
    if (isConflict(e)) skip(`collection ${id}`);
    else throw e;
  }
}

const run = async () => {
  const perms = await publicPermissions();

  // home_page is already at Appwrite's row-size limit, so the new landing
  // scalar fields live in a dedicated singleton collection instead.
  console.log("\n[1/3] home_landing — landing text/CTA/stats (new collection)");
  await ensureCollection("home_landing", "Home Landing Content", perms);
  await str("home_landing", "heroTitleTop", 255);
  await str("home_landing", "heroTitleBottom", 255);
  await str("home_landing", "heroSubtitle", 2000);
  await str("home_landing", "heroCtaLabel", 100);
  await str("home_landing", "heroCtaHref", 255);
  await str("home_landing", "heroStatNumbers", 50, { array: true });
  await str("home_landing", "heroStatLabels", 120, { array: true });
  await str("home_landing", "missionEyebrow", 120);
  await str("home_landing", "missionHeading", 200);
  await str("home_landing", "missionCtaLabel", 100);
  await str("home_landing", "missionCtaHref", 255);
  await str("home_landing", "visionEyebrow", 120);
  await str("home_landing", "visionHeading", 200);
  await str("home_landing", "visionCtaLabel", 100);
  await str("home_landing", "visionCtaHref", 255);
  await str("home_landing", "csrEyebrow", 120);
  await str("home_landing", "csrHeading", 300);
  await str("home_landing", "csrText", 2000);
  await str("home_landing", "csrCtaLabel", 100);
  await str("home_landing", "csrCtaHref", 255);

  console.log("\n[2/3] ongoing_projects — new collection");
  await ensureCollection("ongoing_projects", "Ongoing Projects", perms);
  await str("ongoing_projects", "title", 255);
  await str("ongoing_projects", "location", 255);
  await str("ongoing_projects", "image", 1000);
  await str("ongoing_projects", "description", 2000);
  await integer("ongoing_projects", "sortOrder");

  // Long / JSON fields use size >= 16384 so Appwrite stores them as off-row TEXT,
  // keeping the collection under MariaDB's inline row-size limit. The half-created
  // collection from a prior run is dropped first so sizes are applied cleanly.
  console.log("\n[3/3] site_settings — new singleton collection");
  // Only drop when explicitly resetting (RESET_SITE_SETTINGS=1), so re-runs don't
  // wipe seeded content.
  if (process.env.RESET_SITE_SETTINGS === "1") {
    try {
      await db.deleteCollection(DB, "site_settings");
      console.log("  · dropped existing site_settings to reset attribute sizes");
    } catch {
      // not present yet — fine
    }
  }
  await ensureCollection("site_settings", "Site Settings", perms);
  const TEXT = 60000; // forces off-row TEXT storage
  await str("site_settings", "brandName", 120);
  await str("site_settings", "logo", 1000);
  await str("site_settings", "navItems", TEXT); // JSON [{label,href}]
  await str("site_settings", "footerAbout", TEXT);
  await str("site_settings", "footerColumns", TEXT); // JSON [{title,links:[{label,href}]}]
  await str("site_settings", "socialLinks", TEXT); // JSON {facebook,instagram,...}
  await str("site_settings", "contactEmail", 255);
  await str("site_settings", "contactPhone", 60);
  await str("site_settings", "contactAddress", TEXT);
  await str("site_settings", "getInTouchHeading", 300);
  await str("site_settings", "getInTouchText", TEXT);
  await str("site_settings", "copyright", 500);

  console.log("\nDone. Attributes may take a few seconds to finish processing.\n");
};

run().catch((e) => {
  console.error("\nMigration failed:", e.message);
  process.exit(1);
});
