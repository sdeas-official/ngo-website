// Read-only Appwrite schema inspector.
// Lists every collection in the database and its attributes, so we can see
// exactly what already exists before planning the migration.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/verify-schema.mjs
// (endpoint / project / database are read from .env)

import { readFileSync } from "node:fs";
import { Client, Databases } from "node-appwrite";

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

const databaseId = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(apiKey);

const databases = new Databases(client);

const run = async () => {
  const collections = await databases.listCollections(databaseId);
  console.log(`\nDatabase ${databaseId} — ${collections.total} collection(s)\n`);

  for (const col of collections.collections) {
    console.log(`\n=== ${col.name}  [id: ${col.$id}]`);
    try {
      const attrs = await databases.listAttributes(databaseId, col.$id);
      if (!attrs.attributes.length) {
        console.log("   (no attributes)");
      }
      for (const a of attrs.attributes) {
        const extra = [
          a.type,
          a.array ? "array" : "",
          a.size ? `size=${a.size}` : "",
          a.required ? "required" : "optional",
        ]
          .filter(Boolean)
          .join(" ");
        console.log(`   - ${a.key}: ${extra}`);
      }
    } catch (e) {
      console.log(`   ! could not list attributes: ${e.message}`);
    }
  }
};

run().catch((e) => {
  console.error("Failed:", e.message);
  process.exit(1);
});

