"use client";

import { useMemo, useState } from "react";
import { ID } from "appwrite";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { createDatabasesClient } from "../../lib/appwriteClient";

const supportOptions = [
  "Alumni Member",
  "Mentor for Students",
  "Industry Support / Placement",
  "CSR Support",
  "Volunteer for NGO Activities",
];

export default function RegisterNowPage() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    adress: "",
    yearJoined: "",
    company: "",
    designation: "",
    support: [],
    image: "",
  });
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const cloudinaryCloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
  const isCloudinaryConfigMissing =
    !cloudinaryCloudName || !cloudinaryUploadPreset;

  const uploadToCloudinary = async (file) => {
    if (isCloudinaryConfigMissing) {
      throw new Error(
        "Cloudinary config missing. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.",
      );
    }

    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append("upload_preset", cloudinaryUploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formDataPayload,
      },
    );

    if (!response.ok) {
      const cloudinaryError = await response.json().catch(() => ({}));
      throw new Error(
        cloudinaryError?.error?.message || "Cloudinary upload failed.",
      );
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setSubmitError("");
      setSubmitSuccess("");
      setIsImageUploading(true);

      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      setSubmitError(error?.message || "Image upload failed.");
    } finally {
      setIsImageUploading(false);
      event.target.value = "";
    }
  };

  const handleSupportToggle = (option) => {
    setFormData((prev) => {
      const alreadySelected = prev.support.includes(option);

      return {
        ...prev,
        support: alreadySelected
          ? prev.support.filter((item) => item !== option)
          : [...prev.support, option],
      };
    });
  };

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

    if (!formData.image) {
      setSubmitSuccess("");
      setSubmitError("Please upload image before submitting.");
      return;
    }

    if (!/^\d{10,12}$/.test(digitsOnlyPhone)) {
      setSubmitSuccess("");
      setSubmitError("Phone number must contain 10 to 12 digits.");
      return;
    }

    if (!(formData.support || []).length) {
      setSubmitSuccess("");
      setSubmitError("Please choose at least one support option.");
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
          image: formData.image,
          adress: formData.adress.trim(),
          yearJoined: formData.yearJoined.trim(),
          company: formData.company.trim(),
          designation: formData.designation.trim(),
          support: formData.support.join(", "),
          approved: false,
        },
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        adress: "",
        yearJoined: "",
        company: "",
        designation: "",
        support: [],
        image: "",
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
        <div className="mx-auto w-full max-w-3xl px-4 md:px-8 lg:px-10">
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
                  Profile Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] file:mr-3 file:rounded-md file:border-0 file:bg-[#eff9f1] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#1d2238]"
                />
                <p className="mt-2 text-xs text-[#5f6879]">
                  {isImageUploading
                    ? "Uploading image to Cloudinary..."
                    : formData.image
                      ? "Image uploaded successfully."
                      : "Choose an image file to upload."}
                </p>
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.adress}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      adress: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                  placeholder="Enter your address"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Year Joined *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.yearJoined}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        yearJoined: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="e.g. 2024"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="Enter company"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      designation: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                  placeholder="Enter designation"
                />
              </div>

              <fieldset className="rounded-2xl border border-slate-200 px-4 py-4">
                <legend className="px-1 text-sm font-semibold text-[#1d2238]">
                  How would you like to support the SDEAS Foundation? *
                </legend>

                <div className="mt-2 space-y-3">
                  {supportOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 text-sm text-[#1d2238]"
                    >
                      <input
                        type="checkbox"
                        checked={formData.support.includes(option)}
                        onChange={() => handleSupportToggle(option)}
                        className="h-5 w-5 rounded border-slate-300 accent-[#63c37a]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

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
                disabled={isSubmitting || isImageUploading}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#63c37a] px-6 text-base font-semibold text-white shadow-[0_10px_20px_rgba(99,195,122,0.32)] transition-colors hover:bg-[#459557] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
