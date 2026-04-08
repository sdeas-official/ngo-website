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

      if (!fullName) {
        return null;
      }

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

      <section className="relative isolate overflow-hidden bg-linear-to-b from-[#f2fbf4] via-white to-[#edf7ef] py-16 md:py-20">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#4a945c] uppercase">
            Members
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-[#1d2238] md:text-6xl">
            Approved Members
          </h1>
          <p className="mt-5 max-w-3xl text-base text-[#5f6879] md:text-xl">
            These are the registrations that have been approved by admin and are
            now visible on the website.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          {error && (
            <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-[#cfd9d3] bg-white px-4 py-8 text-sm text-[#5f6879]">
              Loading members...
            </div>
          ) : members.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="rounded-3xl border border-[#63c37a1f] bg-white p-5 shadow-[0_12px_30px_rgba(17,24,39,0.08)]"
                >
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.fullName}
                      className="h-44 w-full rounded-2xl object-cover"
                    />
                  )}

                  <p className="text-lg font-bold text-[#1d2238]">
                    {member.fullName}
                  </p>

                  {(member.designation || member.company) && (
                    <p className="mt-1 text-sm font-medium text-[#1d2238]">
                      {[member.designation, member.company]
                        .filter(Boolean)
                        .join(" at ")}
                    </p>
                  )}

                  {(member.adress || member.yearJoined) && (
                    <p className="mt-1 text-sm text-[#5f6879]">
                      {[
                        member.adress,
                        member.yearJoined && `Joined ${member.yearJoined}`,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}

                  {member.support && (
                    <p className="mt-2 rounded-xl bg-[#f3faf5] px-3 py-2 text-xs font-medium text-[#2f6f3f]">
                      Supports: {member.support}
                    </p>
                  )}

                  {member.email && (
                    <p className="mt-2 text-sm text-[#5f6879]">
                      {member.email}
                    </p>
                  )}
                  {member.phoneNumber && (
                    <p className="mt-1 text-sm text-[#5f6879]">
                      {member.phoneNumber}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#cfd9d3] bg-white px-4 py-8 text-sm text-[#5f6879]">
              No approved members yet.
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
