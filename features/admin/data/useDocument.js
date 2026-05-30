"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";

// Loads / saves a single "singleton" document for a collection that holds at most
// one logical record (e.g. About, Gallery). Loads the newest document, exposes its
// editable data, and saves by update-or-create.
export function useDocument(collectionKey, { enabled = true } = {}) {
  const repo = useMemo(() => createAdminRepo(), []);
  const [documentId, setDocumentId] = useState("");
  const [data, setData] = useState({});
  // Starts true: the hook loads on mount, and consumers that hydrate a one-time
  // form from `data` must wait for the real document instead of seeding empties.
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError("");
    try {
      const docs = await repo.list(collectionKey, { limit: 1, orderDesc: "$createdAt" });
      const doc = docs[0];
      setDocumentId(doc?.$id || "");
      setData(doc ? sanitizeDocument(doc) : {});
    } catch (loadError) {
      setError(loadError?.message || "Failed to load.");
    } finally {
      setIsLoading(false);
    }
  }, [collectionKey, enabled, repo]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (payload) => {
      if (documentId) {
        await repo.update(collectionKey, documentId, payload);
      } else {
        const created = await repo.create(collectionKey, payload);
        setDocumentId(created.$id);
      }
      setData((prev) => ({ ...prev, ...payload }));
    },
    [collectionKey, documentId, repo],
  );

  return { repo, documentId, data, setData, isLoading, error, reload: load, save };
}
