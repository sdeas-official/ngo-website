"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";
import { homePage } from "@/features/admin/config/pages.config";

// The Home page is physically split across multiple collections
// ("home" + "homeTwo" + "homeLanding"). This hook hides that entirely: it loads
// each, merges them into one flat object for the editor, and on save routes each
// field back to its declared collection. All multi-collection logic lives here.

// Field key -> collection key, derived from the page config (single source of truth).
const fieldCollectionMap = homePage.sections
  .flatMap((section) => section.fields)
  .reduce((acc, field) => {
    acc[field.key] = field.collection;
    return acc;
  }, {});

// Distinct collections referenced by the config.
const COLLECTIONS = homePage.collections;

export function useHomeDocument({ enabled = true } = {}) {
  const repo = useMemo(() => createAdminRepo(), []);
  const [docIds, setDocIds] = useState({}); // { home: id, homeTwo: id, homeLanding: id }
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError("");
    try {
      const ids = {};
      let merged = {};

      await Promise.all(
        COLLECTIONS.map(async (key) => {
          try {
            // "home" is the canonical single doc; the others use newest.
            const docs = await repo.list(key, {
              limit: 1,
              orderDesc: key === "home" ? undefined : "$createdAt",
            });
            const doc = docs[0];
            if (doc) {
              ids[key] = doc.$id;
              merged = { ...merged, ...sanitizeDocument(doc) };
            }
          } catch {
            // a missing/unavailable collection shouldn't break the rest
          }
        }),
      );

      setDocIds(ids);
      setData(merged);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load home content.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, repo]);

  useEffect(() => {
    load();
  }, [load]);

  // Save only the fields contained in one section. Splits them by their declared
  // collection, then update-or-creates each affected collection.
  const saveFields = useCallback(
    async (fieldValues) => {
      const byCollection = {};
      Object.entries(fieldValues).forEach(([key, value]) => {
        const target = fieldCollectionMap[key];
        if (!target) return;
        byCollection[target] = byCollection[target] || {};
        byCollection[target][key] = value ?? "";
      });

      const nextIds = { ...docIds };
      for (const [collectionKey, payload] of Object.entries(byCollection)) {
        if (nextIds[collectionKey]) {
          await repo.update(collectionKey, nextIds[collectionKey], payload);
        } else {
          const created = await repo.create(collectionKey, payload);
          nextIds[collectionKey] = created.$id;
        }
      }

      setDocIds(nextIds);
      setData((prev) => ({ ...prev, ...fieldValues }));
    },
    [docIds, repo],
  );

  return { repo, data, isLoading, error, reload: load, saveFields };
}
