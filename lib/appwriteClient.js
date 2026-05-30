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
      homeLanding:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_LANDING_ID ||
        "home_landing",
      ongoingProjects:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ONGOING_PROJECTS_ID ||
        "ongoing_projects",
      siteSettings:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS_ID ||
        "site_settings",
      homeEventsUpdates:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HOME_EVENTS_UPDATES_ID ||
        "home_events_and_updates_",
      about: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ABOUT_ID || "",
      aboutPage:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ABOUT_PAGE_ID || "about_page",
      teamMembers:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TEAM_MEMBERS_ID ||
        "team_members",
      gallery: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GALLERY_ID || "",
      galleryContent:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GALLERY_CONTENT_ID ||
        "gallery_content",
      blog: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_ID || "",
      blogContent:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_CONTENT_ID || "blog_content",
      programs:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROGRAMS_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROGRAMS_PAGE_ID ||
        "",
      programsContent:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROGRAMS_CONTENT_ID ||
        "programs_content",
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
        "partner_page",
      donationTiers:
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_DONATION_TIERS_ID ||
        "donation_tiers",
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
