// Backfills the Events & Updates collection with the items the landing page used
// to hardcode, and corrects the Get In Touch CTA text on site_settings so the
// admin and the live page show the same content.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/sync-events-getintouch.mjs

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
const EVENTS = env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_EVENTS_UPDATES_ID || "home_events_and_updates_";
const SETTINGS = env.NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS_ID || "site_settings";

const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(apiKey);
const db = new Databases(client);

// Mirrors the former hardcoded fallbackLatestArticles. Collection fields are
// title / image / text.
const EVENTS_SEED = [
  {
    title: "Youth Skill Development Workshop Successfully Conducted",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    text: "Hands-on sessions helped students gain practical knowledge for career readiness and employment opportunities.",
  },
  {
    title: "CSR Partnership Discussion with Industry Leaders",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    text: "Corporate and industry partners joined us to design high-impact CSR projects for youth empowerment.",
  },
  {
    title: "Community Development and Education Awareness Event",
    image:
      "https://images.unsplash.com/photo-1605106702734-205df224ecce?auto=format&fit=crop&w=1200&q=80",
    text: "Our volunteers and trainers organized awareness activities to support education and social welfare in local communities.",
  },
];

const run = async () => {
  // 1) Events — seed only if the collection is empty.
  const existing = await db.listDocuments(DB, EVENTS);
  if (existing.total === 0) {
    for (const e of EVENTS_SEED) {
      await db.createDocument(DB, EVENTS, ID.unique(), e);
    }
    console.log(`  ✓ seeded ${EVENTS_SEED.length} events into ${EVENTS}`);
  } else {
    console.log(`  · ${EVENTS} already has ${existing.total} doc(s) — skipped`);
  }

  // 2) Get In Touch — correct the CTA text on the existing site_settings doc.
  const settings = await db.listDocuments(DB, SETTINGS);
  const doc = settings.documents?.[0];
  if (doc) {
    await db.updateDocument(DB, SETTINGS, doc.$id, {
      getInTouchHeading: "Ready to Change a Life?",
      getInTouchText:
        "Every contribution, partnership, or volunteer hour helps us reach more youth, deliver better training, and build stronger communities across India.",
    });
    console.log("  ✓ updated Get In Touch heading/text on site_settings");
  } else {
    console.log("  ! no site_settings document found");
  }

  console.log("\nSync complete.\n");
};

run().catch((e) => {
  console.error("\nSync failed:", e.message);
  process.exit(1);
});
