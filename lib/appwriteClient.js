import { Client, Databases } from "appwrite";

export function getAppwriteConfig() {
  return {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    collections: {
      home: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_ID || "",
      about: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ABOUT_ID || "",
      gallery: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GALLERY_ID || "",
      blog: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_ID || "",
      testimonials:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TESTIMONIALS_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TESTIMONIAL_ID ||
        "",
      responses:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CONTACT_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CONTACT_US_ID ||
        "",
      partnerResponses:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PARTNER_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PARTNER_WITH_US_ID ||
        "",
    },
  };
}

export function createDatabasesClient() {
  const config = getAppwriteConfig();

  if (!config.endpoint || !config.projectId) {
    return { databases: null, config };
  }

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);
  const databases = new Databases(client);

  return { databases, config };
}
