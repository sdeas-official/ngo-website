// Parses a YouTube watch/share/shorts/embed URL and returns the video id,
// or "" when the input is not a recognizable YouTube URL.
export function extractYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return "";

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      }
    }

    return "";
  } catch {
    return "";
  }
}

// Builds a privacy-friendly embed URL from any supported YouTube URL.
export function toYouTubeEmbedUrl(url) {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}
