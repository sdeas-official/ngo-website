// Field schemas for the singleton "Pages" (Home, About, Gallery).
//
// A page is a list of SECTIONS. Each section becomes a card on the page overview
// and opens a right slide-over with only its own fields. Every field declares the
// physical Appwrite collection it belongs to so the data layer can transparently
// split one logical "page" across multiple collections on save.
//
// Field `type` is consumed by the schema-driven form renderer:
//   text | textarea | url | image | youtube
//
// The Home page is physically stored across two collections:
//   "home"     -> hero, banners, about/mission/vision (primaryFields below)
//   "homeTwo"  -> programs intro, events intro, csr video (secondaryFields below)
// Plus two child collections rendered as their own managers on the same page:
//   "homeOurPrograms"   -> up to 3 program cards
//   "homeEventsUpdates" -> events & updates entries

export const homePage = {
  key: "home",
  label: "Home Page",
  description: "Edit the sections of your homepage. Click a section to edit it.",
  primaryCollection: "home",
  secondaryCollection: "homeTwo",
  sections: [
    {
      id: "hero",
      title: "Hero & Banners",
      description: "The large images at the very top of your home page.",
      summary: "imageCount",
      fields: [
        { key: "HeroImage", label: "Hero image", type: "image", collection: "home" },
        { key: "BannerImageOne", label: "Banner 1", type: "image", collection: "home" },
        { key: "BannerImageTwo", label: "Banner 2", type: "image", collection: "home" },
        { key: "BannerImageThree", label: "Banner 3", type: "image", collection: "home" },
      ],
    },
    {
      id: "about",
      title: "About · Mission · Vision",
      description: "Introductory text and imagery for your organization.",
      summary: "text:AboutUsText",
      fields: [
        { key: "AboutUsImage", label: "About us image", type: "image", collection: "home" },
        { key: "AboutUsText", label: "About us text", type: "textarea", collection: "home" },
        { key: "OurMissionImageOne", label: "Mission image 1", type: "image", collection: "home" },
        { key: "OurMissionImageTwo", label: "Mission image 2", type: "image", collection: "home" },
        { key: "OurMissionImageThree", label: "Mission image 3", type: "image", collection: "home" },
        { key: "OurVisionText", label: "Our vision text", type: "textarea", collection: "home" },
      ],
    },
    {
      id: "programsIntro",
      title: "Our Programs — intro",
      description: "The heading, blurb, and image above your program cards.",
      summary: "text:ourProgrammsTitle",
      fields: [
        { key: "ourProgrammsTitle", label: "Section title", type: "text", collection: "homeTwo" },
        { key: "ourProgrammsText", label: "Section text", type: "textarea", collection: "homeTwo" },
        { key: "ourProgrammsImage", label: "Section image", type: "image", collection: "homeTwo" },
      ],
    },
    {
      id: "eventsIntro",
      title: "Events & Updates — intro",
      description: "The heading, blurb, and image above your events list.",
      summary: "text:EventsHeading",
      fields: [
        { key: "EventsHeading", label: "Section heading", type: "text", collection: "homeTwo" },
        { key: "EventsText", label: "Section text", type: "textarea", collection: "homeTwo" },
        { key: "EventsImage", label: "Section image", type: "image", collection: "homeTwo" },
      ],
    },
    {
      id: "csrVideo",
      title: "CSR Video",
      description: "A YouTube video embedded on the home page.",
      summary: "video:csrVideo",
      fields: [
        { key: "csrVideo", label: "YouTube video URL", type: "youtube", collection: "homeTwo" },
      ],
    },
  ],
  // Child collections surfaced as their own managers on the Home page.
  childCollections: [
    {
      id: "homePrograms",
      title: "Our Programs — cards",
      collectionKey: "homeOurPrograms",
      max: 3,
    },
    {
      id: "homeEvents",
      title: "Events & Updates — entries",
      collectionKey: "homeEventsUpdates",
    },
  ],
};

export const aboutPage = {
  key: "about",
  label: "About Us",
  description: "Edit your About page content and team members.",
  primaryCollection: "about",
  sections: [
    {
      id: "story",
      title: "Our Story",
      summary: "text:OurStoryText",
      fields: [
        { key: "OurStoryImage", label: "Story image", type: "image", collection: "about" },
        { key: "OurStoryText", label: "Story text", type: "textarea", collection: "about" },
      ],
    },
    {
      id: "mission",
      title: "Our Mission",
      summary: "text:OurMissionText",
      fields: [
        { key: "OurMissionImage", label: "Mission image", type: "image", collection: "about" },
        { key: "OurMissionText", label: "Mission text", type: "textarea", collection: "about" },
      ],
    },
    {
      id: "vision",
      title: "Our Vision",
      summary: "text:OurVisionText",
      fields: [
        { key: "OurVisionImage", label: "Vision image", type: "image", collection: "about" },
        { key: "OurVisionText", label: "Vision text", type: "textarea", collection: "about" },
      ],
    },
  ],
};

export const galleryFields = [
  { key: "AllImages", label: "All" },
  { key: "TrainingImages", label: "Training" },
  { key: "CommunityImages", label: "Community" },
];

export const pagesByKey = {
  home: homePage,
  about: aboutPage,
};
