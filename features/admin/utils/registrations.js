// Normalizes the various shapes the `approved` field can take (boolean, number,
// or string) into a single boolean. Extracted verbatim from the legacy panel.
export function isRegistrationApproved(data) {
  const value = data?.approved;

  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

// Sort order used across the registrations inbox: pending first, then newest.
// Mirrors the comparator used in the legacy panel's load/approve handlers.
export function sortRegistrations(list) {
  return [...list].sort((a, b) => {
    const approvedA = isRegistrationApproved(a) ? 1 : 0;
    const approvedB = isRegistrationApproved(b) ? 1 : 0;
    if (approvedA !== approvedB) return approvedA - approvedB;

    const createdAtA = new Date(a?.$createdAt || 0).getTime();
    const createdAtB = new Date(b?.$createdAt || 0).getTime();
    return createdAtB - createdAtA;
  });
}
