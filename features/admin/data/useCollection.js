"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";

// Generic list hook for collection-style sections (blog, programs, testimonials,
// donations, inbox channels). Loads documents once, exposes loading/error state,
// and provides client-side search/sort plus optimistic local mutation helpers so
// screens don't refetch the whole collection after every change.
export function useCollection(collectionKey, options = {}) {
  const {
    limit = 100,
    orderDesc,
    sortFn,
    searchFields = [],
    enabled = true,
  } = options;

  const repo = useMemo(() => createAdminRepo(), []);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError("");
    try {
      const docs = await repo.list(collectionKey, { limit, orderDesc });
      setDocuments(sortFn ? sortFn(docs) : docs);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load.");
    } finally {
      setIsLoading(false);
    }
  }, [collectionKey, enabled, limit, orderDesc, repo, sortFn]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim() || !searchFields.length) return documents;
    const needle = search.trim().toLowerCase();
    return documents.filter((doc) =>
      searchFields.some((field) =>
        String(doc?.[field] ?? "")
          .toLowerCase()
          .includes(needle),
      ),
    );
  }, [documents, search, searchFields]);

  // Local mutation helpers keep the list in sync without a network round-trip.
  const upsertLocal = useCallback(
    (doc) => {
      setDocuments((prev) => {
        const exists = prev.some((d) => d.$id === doc.$id);
        const next = exists
          ? prev.map((d) => (d.$id === doc.$id ? { ...d, ...doc } : d))
          : [doc, ...prev];
        return sortFn ? sortFn(next) : next;
      });
    },
    [sortFn],
  );

  const removeLocal = useCallback((id) => {
    setDocuments((prev) => prev.filter((d) => d.$id !== id));
  }, []);

  return {
    repo,
    documents: filtered,
    rawDocuments: documents,
    isLoading,
    error,
    search,
    setSearch,
    reload: load,
    upsertLocal,
    removeLocal,
  };
}
