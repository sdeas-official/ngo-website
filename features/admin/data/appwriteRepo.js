import { ID, Query } from "appwrite";
import { createDatabasesClient } from "@/lib/appwriteClient";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";

// Thin, framework-agnostic wrapper around the Appwrite Databases SDK. Centralizes
// the databaseId + collection-id resolution that was previously scattered through
// the 4,700-line admin page, so every screen talks to the backend the same way.
//
// Collection keys map to lib/appwriteClient.js -> config.collections.*
// A few sections used inline fallbacks in the legacy code; those are preserved here.
const COLLECTION_FALLBACKS = {
  homeTwo: "home_page_two",
  homeLanding: "home_landing",
  homeOurPrograms: "home_our_programs",
  homeEventsUpdates: "home_events_and_updates_",
  ongoingProjects: "ongoing_projects",
  siteSettings: "site_settings",
  aboutPage: "about_page",
  teamMembers: "team_members",
  programsContent: "programs_content",
  blogContent: "blog_content",
  partnerPage: "partner_page",
  donationTiers: "donation_tiers",
  galleryContent: "gallery_content",
  registrations: "registration_",
};

export function createAdminRepo() {
  const { databases, config } = createDatabasesClient();

  function resolveCollectionId(key) {
    // Donation tiers now live in their own collection (donation_tiers). They were
    // historically mixed into the volunteer-responses table (partner_with_us_table);
    // see scripts/setup-partner.mjs for the split + repair.
    if (key === "partnerDonations") {
      return config.collections.donationTiers || COLLECTION_FALLBACKS.donationTiers || "";
    }
    return config.collections[key] || COLLECTION_FALLBACKS[key] || "";
  }

  function assertReady(collectionKey) {
    if (!databases) {
      throw new Error("Appwrite client is not configured.");
    }
    if (!config.databaseId) {
      throw new Error("Database ID is missing.");
    }
    const collectionId = resolveCollectionId(collectionKey);
    if (!collectionId) {
      throw new Error(`Collection ID for "${collectionKey}" is missing.`);
    }
    return collectionId;
  }

  return {
    config,
    isReady: Boolean(databases && config.endpoint && config.projectId && config.databaseId),
    resolveCollectionId,

    // List documents. `queries` accepts raw Appwrite Query strings; helpers below
    // cover the common cases (limit, order, search).
    async list(collectionKey, { limit = 100, orderDesc, queries = [] } = {}) {
      const collectionId = assertReady(collectionKey);
      const allQueries = [Query.limit(limit), ...queries];
      if (orderDesc) allQueries.push(Query.orderDesc(orderDesc));
      const result = await databases.listDocuments(config.databaseId, collectionId, allQueries);
      return result.documents;
    },

    async get(collectionKey, id) {
      const collectionId = assertReady(collectionKey);
      const doc = await databases.getDocument(config.databaseId, collectionId, id);
      return doc;
    },

    async create(collectionKey, payload) {
      const collectionId = assertReady(collectionKey);
      return databases.createDocument(config.databaseId, collectionId, ID.unique(), payload);
    },

    async update(collectionKey, id, payload) {
      const collectionId = assertReady(collectionKey);
      return databases.updateDocument(config.databaseId, collectionId, id, payload);
    },

    async remove(collectionKey, id) {
      const collectionId = assertReady(collectionKey);
      return databases.deleteDocument(config.databaseId, collectionId, id);
    },
  };
}

export { sanitizeDocument, Query, ID };
