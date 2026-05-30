"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminRepo } from "@/features/admin/data/appwriteRepo";
import { sanitizeDocument } from "@/features/admin/utils/sanitizeDocument";

// The legacy "about" collection denormalizes page-level fields (Story/Mission/
// Vision) onto EVERY team-member row. This hook preserves that exact write
// contract while exposing a clean { page, members } shape to the UI:
//   - page fields are read from the first record
//   - members are read from every record's member fields
//   - saving rewrites all rows as { ...pageBase, ...member }, creating/updating/
//     deleting rows to match the member count (mirrors the old getAboutPayloads).

const PAGE_KEYS = [
  "OurStoryImage",
  "OurMissionImage",
  "OurVisionImage",
  "OurStoryText",
  "OurMissionText",
  "OurVisionText",
];

const emptyMember = () => ({ MembersImage: "", MemberPosition: "", MemberDescription: "" });
const str = (v) => (typeof v === "string" ? v : "");

export function useAboutDocument() {
  const repo = useMemo(() => createAdminRepo(), []);
  const [recordIds, setRecordIds] = useState([]);
  const [page, setPage] = useState(() =>
    PAGE_KEYS.reduce((acc, k) => ({ ...acc, [k]: "" }), {}),
  );
  const [members, setMembers] = useState([emptyMember()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const docs = await repo.list("about", { limit: 100 });
      const first = docs[0] ? sanitizeDocument(docs[0]) : {};
      setRecordIds(docs.map((d) => d.$id));
      setPage(PAGE_KEYS.reduce((acc, k) => ({ ...acc, [k]: str(first[k]) }), {}));

      const mapped = docs
        .map((d) => sanitizeDocument(d))
        .map((d) => ({
          MembersImage: str(d.MembersImage),
          MemberPosition: str(d.MemberPosition),
          MemberDescription: str(d.MemberDescription),
        }));
      setMembers(mapped.length ? mapped : [emptyMember()]);
    } catch (e) {
      setError(e?.message || "Failed to load About content.");
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    load();
  }, [load]);

  // Reconcile all rows to { ...pageBase, ...member } — same algorithm the legacy
  // panel used in non-replace mode.
  const save = useCallback(
    async (nextPage, nextMembers) => {
      const base = PAGE_KEYS.reduce((acc, k) => ({ ...acc, [k]: nextPage[k] || "" }), {});

      const cleaned = (nextMembers || [])
        .map((m) => ({
          MembersImage: str(m?.MembersImage).trim(),
          MemberPosition: str(m?.MemberPosition).trim(),
          MemberDescription: str(m?.MemberDescription).trim(),
        }))
        .filter((m) => m.MembersImage || m.MemberPosition || m.MemberDescription);

      const payloads = cleaned.length ? cleaned.map((m) => ({ ...base, ...m })) : [{ ...base, ...emptyMember() }];

      const nextIds = [...recordIds];
      for (let i = 0; i < payloads.length; i += 1) {
        if (nextIds[i]) {
          await repo.update("about", nextIds[i], payloads[i]);
        } else {
          const created = await repo.create("about", payloads[i]);
          nextIds[i] = created.$id;
        }
      }
      if (nextIds.length > payloads.length) {
        const extra = nextIds.slice(payloads.length);
        await Promise.all(extra.map((id) => repo.remove("about", id)));
        nextIds.splice(payloads.length);
      }

      setRecordIds(nextIds);
      setPage(base);
      setMembers(cleaned.length ? cleaned : [emptyMember()]);
    },
    [recordIds, repo],
  );

  return { page, members, isLoading, error, reload: load, save };
}
