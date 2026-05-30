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
  ],
  // The home-page overview, in the SAME ORDER the sections appear on the live
  // landing page. type "section" opens the slide-over editor (a field section
  // above); type "link" jumps to the collection/page that renders in that spot.
  overview: [
    { type: "section", id: "hero" },
    {
      type: "link",
      title: "Our Programs",
      description: "The program cards shown right below the hero.",
      href: "/admin/pages/home/programs",
    },
    { type: "section", id: "mission" },
    { type: "section", id: "vision" },
    {
      type: "link",
      title: "Ongoing Projects",
      description: "The CSR projects carousel.",
      href: "/admin/collections/ongoing",
    },
    {
      type: "link",
      title: "Testimonials",
      description: "The video testimonials slider.",
      href: "/admin/collections/testimonials",
    },
    { type: "section", id: "csr" },
    {
      type: "link",
      title: "Events & Updates",
      description: "The latest-articles cards near the bottom.",
      href: "/admin/pages/home/events",
    },
    {
      type: "link",
      title: "Get In Touch",
      description: "Closing call-to-action heading & text (in Site Settings).",
      href: "/admin/site-settings",
    },
  ],
};

export const aboutPage = {
  key: "about",
  label: "About Us",
  description: "Sections are listed in the same order they appear on your live About page.",
  // Story/Mission/Vision text+image live in about_us_page; everything else
  // (hero, stats, headings, vision images, core values) lives in about_page.
  collections: ["about", "aboutPage"],
  primaryCollection: "about",
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The banner heading, intro text and background image.",
      summary: "text:heroTitleTop",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow (small label)", type: "text", collection: "aboutPage" },
        { key: "heroTitleTop", label: "Heading — line 1", type: "text", collection: "aboutPage" },
        { key: "heroTitleBottom", label: "Heading — line 2 (highlighted)", type: "text", collection: "aboutPage" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "aboutPage" },
        { key: "heroImage", label: "Background image", type: "image", collection: "aboutPage" },
      ],
    },
    {
      id: "stats",
      title: "Stats Bar",
      description: "The green strip of headline numbers.",
      summary: "list:statLabels",
      fields: [
        { key: "statNumbers", label: "Stat numbers (e.g. 4,000+)", type: "stringList", collection: "aboutPage" },
        { key: "statLabels", label: "Stat labels (e.g. Youth Trained)", type: "stringList", collection: "aboutPage" },
      ],
    },
    {
      id: "story",
      title: "Our Story",
      summary: "text:OurStoryText",
      fields: [
        { key: "storyEyebrow", label: "Eyebrow", type: "text", collection: "aboutPage" },
        { key: "storyHeading", label: "Heading", type: "text", collection: "aboutPage" },
        { key: "OurStoryText", label: "Story text (one paragraph per line)", type: "textarea", collection: "about" },
        { key: "OurStoryImage", label: "Story image", type: "image", collection: "about" },
        { key: "storyBadgeLabel", label: "Floating badge — label", type: "text", collection: "aboutPage" },
        { key: "storyBadgeValue", label: "Floating badge — value", type: "text", collection: "aboutPage" },
      ],
    },
    {
      id: "mission",
      title: "Our Mission",
      summary: "text:OurMissionText",
      fields: [
        { key: "missionEyebrow", label: "Eyebrow", type: "text", collection: "aboutPage" },
        { key: "missionHeading", label: "Heading", type: "text", collection: "aboutPage" },
        { key: "OurMissionText", label: "Mission text", type: "textarea", collection: "about" },
        { key: "OurMissionImage", label: "Mission image", type: "image", collection: "about" },
      ],
    },
    {
      id: "vision",
      title: "Our Vision",
      summary: "text:OurVisionText",
      fields: [
        { key: "visionEyebrow", label: "Eyebrow", type: "text", collection: "aboutPage" },
        { key: "visionHeading", label: "Heading", type: "text", collection: "aboutPage" },
        { key: "OurVisionText", label: "Vision text (one paragraph per line)", type: "textarea", collection: "about" },
        { key: "visionImages", label: "Vision images (shown in the grid)", type: "imageList", collection: "aboutPage" },
      ],
    },
    {
      id: "values",
      title: "Core Values",
      summary: "text:valuesHeading",
      fields: [
        { key: "valuesEyebrow", label: "Eyebrow", type: "text", collection: "aboutPage" },
        { key: "valuesHeading", label: "Heading", type: "text", collection: "aboutPage" },
        { key: "valuesSubtitle", label: "Subtitle", type: "textarea", collection: "aboutPage" },
        { key: "coreValues", label: "Values", type: "valuesList", collection: "aboutPage", json: true },
      ],
    },
    {
      id: "teamHeading",
      title: "Team — heading",
      description: "The heading above your leadership cards.",
      summary: "text:teamHeading",
      fields: [
        { key: "teamEyebrow", label: "Eyebrow", type: "text", collection: "aboutPage" },
        { key: "teamHeading", label: "Heading", type: "text", collection: "aboutPage" },
        { key: "teamSubtitle", label: "Subtitle", type: "textarea", collection: "aboutPage" },
      ],
    },
  ],
  // Same order as the live About page; the team cards are their own collection.
  overview: [
    { type: "section", id: "hero" },
    { type: "section", id: "stats" },
    { type: "section", id: "story" },
    { type: "section", id: "mission" },
    { type: "section", id: "vision" },
    { type: "section", id: "values" },
    { type: "section", id: "teamHeading" },
    {
      type: "link",
      title: "Team Members",
      description: "Add, edit and reorder the leadership cards.",
      href: "/admin/collections/team",
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
