// Safely parse a JSON string attribute coming from Appwrite, returning a fallback
// when the value is empty or malformed.
export function safeParseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
