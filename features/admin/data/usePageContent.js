"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";

// Generic editor data layer for a "page" whose fields are physically spread
// across several singleton collections (e.g. Home = home/homeTwo/homeLanding,
// About = about/aboutPage). Loads each collection's newest doc, merges them into
// one flat object, and on save routes each field back to its declared collection.
//
// pageConfig must provide:
//   collections: string[]            // repo collection keys, e.g. ["about","aboutPage"]
//   sections: [{ fields: [{ key, collection }] }]
//   primaryCollection?: string       // loaded as the single canonical doc (first), not newest
export function usePageContent(pageConfig, { enabled = true } = {}) {
  const repo = useMemo(() => createAdminRepo(), []);

  const fieldCollectionMap = useMemo(
    () =>
      pageConfig.sections
        .flatMap((s) => s.fields)
        .reduce((acc, f) => {
          acc[f.key] = f.collection;
          return acc;
        }, {}),
    [pageConfig],
  );

  const [docIds, setDocIds] = useState({});
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError("");
    try {
      const ids = {};
      let merged = {};
      await Promise.all(
        pageConfig.collections.map(async (key) => {
          try {
            const docs = await repo.list(key, {
              limit: 1,
              orderDesc: key === pageConfig.primaryCollection ? undefined : "$createdAt",
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
    } catch (e) {
      setError(e?.message || "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, pageConfig, repo]);

  useEffect(() => {
    load();
  }, [load]);

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
    [docIds, fieldCollectionMap, repo],
  );

  return { repo, data, isLoading, error, reload: load, saveFields };
}
