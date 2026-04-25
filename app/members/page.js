"use client";

import { useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { createDatabasesClient } from "../../lib/appwriteClient";

function mapMemberRecords(docs) {
  return (docs || [])
    .map((doc) => {
      const firstName =
        typeof doc.firstName === "string" ? doc.firstName.trim() : "";
      const lastName =
        typeof doc.lastName === "string" ? doc.lastName.trim() : "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (!fullName) return null;

      return {
        id: doc.$id,
        fullName,
        image: typeof doc.image === "string" ? doc.image.trim() : "",
        adress: typeof doc.adress === "string" ? doc.adress.trim() : "",
        yearJoined:
          typeof doc.yearJoined === "string" ? doc.yearJoined.trim() : "",
        company: typeof doc.company === "string" ? doc.company.trim() : "",
        designation:
          typeof doc.designation === "string" ? doc.designation.trim() : "",
        support: typeof doc.support === "string" ? doc.support.trim() : "",
        email: typeof doc.email === "string" ? doc.email.trim() : "",
        phoneNumber:
          typeof doc.phoneNumber === "string"
            ? doc.phoneNumber.trim()
            : typeof doc.phoneNumber === "number"
              ? String(doc.phoneNumber)
              : "",
        createdAt: doc.$createdAt || "",
      };
    })
    .filter(Boolean);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "from-[#63c37a] to-[#3da85a]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#f59e0b] to-[#b45309]",
  "from-[#8b5cf6] to-[#6d28d9]",
  "from-[#ec4899] to-[#be185d]",
  "from-[#14b8a6] to-[#0f766e]",
];

function MemberCard({ member, colorIndex }) {
  const initials = getInitials(member.fullName);
  const gradient = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8f0ea] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Photo / Avatar */}
      <div className="relative h-52 w-full overflow-hidden bg-[#f1f5f2]">
        {member.image ? (
          <img
            src={member.image}
            alt={member.fullName}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}
          >
            <span className="select-none font-serif text-5xl font-bold text-white/90">
              {initials}
            </span>
          </div>
        )}
        {/* Green top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#63c37a]" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name + designation */}
        <div>
          <h3 className="text-lg font-bold leading-snug text-[#1d2238]">
            {member.fullName}
          </h3>

          {(member.designation || member.company) && (
            <p className="mt-1 text-sm font-medium text-[#63c37a]">
              {[member.designation, member.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Meta row — location + year */}
        {(member.adress || member.yearJoined) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94a3b8]">
            {member.adress && (
              <span className="inline-flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {member.adress}
              </span>
            )}
            {member.yearJoined && (
              <span className="inline-flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 shrink-0"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Joined {member.yearJoined}
              </span>
            )}
          </div>
        )}

        {/* Support badge */}
        {member.support && (
          <div className="mt-3">
            <span className="inline-block rounded-full bg-[#f0faf3] px-3 py-1 text-xs font-semibold text-[#3da85a]">
              {member.support}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-[#f1f5f2]" />

        {/* Contact */}
        <div className="mt-4 space-y-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-xs text-[#5f6879] transition-colors hover:text-[#63c37a]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 shrink-0 text-[#63c37a]"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="truncate">{member.email}</span>
            </a>
          )}
          {member.phoneNumber && (
            <a
              href={`tel:${member.phoneNumber}`}
              className="flex items-center gap-2 text-xs text-[#5f6879] transition-colors hover:text-[#63c37a]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 shrink-0 text-[#63c37a]"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
              </svg>
              <span>{member.phoneNumber}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8f0ea] bg-white shadow-sm">
      <div className="h-52 w-full animate-pulse bg-[#f1f5f2]" />
      <div className="p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-[#f1f5f2]" />
        <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded-full bg-[#f1f5f2]" />
        <div className="mt-4 h-px w-full bg-[#f1f5f2]" />
        <div className="mt-4 h-3 w-2/3 animate-pulse rounded-full bg-[#f1f5f2]" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-[#f1f5f2]" />
      </div>
    </div>
  );
}

export default function MembersPage() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      const registrationCollectionId = config.collections.registrations;

      if (!databases || !config.databaseId || !registrationCollectionId) {
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        const result = await databases.listDocuments(
          config.databaseId,
          registrationCollectionId,
          [
            Query.equal("approved", [true]),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ],
        );

        setMembers(mapMemberRecords(result.documents));
      } catch (requestError) {
        setMembers([]);
        setError(
          requestError?.message ||
            "Could not load members. Make sure the registrations collection has a boolean approved field.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [config.collections.registrations, config.databaseId, databases]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-[#f2fbf4] to-white py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#63c37a]/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-[#63c37a]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#63c37a]/30 bg-white px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#3da85a] uppercase shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#63c37a]" />
            Our Community
          </span>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl font-extrabold leading-tight text-[#1d2238] md:text-6xl">
            Meet Our Members
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5f6879] md:text-lg">
            Dedicated individuals who believe in our mission to empower youth
            and build stronger communities across India.
          </p>
        </div>
      </section>

      {/* Members grid */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-10">
          {error && (
            <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : members.length ? (
            <>
              <p className="mb-8 text-sm font-medium text-[#94a3b8]">
                {members.length} approved member{members.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member, i) => (
                  <MemberCard key={member.id} member={member} colorIndex={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#cfd9d3] bg-[#f8faf8] py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0faf3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#63c37a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="mt-4 text-base font-semibold text-[#1d2238]">
                No approved members yet
              </p>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Members will appear here once approved by admin.
              </p>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
