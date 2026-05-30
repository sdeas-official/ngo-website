// Schemas for the "Content" collections (list ↔ record editing).
//
// Each collection declares:
//   collectionKey  -> lib/appwriteClient.js config.collections key
//   list           -> how rows render + search/sort behavior
//   editor.groups  -> grouped field blocks shown in the record editor
//   toPayload      -> maps form values to the exact Appwrite write shape
//                     (preserves the legacy payload contract precisely)
//   max            -> optional cap (disables "New" when reached)
//
// Field types: text | textarea | url | image | youtube | number | datetime |
//              tag | toggle | stringList

import { toDateTimeLocalValue } from "@/features/admin/utils/datetime";

const str = (v) => (typeof v === "string" ? v : "");
const list = (v) =>
  Array.isArray(v) ? v.filter((i) => typeof i === "string").map((i) => i.trim()).filter(Boolean) : [];

export const blogCollection = {
  key: "blog",
  label: "Blog Posts",
  singular: "Blog Post",
  collectionKey: "blog",
  list: {
    titleField: "title",
    subtitleField: "author",
    searchFields: ["title", "author"],
  },
  editor: {
    groups: [
      {
        title: "Basics",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "author", label: "Author", type: "text", required: true },
        ],
      },
      {
        title: "Publishing",
        fields: [
          { key: "publishedDate", label: "Publish date", type: "datetime" },
          { key: "tags", label: "Tag (enum value)", type: "tag" },
        ],
      },
      {
        title: "Cover",
        fields: [{ key: "mainImage", label: "Main image", type: "image" }],
      },
      {
        title: "Content",
        fields: [{ key: "content", label: "Content", type: "textarea", required: true, big: true }],
      },
    ],
  },
  emptyValues: { title: "", author: "", content: "", mainImage: "", publishedDate: "", tags: "" },
  toForm(doc) {
    return {
      title: str(doc.title),
      author: str(doc.author),
      content: str(doc.content),
      mainImage: str(doc.mainImage),
      publishedDate: toDateTimeLocalValue(doc.publishedDate),
      tags: str(doc.tags),
    };
  },
  toPayload(form) {
    const publishedDate = form.publishedDate
      ? new Date(form.publishedDate).toISOString()
      : new Date().toISOString();
    return {
      title: (form.title || "").trim(),
      author: (form.author || "").trim(),
      content: (form.content || "").trim(),
      mainImage: (form.mainImage || "").trim() || null,
      publishedDate,
      tags: (form.tags || "").trim() || null,
    };
  },
};

export const programsCollection = {
  key: "programs",
  label: "Programs",
  singular: "Program",
  collectionKey: "programs",
  list: {
    titleField: "title",
    subtitleField: "mainText",
    imageField: "image",
    searchFields: ["title", "mainText"],
  },
  editor: {
    groups: [
      {
        title: "Basics",
        fields: [
          { key: "title", label: "Program title", type: "text", required: true },
          { key: "image", label: "Cover image", type: "image", required: true },
        ],
      },
      {
        title: "Description",
        fields: [{ key: "mainText", label: "Main text", type: "textarea", required: true, big: true }],
      },
      {
        title: "Key points",
        fields: [{ key: "importantPoints", label: "Key points", type: "stringList", required: true }],
      },
    ],
  },
  emptyValues: { title: "", image: "", mainText: "", importantPoints: [""] },
  toForm(doc) {
    const points = list(doc.importantPoints);
    return {
      title: str(doc.title),
      image: str(doc.image),
      mainText: str(doc.mainText),
      importantPoints: points.length ? points : [""],
    };
  },
  toPayload(form) {
    return {
      title: (form.title || "").trim(),
      image: (form.image || "").trim(),
      mainText: (form.mainText || "").trim(),
      importantPoints: (form.importantPoints || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  },
};

export const testimonialsCollection = {
  key: "testimonials",
  label: "Testimonials",
  singular: "Testimonial",
  collectionKey: "testimonials",
  list: {
    titleField: "name",
    subtitleField: "text",
    searchFields: ["name", "text"],
  },
  editor: {
    groups: [
      {
        title: "Person",
        fields: [{ key: "name", label: "Name", type: "text", required: true }],
      },
      {
        title: "Video",
        fields: [{ key: "image", label: "YouTube video URL", type: "youtube", required: true }],
      },
      {
        title: "Quote",
        fields: [{ key: "text", label: "Testimonial text", type: "textarea", required: true, big: true }],
      },
    ],
  },
  emptyValues: { name: "", image: "", text: "" },
  toForm(doc) {
    return { name: str(doc.name), image: str(doc.image), text: str(doc.text) };
  },
  validate(payload) {
    if (!payload.name || !payload.image || !payload.text) {
      return "Name, YouTube video URL, and testimonial text are required.";
    }
    return "";
  },
  toPayload(form) {
    return {
      name: (form.name || "").trim(),
      image: (form.image || "").trim(),
      text: (form.text || "").trim(),
    };
  },
};

export const donationsCollection = {
  key: "donations",
  label: "Donation Tiers",
  singular: "Donation Tier",
  collectionKey: "partnerDonations",
  list: {
    titleField: "donationTitle",
    priceField: "donationPrice",
    searchFields: ["donationTitle"],
  },
  editor: {
    groups: [
      {
        title: "Tier",
        fields: [
          { key: "donationTitle", label: "Donation title", type: "text", required: true },
          { key: "donationPrice", label: "Donation price (INR)", type: "number", required: true },
          { key: "optimised", label: "Highlight as featured (Optimised)", type: "toggle" },
        ],
      },
      {
        title: "Benefits",
        fields: [{ key: "donationBenefits", label: "Donation benefits", type: "stringList", required: true }],
      },
    ],
  },
  emptyValues: { donationTitle: "", donationPrice: "", donationBenefits: [""], optimised: false },
  toForm(doc) {
    const benefits = list(doc.donationBenefits);
    return {
      donationTitle: str(doc.donationTitle),
      donationPrice:
        typeof doc.donationPrice === "number" ? String(doc.donationPrice) : str(doc.donationPrice),
      donationBenefits: benefits.length ? benefits : [""],
      optimised:
        typeof doc.optimised === "boolean"
          ? doc.optimised
          : typeof doc.best === "boolean"
            ? doc.best
            : false,
    };
  },
  validate(payload) {
    if (!payload.donationTitle) return "Donation title is required.";
    if (!Number.isFinite(payload.donationPrice) || payload.donationPrice <= 0) {
      return "Donation price must be a number greater than 0.";
    }
    if (!payload.donationBenefits.length) return "Add at least one donation benefit.";
    return "";
  },
  toPayload(form) {
    return {
      donationTitle: (form.donationTitle || "").trim(),
      donationPrice: Number(form.donationPrice || 0),
      donationBenefits: (form.donationBenefits || [])
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
      best: Boolean(form.optimised),
    };
  },
};

export const ongoingProjectsCollection = {
  key: "ongoing",
  label: "Ongoing Projects",
  singular: "Project",
  collectionKey: "ongoingProjects",
  list: {
    titleField: "title",
    subtitleField: "location",
    imageField: "image",
    searchFields: ["title", "location"],
  },
  editor: {
    groups: [
      {
        title: "Details",
        fields: [
          { key: "title", label: "Project title", type: "text", required: true },
          { key: "location", label: "Location", type: "text" },
          { key: "image", label: "Image", type: "image", required: true },
        ],
      },
      {
        title: "About",
        fields: [{ key: "description", label: "Description", type: "textarea", big: true }],
      },
      {
        title: "Ordering",
        fields: [{ key: "sortOrder", label: "Sort order (lower shows first)", type: "number" }],
      },
    ],
  },
  emptyValues: { title: "", location: "", image: "", description: "", sortOrder: "" },
  toForm(doc) {
    return {
      title: str(doc.title),
      location: str(doc.location),
      image: str(doc.image),
      description: str(doc.description),
      sortOrder: typeof doc.sortOrder === "number" ? String(doc.sortOrder) : str(doc.sortOrder),
    };
  },
  toPayload(form) {
    return {
      title: (form.title || "").trim(),
      location: (form.location || "").trim(),
      image: (form.image || "").trim(),
      description: (form.description || "").trim(),
      sortOrder: Number.isFinite(Number(form.sortOrder)) ? Number(form.sortOrder || 0) : 0,
    };
  },
};

export const teamCollection = {
  key: "team",
  label: "Team Members",
  singular: "Team Member",
  collectionKey: "teamMembers",
  list: {
    titleField: "name",
    subtitleField: "role",
    imageField: "image",
    searchFields: ["name", "role"],
  },
  editor: {
    groups: [
      {
        title: "Person",
        fields: [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "role", label: "Role", type: "text" },
          { key: "designation", label: "Designation", type: "text" },
          { key: "image", label: "Photo", type: "image" },
        ],
      },
      {
        title: "Ordering",
        fields: [{ key: "sortOrder", label: "Sort order (lower shows first)", type: "number" }],
      },
    ],
  },
  emptyValues: { name: "", role: "", designation: "", image: "", sortOrder: "" },
  toForm(doc) {
    return {
      name: str(doc.name),
      role: str(doc.role),
      designation: str(doc.designation),
      image: str(doc.image),
      sortOrder: typeof doc.sortOrder === "number" ? String(doc.sortOrder) : str(doc.sortOrder),
    };
  },
  toPayload(form) {
    return {
      name: (form.name || "").trim(),
      role: (form.role || "").trim(),
      designation: (form.designation || "").trim(),
      image: (form.image || "").trim(),
      sortOrder: Number.isFinite(Number(form.sortOrder)) ? Number(form.sortOrder || 0) : 0,
    };
  },
};

export const collectionsByKey = {
  blog: blogCollection,
  programs: programsCollection,
  testimonials: testimonialsCollection,
  donations: donationsCollection,
  ongoing: ongoingProjectsCollection,
  team: teamCollection,
};
