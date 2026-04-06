"use client";

import { useEffect, useMemo, useState } from "react";
import { ID, Query } from "appwrite";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { createDatabasesClient } from "../../lib/appwriteClient";

function mapApprovedRegistrations(docs) {
  return (docs || [])
    .map((doc) => {
      const firstName = typeof doc.firstName === "string" ? doc.firstName : "";
      const lastName = typeof doc.lastName === "string" ? doc.lastName : "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (!fullName) {
        return null;
      }

      return {
        id: doc.$id,
        fullName,
      };
    })
    .filter(Boolean);
}

export default function RegisterNowPage() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [approvedRegistrations, setApprovedRegistrations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingApproved, setIsLoadingApproved] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [approvedLoadError, setApprovedLoadError] = useState("");

  useEffect(() => {
    const loadApprovedRegistrations = async () => {
      const registrationCollectionId = config.collections.registrations;

      if (!databases || !config.databaseId || !registrationCollectionId) {
        setIsLoadingApproved(false);
        return;
      }

      try {
        setApprovedLoadError("");

        const result = await databases.listDocuments(
          config.databaseId,
          registrationCollectionId,
          [
            Query.equal("approved", [true]),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ],
        );

        setApprovedRegistrations(mapApprovedRegistrations(result.documents));
      } catch (error) {
        setApprovedRegistrations([]);
        setApprovedLoadError(
          error?.message ||
            "Could not load approved registrations. Ensure your collection has an approved boolean field.",
        );
      } finally {
        setIsLoadingApproved(false);
      }
    };

    loadApprovedRegistrations();
  }, [config.collections.registrations, config.databaseId, databases]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const registrationCollectionId = config.collections.registrations;

    if (!databases || !config.databaseId || !registrationCollectionId) {
      setSubmitSuccess("");
      setSubmitError(
        "Registration form is not configured yet. Add NEXT_PUBLIC_APPWRITE_COLLECTION_REGISTRATION_ID in your .env.",
      );
      return;
    }

    const digitsOnlyPhone = (formData.phoneNumber || "").replace(/\D/g, "");
    if (!/^\d{10,12}$/.test(digitsOnlyPhone)) {
      setSubmitSuccess("");
      setSubmitError("Phone number must contain 10 to 12 digits.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      await databases.createDocument(
        config.databaseId,
        registrationCollectionId,
        ID.unique(),
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phoneNumber: digitsOnlyPhone,
          approved: false,
        },
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
      setSubmitSuccess("Registration request sent. Wait for approval.");
    } catch (error) {
      setSubmitSuccess("");
      setSubmitError(
        error?.message ||
          "Failed to submit registration. Ensure the collection has firstName, lastName, email, phoneNumber, and approved fields.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-linear-to-b from-[#f2fbf4] via-white to-[#edf7ef] py-16 md:py-20">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#4a945c] uppercase">
            Register Now
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-[#1d2238] md:text-6xl">
            Start Your Registration
          </h1>
          <p className="mt-5 max-w-3xl text-base text-[#5f6879] md:text-xl">
            Fill in your details and our admin team will review your request.
            Your profile appears on the website only after approval.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-10 lg:px-10">
          <div className="rounded-3xl border border-[#63c37a1f] bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.08)] md:p-8">
            <h2 className="font-serif text-3xl font-bold text-[#1d2238] md:text-4xl">
              Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                  placeholder="10 to 12 digits"
                />
              </div>

              {submitError && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {submitSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#63c37a] px-6 text-base font-semibold text-white shadow-[0_10px_20px_rgba(99,195,122,0.32)] transition-colors hover:bg-[#459557] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </button>
            </form>
          </div>

          <aside className="rounded-3xl border border-[#63c37a1f] bg-[#f7fdf8] p-6 md:p-8">
            <h3 className="font-serif text-3xl font-bold text-[#1d2238] md:text-4xl">
              Approved Registrations
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5f6879]">
              These are profiles that have already been reviewed and approved by
              admin.
            </p>

            {approvedLoadError && (
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {approvedLoadError}
              </div>
            )}

            <div className="mt-6 space-y-2">
              {isLoadingApproved ? (
                <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                  Loading approved list...
                </div>
              ) : approvedRegistrations.length ? (
                approvedRegistrations.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-[#dfe8df] bg-white px-4 py-3 text-sm font-semibold text-[#1d2238]"
                  >
                    {entry.fullName}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cfd9d3] bg-white px-4 py-6 text-sm text-[#5f6879]">
                  No approved registrations yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
