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
  // Physically spread across three collections; the data layer hides this.
  collections: ["home", "homeTwo", "homeLanding"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The headline, intro text, button, stats and image at the top.",
      summary: "text:heroTitleTop",
      fields: [
        { key: "heroTitleTop", label: "Headline — line 1 (highlighted)", type: "text", collection: "homeLanding" },
        { key: "heroTitleBottom", label: "Headline — line 2", type: "text", collection: "homeLanding" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "homeLanding" },
        { key: "heroCtaLabel", label: "Button label", type: "text", collection: "homeLanding" },
        { key: "heroCtaHref", label: "Button link", type: "text", collection: "homeLanding" },
        { key: "heroStatNumbers", label: "Stat numbers (e.g. 4,000+)", type: "stringList", collection: "homeLanding" },
        { key: "heroStatLabels", label: "Stat labels (e.g. Youth Trained)", type: "stringList", collection: "homeLanding" },
        { key: "HeroImage", label: "Hero image", type: "image", collection: "home" },
      ],
    },
    {
      id: "banners",
      title: "Banner Images",
      description: "Supporting banner images used across the site.",
      summary: "imageCount",
      fields: [
        { key: "BannerImageOne", label: "Banner 1", type: "image", collection: "home" },
        { key: "BannerImageTwo", label: "Banner 2", type: "image", collection: "home" },
        { key: "BannerImageThree", label: "Banner 3", type: "image", collection: "home" },
      ],
    },
    {
      id: "mission",
      title: "Mission section",
      description: "The 'Our Mission' block with heading, text and image.",
      summary: "text:missionHeading",
      fields: [
        { key: "missionEyebrow", label: "Eyebrow (small label)", type: "text", collection: "homeLanding" },
        { key: "missionHeading", label: "Heading", type: "text", collection: "homeLanding" },
        { key: "AboutUsText", label: "Paragraph", type: "textarea", collection: "home" },
        { key: "AboutUsImage", label: "Image", type: "image", collection: "home" },
        { key: "missionCtaLabel", label: "Button label", type: "text", collection: "homeLanding" },
        { key: "missionCtaHref", label: "Button link", type: "text", collection: "homeLanding" },
      ],
    },
    {
      id: "vision",
      title: "Vision section",
      description: "The 'Our Vision' block with heading, text and three images.",
      summary: "text:visionHeading",
      fields: [
        { key: "visionEyebrow", label: "Eyebrow (small label)", type: "text", collection: "homeLanding" },
        { key: "visionHeading", label: "Heading", type: "text", collection: "homeLanding" },
        { key: "OurVisionText", label: "Paragraph", type: "textarea", collection: "home" },
        { key: "OurMissionImageOne", label: "Image 1 (large)", type: "image", collection: "home" },
        { key: "OurMissionImageTwo", label: "Image 2", type: "image", collection: "home" },
        { key: "OurMissionImageThree", label: "Image 3", type: "image", collection: "home" },
        { key: "visionCtaLabel", label: "Button label", type: "text", collection: "homeLanding" },
        { key: "visionCtaHref", label: "Button link", type: "text", collection: "homeLanding" },
      ],
    },
    {
      id: "csr",
      title: "CSR Partnership section",
      description: "Heading, text, button and the embedded YouTube video.",
      summary: "text:csrHeading",
      fields: [
        { key: "csrEyebrow", label: "Eyebrow (small label)", type: "text", collection: "homeLanding" },
        { key: "csrHeading", label: "Heading", type: "text", collection: "homeLanding" },
        { key: "csrText", label: "Paragraph", type: "textarea", collection: "homeLanding" },
        { key: "csrCtaLabel", label: "Button label", type: "text", collection: "homeLanding" },
        { key: "csrCtaHref", label: "Button link", type: "text", collection: "homeLanding" },
        { key: "csrVideo", label: "YouTube video URL", type: "youtube", collection: "homeTwo" },
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
