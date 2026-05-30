"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { isRegistrationApproved } from "@/features/admin/utils/registrations";

const CountsContext = createContext(null);

// Fetches lightweight counts for sidebar badges + the dashboard "needs attention"
// cards. Loads once on mount; screens can call refresh() after mutations.
export function AdminCountsProvider({ children }) {
  const repo = useMemo(() => createAdminRepo(), []);
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!repo.isReady) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const next = {};
    const safe = async (key, fn) => {
      try {
        next[key] = await fn();
      } catch {
        next[key] = undefined;
      }
    };

    await Promise.all([
      safe("blog", async () => (await repo.list("blog", { limit: 100 })).length),
      safe("programs", async () => (await repo.list("programs", { limit: 100 })).length),
      safe("testimonials", async () => (await repo.list("testimonials", { limit: 100 })).length),
      safe("donations", async () => (await repo.list("partnerDonations", { limit: 100 })).length),
      safe("team", async () => (await repo.list("teamMembers", { limit: 100 })).length),
      safe("contact", async () => (await repo.list("responses", { limit: 100 })).length),
      safe("registrationsAll", async () => {
        const docs = await repo.list("registrations", { limit: 100 });
        next.registrationsPending = docs.filter((d) => !isRegistrationApproved(d)).length;
        return docs.length;
      }),
    ]);

    setCounts(next);
    setIsLoading(false);
  }, [repo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CountsContext.Provider value={{ counts, isLoading, refresh }}>
      {children}
    </CountsContext.Provider>
  );
}

export function useAdminCounts() {
  const ctx = useContext(CountsContext);
  if (!ctx) return { counts: {}, isLoading: false, refresh: () => {} };
  return ctx;
}
