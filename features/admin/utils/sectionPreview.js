import { extractYouTubeVideoId } from "@/features/admin/utils/youtube";

// Computes the at-a-glance preview shown on a Page section card: a short summary
// line plus up to a few image thumbnails. Driven by the section's `summary` hint
// ("imageCount" | "text:Key" | "video:Key") and its image fields.
export function computeSectionPreview(section, values = {}) {
  const imageFields = section.fields.filter((f) => f.type === "image");
  const thumbnails = imageFields.slice(0, 4).map((f) => values[f.key] || "");
  const filledImages = imageFields.filter((f) => values[f.key]).length;

  let summary = "";
  const hint = section.summary || "";

  if (hint === "imageCount") {
    summary = `${filledImages} of ${imageFields.length} images set`;
  } else if (hint.startsWith("text:")) {
    const key = hint.slice(5);
    const text = (values[key] || "").trim();
    summary = text ? `${text.slice(0, 120)}${text.length > 120 ? "…" : ""}` : "Not set yet";
  } else if (hint.startsWith("video:")) {
    const key = hint.slice(6);
    summary = extractYouTubeVideoId(values[key] || "") ? "Video set" : "No video set";
  }

  return { summary, thumbnails: imageFields.length ? thumbnails : [] };
}

// Required-field validation for a section's fields. Returns a { key: message } map.
export function validateSectionFields(section, draft) {
  const errors = {};
  section.fields.forEach((field) => {
    if (!field.required) return;
    const value = draft[field.key];
    const empty =
      value == null ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && value.filter(Boolean).length === 0);
    if (empty) errors[field.key] = `${field.label} is required.`;
  });
  return errors;
}
