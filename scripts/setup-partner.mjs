// Full Partner-With-Us editability + data-model fix. Idempotent. Safe to re-run.
//
// Creates two collections:
//   donation_tiers — the donation cards (was wrongly stored in the volunteer
//                    responses table partner_with_us_table)
//   partner_page   — singleton page content (hero, section headings, volunteer
//                    roles, partners list, CTA)
// And repairs partner_with_us_table by making the misplaced donation* attributes
// OPTIONAL so new volunteer submissions (which don't send them) stop failing.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/setup-partner.mjs

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

const ok = (l) => console.log(`  ✓ ${l}`);
const skip = (l) => console.log(`  · ${l} (exists)`);
const warn = (l) => console.log(`  ! ${l}`);
const isConflict = (e) => e?.code === 409 || /already exists/i.test(e?.message || "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TEXT = 30000; // forces off-row TEXT storage, dodges the row-size limit

async function str(colId, key, size, { array = false } = {}) {
  try {
    await db.createStringAttribute(DB, colId, key, size, false, undefined, array);
    ok(`${colId}.${key}`);
  } catch (e) {
    if (isConflict(e)) skip(`${colId}.${key}`);
    else throw e;
  }
}
async function float(colId, key) {
  try {
    await db.createFloatAttribute(DB, colId, key, false);
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
async function boolean(colId, key) {
  try {
    await db.createBooleanAttribute(DB, colId, key, false);
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
async function waitForAttributes(colId, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const attrs = await db.listAttributes(DB, colId);
    if (attrs.attributes.every((a) => a.status === "available")) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for ${colId} attributes.`);
}

const TIERS = [
  {
    donationTitle: "Training Support",
    donationPrice: 1000,
    description: "Support training materials",
    donationBenefits: ["Study materials for 5 students", "Basic training equipment", "Digital resources access"],
    best: false,
    sortOrder: 1,
  },
  {
    donationTitle: "Sponsor a Student",
    donationPrice: 5000,
    description: "Complete training sponsorship",
    donationBenefits: ["Full course materials", "Practical sessions", "Placement assistance", "Certificate issuance"],
    best: true,
    sortOrder: 2,
  },
  {
    donationTitle: "Skill Development Batch",
    donationPrice: 25000,
    description: "Sponsor an entire training batch",
    donationBenefits: ["Training for 20 students", "Complete course duration", "Job placement support", "Success tracking"],
    best: false,
    sortOrder: 3,
  },
  {
    donationTitle: "Community Project",
    donationPrice: 100000,
    description: "Fund a complete initiative",
    donationBenefits: ["Healthcare camp for 500+ people", "Infrastructure development", "Sustainable impact", "Progress reporting"],
    best: false,
    sortOrder: 4,
  },
];

const PARTNER_PAGE = {
  heroEyebrow: "Partner With Us",
  heroHeading: "Be Part of the Change",
  heroSubtitle:
    "Support our mission through donations, volunteering, and strategic partnerships that transform lives.",
  heroImage:
    "https://images.unsplash.com/photo-1728584388081-819a78aa30ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  donateEyebrow: "Support Our Mission",
  donateHeading: "Choose Your Impact",
  donateSubtitle:
    "Your donation directly creates opportunities in skills, healthcare, and livelihood development.",
  volunteerEyebrow: "Volunteer With Us",
  volunteerHeading: "Become a Volunteer",
  volunteerIntro:
    "Join our passionate team making a measurable difference in communities. Whether you have a few hours a week or can support long-term, there is a role for you.",
  volunteerRoles: JSON.stringify([
    { title: "Training Assistants", desc: "Help facilitate workshops and provide mentorship to students." },
    { title: "Community Coordinators", desc: "Assist in organizing field activities and healthcare camps." },
    { title: "Administrative Support", desc: "Support documentation, communication, and coordination." },
  ]),
  formHeading: "Volunteer Application",
  partnersEyebrow: "Our Network",
  partnersHeading: "Partners & Sponsors",
  partnersSubtitle:
    "We collaborate with leading organizations to maximize impact and scale social outcomes.",
  partnersList: ["Industry Partners", "CSR Foundations", "Educational Institutions", "Government Bodies"],
  ctaHeading: "Interested in Partnership?",
  ctaText:
    "Join us as a corporate partner, CSR sponsor, or collaborating organization. Let's create meaningful impact together.",
  ctaButtonLabel: "Discuss Partnership",
  ctaButtonHref: "/contact",
};

const run = async () => {
  const perms = await publicPermissions();

  // ── 1. donation_tiers ────────────────────────────────────────────────
  console.log("\n[1/3] donation_tiers — collection");
  await ensureCollection("donation_tiers", "Donation Tiers", perms);
  await str("donation_tiers", "donationTitle", 255);
  await float("donation_tiers", "donationPrice");
  await str("donation_tiers", "donationBenefits", 500, { array: true });
  await str("donation_tiers", "description", 500);
  await boolean("donation_tiers", "best");
  await integer("donation_tiers", "sortOrder");

  // ── 2. partner_page singleton ────────────────────────────────────────
  console.log("\n[2/3] partner_page — singleton");
  await ensureCollection("partner_page", "Partner Page Content", perms);
  await str("partner_page", "heroEyebrow", 120);
  await str("partner_page", "heroHeading", 255);
  await str("partner_page", "heroSubtitle", TEXT);
  await str("partner_page", "heroImage", 1000);
  await str("partner_page", "donateEyebrow", 120);
  await str("partner_page", "donateHeading", 255);
  await str("partner_page", "donateSubtitle", TEXT);
  await str("partner_page", "volunteerEyebrow", 120);
  await str("partner_page", "volunteerHeading", 255);
  await str("partner_page", "volunteerIntro", TEXT);
  await str("partner_page", "volunteerRoles", TEXT); // JSON [{title,desc}]
  await str("partner_page", "formHeading", 200);
  await str("partner_page", "partnersEyebrow", 120);
  await str("partner_page", "partnersHeading", 255);
  await str("partner_page", "partnersSubtitle", TEXT);
  await str("partner_page", "partnersList", 200, { array: true });
  await str("partner_page", "ctaHeading", 255);
  await str("partner_page", "ctaText", TEXT);
  await str("partner_page", "ctaButtonLabel", 120);
  await str("partner_page", "ctaButtonHref", 500);

  console.log("\nWaiting for attributes to be available…");
  await waitForAttributes("donation_tiers");
  await waitForAttributes("partner_page");

  // Seed donation tiers (only if empty)
  const tierDocs = await db.listDocuments(DB, "donation_tiers");
  if (tierDocs.total === 0) {
    for (const t of TIERS) {
      await db.createDocument(DB, "donation_tiers", ID.unique(), t);
      ok(`tier "${t.donationTitle}"`);
    }
  } else {
    skip("donation_tiers already seeded");
  }

  // Seed partner_page (only if empty)
  const pageDocs = await db.listDocuments(DB, "partner_page");
  if (pageDocs.total === 0) {
    await db.createDocument(DB, "partner_page", ID.unique(), PARTNER_PAGE);
    ok("seeded partner_page");
  } else {
    skip("partner_page already seeded");
  }

  // ── 3. Repair partner_with_us_table: donation* attrs → optional ───────
  console.log("\n[3/3] partner_with_us_table — make misplaced donation* fields optional");
  try {
    await db.updateStringAttribute(DB, "partner_with_us_table", "donationTitle", false, null);
    ok("donationTitle → optional");
  } catch (e) {
    warn(`donationTitle: ${e.message}`);
  }
  try {
    await db.updateFloatAttribute(DB, "partner_with_us_table", "donationPrice", false, null, null, null);
    ok("donationPrice → optional");
  } catch (e) {
    warn(`donationPrice: ${e.message}`);
  }
  try {
    await db.updateBooleanAttribute(DB, "partner_with_us_table", "best", false, null);
    ok("best → optional");
  } catch (e) {
    warn(`best: ${e.message}`);
  }

  console.log("\nDone.\n");
};

run().catch((e) => {
  console.error("\nFailed:", e.message);
  process.exit(1);
});
