// Shared YouTube helpers for the public site.

// Parses a YouTube watch/share/shorts/embed URL → video id (or "" if not valid).
export function extractYouTubeVideoId(url) {
  if (typeof url !== "string" || !url.trim()) return "";

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
      if (parsed.pathname.startsWith("/shorts/"))
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
      if (parsed.pathname.startsWith("/embed/"))
        return parsed.pathname.split("/").filter(Boolean)[1] || "";
    }

    return "";
  } catch {
    return "";
  }
}

// Thumbnail URLs from highest to most-reliable quality. maxresdefault is sharp
// but not generated for every video, so hqdefault is the dependable fallback.
export function youTubeThumbnails(videoId) {
  if (!videoId) return [];
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  ];
}
