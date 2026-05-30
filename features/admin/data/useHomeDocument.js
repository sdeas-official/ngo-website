"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";
import { homePage } from "@/features/admin/config/pages.config";

// The Home page is physically split across two collections ("home" + "homeTwo").
// This hook hides that entirely: it loads both, merges them into one flat object
// for the editor, and on save routes each field back to its declared collection.
// Everything two-collection-specific lives ONLY here.

// Which field keys belong to which collection, derived from the page config so
// the schema stays the single source of truth.
const fieldCollectionMap = homePage.sections
  .flatMap((section) => section.fields)
  .reduce((acc, field) => {
    acc[field.key] = field.collection; // "home" | "homeTwo"
    return acc;
  }, {});

export function useHomeDocument({ enabled = true } = {}) {
  const repo = useMemo(() => createAdminRepo(), []);
  const [primaryId, setPrimaryId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError("");
    try {
      const primaryDocs = await repo.list("home", { limit: 1 });
      const primaryDoc = primaryDocs[0];

      let secondaryDoc = null;
      try {
        const secondaryDocs = await repo.list("homeTwo", { limit: 1, orderDesc: "$createdAt" });
        secondaryDoc = secondaryDocs[0] || null;
      } catch {
        // secondary collection unavailable — keep primary data only
      }

      setPrimaryId(primaryDoc?.$id || "");
      setSecondaryId(secondaryDoc?.$id || "");
      setData({
        ...(primaryDoc ? sanitizeDocument(primaryDoc) : {}),
        ...(secondaryDoc ? sanitizeDocument(secondaryDoc) : {}),
      });
    } catch (loadError) {
      setError(loadError?.message || "Failed to load home content.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, repo]);

  useEffect(() => {
    load();
  }, [load]);

  // Save only the fields contained in one section (the slide-over scope). Splits
  // them across the two collections by their declared `collection`, then
  // update-or-creates each side as needed.
  const saveFields = useCallback(
    async (fieldValues) => {
      const primaryPayload = {};
      const secondaryPayload = {};

      Object.entries(fieldValues).forEach(([key, value]) => {
        const target = fieldCollectionMap[key];
        if (target === "homeTwo") secondaryPayload[key] = value ?? "";
        else if (target === "home") primaryPayload[key] = value ?? "";
      });

      if (Object.keys(primaryPayload).length) {
        if (primaryId) {
          await repo.update("home", primaryId, primaryPayload);
        } else {
          const created = await repo.create("home", primaryPayload);
          setPrimaryId(created.$id);
        }
      }

      if (Object.keys(secondaryPayload).length) {
        if (secondaryId) {
          await repo.update("homeTwo", secondaryId, secondaryPayload);
        } else {
          const created = await repo.create("homeTwo", secondaryPayload);
          setSecondaryId(created.$id);
        }
      }

      setData((prev) => ({ ...prev, ...fieldValues }));
    },
    [primaryId, secondaryId, repo],
  );

  return { repo, data, isLoading, error, reload: load, saveFields };
}
