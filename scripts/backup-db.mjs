// Read-only full backup of the Appwrite database. For every collection it dumps:
//   - the schema (attributes + indexes)
//   - ALL documents (paginated)
// into backups/db-backup-<timestamp>/ as JSON, plus a manifest.json summary.
//
// Run:  APPWRITE_API_KEY=xxx node scripts/backup-db.mjs

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { Client, Databases, Query } from "node-appwrite";

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

// Filesystem-safe timestamp: 2026-05-30T14-22-05
const stamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
const outDir = new URL(`../backups/db-backup-${stamp}/`, import.meta.url);
mkdirSync(outDir, { recursive: true });

function write(name, data) {
  // BigInt isn't JSON-serializable by default; stringify it losslessly.
  const replacer = (_key, value) => (typeof value === "bigint" ? value.toString() : value);
  writeFileSync(new URL(name, outDir), JSON.stringify(data, replacer, 2));
}

async function listAllCollections() {
  const all = [];
  let cursor = null;
  // Paginate collections (100 at a time) in case there are many.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await db.listCollections(DB, queries);
    all.push(...res.collections);
    if (res.collections.length < 100) break;
    cursor = res.collections[res.collections.length - 1].$id;
  }
  return all;
}

async function dumpDocuments(colId) {
  const docs = [];
  let cursor = null;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const res = await db.listDocuments(DB, colId, queries);
    docs.push(...res.documents);
    if (res.documents.length < 100) break;
    cursor = res.documents[res.documents.length - 1].$id;
  }
  return docs;
}

const run = async () => {
  console.log(`\nBacking up database ${DB}`);
  console.log(`Output: backups/db-backup-${stamp}/\n`);

  const collections = await listAllCollections();
  const manifest = {
    database: DB,
    endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    project: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    takenAt: new Date().toISOString(),
    collections: [],
  };

  let totalDocs = 0;
  for (const col of collections) {
    const docs = await dumpDocuments(col.$id);
    totalDocs += docs.length;

    write(`${col.$id}.json`, {
      collection: {
        $id: col.$id,
        name: col.name,
        documentSecurity: col.documentSecurity,
        enabled: col.enabled,
        $permissions: col.$permissions,
        attributes: col.attributes,
        indexes: col.indexes,
      },
      documents: docs,
    });

    manifest.collections.push({
      id: col.$id,
      name: col.name,
      attributes: col.attributes?.length || 0,
      documents: docs.length,
    });
    console.log(`  ✓ ${col.$id} — ${docs.length} doc(s)`);
  }

  write("manifest.json", manifest);

  console.log(`\nDone. ${collections.length} collection(s), ${totalDocs} document(s) total.`);
  console.log(`Saved to backups/db-backup-${stamp}/\n`);
};

run().catch((e) => {
  console.error("\nBackup failed:", e.message);
  process.exit(1);
});
