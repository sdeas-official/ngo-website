import { Client, Databases } from "appwrite";

export function getAppwriteConfig() {
  return {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    collections: {
      home: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_ID || "",
      homeTwo:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_TWO_ID ||
        "home_page_two",
      homeEventsUpdates:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_EVENTS_UPDATES_ID ||
        "home_events_and_updates_",
      about: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ABOUT_ID || "",
      gallery: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GALLERY_ID || "",
      blog: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_ID || "",
      programs:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROGRAMS_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROGRAMS_PAGE_ID ||
        "",
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
      partnerPage:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PARTNER_PAGE_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PARTNER_PAGE_TABLE_ID ||
        "",
      registrations:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REGISTRATION_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REGISTRATIONS_ID ||
        "registration_",
      homeOurPrograms:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_OUR_PROGRAMS_ID ||
        "home_our_programs",
      admin:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ADMIN_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ADMIN_TABLE_ID ||
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
