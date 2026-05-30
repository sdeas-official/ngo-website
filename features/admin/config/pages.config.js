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

export const programsPage = {
  key: "programs",
  label: "Programs Page",
  description: "Sections are listed in the same order they appear on your live Programs page.",
  collections: ["programsContent"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The banner heading, intro text and background image.",
      summary: "text:heroTitleTop",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow (small label)", type: "text", collection: "programsContent" },
        { key: "heroTitleTop", label: "Heading — line 1", type: "text", collection: "programsContent" },
        { key: "heroTitleBottom", label: "Heading — line 2 (highlighted)", type: "text", collection: "programsContent" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "programsContent" },
        { key: "heroImage", label: "Background image", type: "image", collection: "programsContent" },
      ],
    },
    {
      id: "special",
      title: "Special Programs",
      description: "The 'Special Programs & Initiatives' card grid.",
      summary: "text:specialHeading",
      fields: [
        { key: "specialHeading", label: "Heading", type: "text", collection: "programsContent" },
        { key: "specialSubtitle", label: "Subtitle", type: "textarea", collection: "programsContent" },
        {
          key: "specialPrograms",
          label: "Cards (icon = a Lucide icon name, e.g. Flame, Shield, BookOpen)",
          type: "valuesList",
          collection: "programsContent",
          json: true,
        },
      ],
    },
    {
      id: "cta",
      title: "Call to Action",
      description: "The closing 'Ready to Make a Difference?' banner.",
      summary: "text:ctaHeading",
      fields: [
        { key: "ctaHeading", label: "Heading", type: "text", collection: "programsContent" },
        { key: "ctaSubtitle", label: "Subtitle", type: "textarea", collection: "programsContent" },
        { key: "ctaPrimaryLabel", label: "Primary button label", type: "text", collection: "programsContent" },
        { key: "ctaPrimaryHref", label: "Primary button link", type: "text", collection: "programsContent" },
        { key: "ctaSecondaryLabel", label: "Secondary button label", type: "text", collection: "programsContent" },
        { key: "ctaSecondaryHref", label: "Secondary button link", type: "text", collection: "programsContent" },
      ],
    },
  ],
  overview: [
    { type: "section", id: "hero" },
    {
      type: "link",
      title: "Program Sections",
      description: "The main program blocks (Education, Healthcare, Community…).",
      href: "/admin/collections/programs",
    },
    { type: "section", id: "special" },
    { type: "section", id: "cta" },
  ],
};

export const blogPage = {
  key: "blog",
  label: "Blog Page",
  description: "Edit the blog page banner and section headings. Posts are managed under Content → Blog Posts.",
  collections: ["blogContent"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The banner heading, intro text and background image.",
      summary: "text:heroHeading",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow (small label)", type: "text", collection: "blogContent" },
        { key: "heroHeading", label: "Heading", type: "text", collection: "blogContent" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "blogContent" },
        { key: "heroImage", label: "Background image", type: "image", collection: "blogContent" },
        { key: "featuredLabel", label: "Featured post badge label", type: "text", collection: "blogContent" },
      ],
    },
    {
      id: "recent",
      title: "Latest Articles heading",
      description: "The heading above the recent-posts grid.",
      summary: "text:recentHeading",
      fields: [
        { key: "recentEyebrow", label: "Eyebrow", type: "text", collection: "blogContent" },
        { key: "recentHeading", label: "Heading", type: "text", collection: "blogContent" },
        { key: "recentSubtitle", label: "Subtitle", type: "textarea", collection: "blogContent" },
      ],
    },
  ],
  overview: [
    { type: "section", id: "hero" },
    {
      type: "link",
      title: "Blog Posts",
      description: "Write, edit and delete the articles shown on this page.",
      href: "/admin/collections/blog",
    },
    { type: "section", id: "recent" },
  ],
};

export const partnerPage = {
  key: "partner",
  label: "Partner With Us Page",
  description: "Sections are listed in the same order they appear on your live Partner With Us page.",
  collections: ["partnerPage"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The banner heading, intro text and background image.",
      summary: "text:heroHeading",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow (small label)", type: "text", collection: "partnerPage" },
        { key: "heroHeading", label: "Heading", type: "text", collection: "partnerPage" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "partnerPage" },
        { key: "heroImage", label: "Background image", type: "image", collection: "partnerPage" },
      ],
    },
    {
      id: "donate",
      title: "Donation section — heading",
      description: "The heading above the donation tier cards.",
      summary: "text:donateHeading",
      fields: [
        { key: "donateEyebrow", label: "Eyebrow", type: "text", collection: "partnerPage" },
        { key: "donateHeading", label: "Heading", type: "text", collection: "partnerPage" },
        { key: "donateSubtitle", label: "Subtitle", type: "textarea", collection: "partnerPage" },
      ],
    },
    {
      id: "volunteer",
      title: "Volunteer section",
      description: "The 'Become a Volunteer' intro, role cards and form heading.",
      summary: "text:volunteerHeading",
      fields: [
        { key: "volunteerEyebrow", label: "Eyebrow", type: "text", collection: "partnerPage" },
        { key: "volunteerHeading", label: "Heading", type: "text", collection: "partnerPage" },
        { key: "volunteerIntro", label: "Intro paragraph", type: "textarea", collection: "partnerPage" },
        {
          key: "volunteerRoles",
          label: "Role cards (leave Icon blank — only Title & Description show)",
          type: "valuesList",
          collection: "partnerPage",
          json: true,
        },
        { key: "formHeading", label: "Application form heading", type: "text", collection: "partnerPage" },
      ],
    },
    {
      id: "partners",
      title: "Partners & CTA section",
      description: "The partner categories grid and the closing call-to-action banner.",
      summary: "text:partnersHeading",
      fields: [
        { key: "partnersEyebrow", label: "Eyebrow", type: "text", collection: "partnerPage" },
        { key: "partnersHeading", label: "Heading", type: "text", collection: "partnerPage" },
        { key: "partnersSubtitle", label: "Subtitle", type: "textarea", collection: "partnerPage" },
        { key: "partnersList", label: "Partner categories", type: "stringList", collection: "partnerPage" },
        { key: "ctaHeading", label: "CTA heading", type: "text", collection: "partnerPage" },
        { key: "ctaText", label: "CTA paragraph", type: "textarea", collection: "partnerPage" },
        { key: "ctaButtonLabel", label: "CTA button label", type: "text", collection: "partnerPage" },
        { key: "ctaButtonHref", label: "CTA button link", type: "text", collection: "partnerPage" },
      ],
    },
  ],
  overview: [
    { type: "section", id: "hero" },
    { type: "section", id: "donate" },
    {
      type: "link",
      title: "Donation Tiers",
      description: "Add, edit and reorder the donation cards.",
      href: "/admin/collections/donations",
    },
    { type: "section", id: "volunteer" },
    {
      type: "link",
      title: "Volunteer Submissions",
      description: "Read the volunteer applications people submit.",
      href: "/admin/inbox/partner",
    },
    { type: "section", id: "partners" },
  ],
};

export const galleryPage = {
  key: "gallery",
  label: "Gallery Page",
  description: "Sections are listed in the same order they appear on your live Gallery page.",
  collections: ["galleryContent"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      description: "The banner heading, intro text and background image.",
      summary: "text:heroHeading",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow (small label)", type: "text", collection: "galleryContent" },
        { key: "heroHeading", label: "Heading", type: "text", collection: "galleryContent" },
        { key: "heroSubtitle", label: "Intro paragraph", type: "textarea", collection: "galleryContent" },
        { key: "heroImage", label: "Background image", type: "image", collection: "galleryContent" },
      ],
    },
    {
      id: "photo",
      title: "Photo Gallery — heading",
      description: "The heading above the photo grid.",
      summary: "text:photoHeading",
      fields: [
        { key: "photoEyebrow", label: "Eyebrow", type: "text", collection: "galleryContent" },
        { key: "photoHeading", label: "Heading", type: "text", collection: "galleryContent" },
        { key: "photoSubtitle", label: "Subtitle", type: "textarea", collection: "galleryContent" },
      ],
    },
    {
      id: "video",
      title: "Video Gallery section",
      description: "The heading and the video cards below the photo grid.",
      summary: "text:videoHeading",
      fields: [
        { key: "videoEyebrow", label: "Eyebrow", type: "text", collection: "galleryContent" },
        { key: "videoHeading", label: "Heading", type: "text", collection: "galleryContent" },
        { key: "videoSubtitle", label: "Subtitle", type: "textarea", collection: "galleryContent" },
        {
          key: "videos",
          label: "Video cards (leave Icon blank — only Title & Description show)",
          type: "valuesList",
          collection: "galleryContent",
          json: true,
        },
      ],
    },
  ],
  overview: [
    { type: "section", id: "hero" },
    { type: "section", id: "photo" },
    {
      type: "link",
      title: "Photos",
      description: "Upload, organise and remove the images in the gallery grid.",
      href: "/admin/pages/gallery/images",
    },
    { type: "section", id: "video" },
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
  programs: programsPage,
  blog: blogPage,
  partner: partnerPage,
  gallery: galleryPage,
};
