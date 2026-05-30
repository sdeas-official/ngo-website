// Creates + seeds the `contact_page` singleton — the Contact page's own content
// (hero, the "Get In Touch" aside text, office hours, section labels and the map
// block). Email / phone / address / social links are NOT duplicated here: they
// already live in site_settings and the contact page now reads them from there.
// Idempotent. Run: APPWRITE_API_KEY=xxx node scripts/setup-contact.mjs

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
  heroEyebrow: "Contact Us",
  heroHeading: "Let's Build Impact Together",
  heroSubtitle:
    "Have questions about our programs, volunteering, CSR partnerships, or training opportunities? We'd love to hear from you.",
  heroImage:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  asideEyebrow: "Get In Touch",
  asideHeading: "We're Here to Help",
  asideText:
    "Reach out for admissions, partnerships, volunteering, and all other collaboration opportunities.",
  officesTitle: "Our Offices",
  officesAddress: "A-547 Koel Nagar, Rourkela\nB-5 Sector 20, Rourkela\nOdisha, India",
  emailTitle: "Email Us",
  phoneTitle: "Call Us",
  hoursTitle: "Office Hours",
  weekdaysLabel: "Weekdays",
  weekdaysText: "Monday - Friday\n9:00 AM - 6:00 PM",
  weekendsLabel: "Weekends",
  weekendsText: "Saturday: 10:00 AM - 4:00 PM\nClosed on Sundays",
  followLabel: "Follow Us",
  formHeading: "Send us a Message",
  mapEyebrow: "Find Us",
  mapHeading: "Visit Our Office",
  mapAddress: "A-547 Koel Nagar, Rourkela, Odisha",
  mapEmbedUrl: "",
};

const run = async () => {
  console.log("\ncontact_page — singleton");
  try {
    await db.createCollection(DB, "contact_page", "Contact Page Content", await publicPermissions(), false, true);
    console.log("  ✓ collection contact_page");
  } catch (e) {
    if (isConflict(e)) console.log("  · collection contact_page (exists)");
    else throw e;
  }

  await str("contact_page", "heroEyebrow", 120);
  await str("contact_page", "heroHeading", 255);
  await str("contact_page", "heroSubtitle", TEXT);
  await str("contact_page", "heroImage", 1000);
  await str("contact_page", "asideEyebrow", 120);
  await str("contact_page", "asideHeading", 200);
  await str("contact_page", "asideText", TEXT);
  await str("contact_page", "officesTitle", 120);
  await str("contact_page", "officesAddress", TEXT);
  await str("contact_page", "emailTitle", 120);
  await str("contact_page", "phoneTitle", 120);
  await str("contact_page", "hoursTitle", 120);
  await str("contact_page", "weekdaysLabel", 120);
  await str("contact_page", "weekdaysText", TEXT);
  await str("contact_page", "weekendsLabel", 120);
  await str("contact_page", "weekendsText", TEXT);
  await str("contact_page", "followLabel", 120);
  await str("contact_page", "formHeading", 200);
  await str("contact_page", "mapEyebrow", 120);
  await str("contact_page", "mapHeading", 255);
  await str("contact_page", "mapAddress", TEXT);
  await str("contact_page", "mapEmbedUrl", 1000);

  console.log("\nWaiting for attributes…");
  await waitForAttributes("contact_page");

  const existing = await db.listDocuments(DB, "contact_page");
  if (existing.total === 0) {
    await db.createDocument(DB, "contact_page", ID.unique(), SEED);
    console.log("  ✓ seeded contact_page");
  } else {
    console.log("  · contact_page already has content — skipped");
  }
  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nFailed:", e.message);
  process.exit(1);
});
