"use client";

import { useMemo, useState } from "react";
import { ID } from "appwrite";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { createDatabasesClient } from "../../lib/appwriteClient";
import { useContactContent, useSiteSettings } from "@/lib/useSiteContent";

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

// Render a string with "\n" line breaks as separate lines.
function MultiLine({ text }) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export default function Contact() {
  const { databases, config } = useMemo(() => createDatabasesClient(), []);
  const content = useContactContent();
  const settings = useSiteSettings();

  const socials = Object.entries(settings.socialLinks || {})
    .filter(([key, url]) => SOCIAL_ICONS[key] && url)
    .map(([key, url]) => ({ Icon: SOCIAL_ICONS[key], url, key }));

  // The map always renders: use the admin-provided embed URL if present,
  // otherwise build a keyless Google Maps embed from the address.
  const mapQuery = (content.mapAddress || settings.contactAddress || "Rourkela, Odisha, India").trim();
  const mapSrc = (content.mapEmbedUrl || "").trim()
    ? content.mapEmbedUrl.trim()
    : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!databases || !config.databaseId || !config.collections.responses) {
      setSubmitSuccess("");
      setSubmitError(
        "Contact form is not configured yet. Add NEXT_PUBLIC_APPWRITE_COLLECTION_CONTACT_ID in your .env.",
      );
      return;
    }

    const digitsOnlyPhone = (formData.phone || "").replace(/\D/g, "");
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
        config.collections.responses,
        ID.unique(),
        {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phoneNo: Number(digitsOnlyPhone),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitSuccess("Thank you! Your response has been submitted.");
    } catch (error) {
      setSubmitError(error?.message || "Failed to submit your response.");
      setSubmitSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] items-center md:min-h-[62vh]">
          <img
            src={content.heroImage}
            alt="Contact us"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d73]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              {content.heroEyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              {content.heroHeading}
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-3 lg:gap-10 lg:px-10">
          <aside className="space-y-6 lg:col-span-1">
            <div>
              <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
                {content.asideEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
                {content.asideHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5f6879]">
                {content.asideText}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[#63c37a1f] bg-[#f7fdf8] p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#63c37a1f] text-[#63c37a]">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-[#1d2238]">
                      {content.officesTitle}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5f6879]">
                      <MultiLine text={content.officesAddress} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#63c37a1f] bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#63c37a1f] text-[#63c37a]">
                    <Mail size={20} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-[#1d2238]">
                      {content.emailTitle}
                    </h4>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="mt-1.5 inline-block text-sm text-[#63c37a] hover:text-[#459557]"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#63c37a1f] bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#63c37a1f] text-[#63c37a]">
                    <Phone size={20} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-[#1d2238]">
                      {content.phoneTitle}
                    </h4>
                    <a
                      href={`tel:${(settings.contactPhone || "").replace(/\s/g, "")}`}
                      className="mt-1.5 inline-block text-sm text-[#5f6879] hover:text-[#459557]"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#63c37a1f] bg-[#f0fdf4] p-5">
              <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                {content.hoursTitle}
              </h4>
              <div className="mt-4 space-y-4 text-sm text-[#5f6879]">
                <div>
                  <p className="font-semibold text-[#1d2238]">
                    {content.weekdaysLabel}
                  </p>
                  <p className="mt-1">
                    <MultiLine text={content.weekdaysText} />
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#1d2238]">
                    {content.weekendsLabel}
                  </p>
                  <p className="mt-1">
                    <MultiLine text={content.weekendsText} />
                  </p>
                </div>
              </div>
            </div>

            {socials.length ? (
              <div>
                <h4 className="mb-3 font-semibold text-[#1d2238]">
                  {content.followLabel}
                </h4>
                <div className="flex gap-2.5">
                  {socials.map(({ Icon, url, key }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#576076] transition-colors hover:bg-[#63c37a] hover:text-white"
                      aria-label={key}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#63c37a1f] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.08)] md:p-8">
              <h3 className="font-serif text-3xl font-bold text-[#1d2238] md:text-4xl">
                {content.formHeading}
              </h3>
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 12),
                        })
                      }
                      pattern="[0-9]{10,12}"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                      placeholder="10 to 12 digit number"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    >
                      <option value="">Select a subject</option>
                      <option value="program-inquiry">Program Inquiry</option>
                      <option value="volunteer">Volunteer Opportunity</option>
                      <option value="partnership">Partnership</option>
                      <option value="donation">Donation Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="flex justify-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557]"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {submitError && (
                  <p className="text-sm font-medium text-rose-600">
                    {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <p className="text-sm font-medium text-emerald-700">
                    {submitSuccess}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              {content.mapEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              {content.mapHeading}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Map */}
            <div className="relative overflow-hidden rounded-3xl border border-[#63c37a1f] shadow-[0_12px_36px_rgba(17,24,39,0.12)] lg:col-span-2">
              <iframe
                src={mapSrc}
                title="Office location map"
                className="h-72 w-full sm:h-80 lg:h-full lg:min-h-[26rem]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Address / directions card */}
            <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#14532d] to-[#1f7a44] p-7 text-white md:p-8">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <MapPin size={24} />
                </span>
                <h3 className="mt-5 font-serif text-2xl font-bold md:text-3xl">
                  {content.officesTitle}
                </h3>
                <p className="mt-3 leading-relaxed text-white/85">
                  <MultiLine text={content.mapAddress} />
                </p>

                <div className="mt-6 space-y-3 border-t border-white/15 pt-6 text-sm text-white/90">
                  {settings.contactPhone ? (
                    <a
                      href={`tel:${(settings.contactPhone || "").replace(/\s/g, "")}`}
                      className="flex items-center gap-3 transition-colors hover:text-white"
                    >
                      <Phone size={16} className="shrink-0 text-[#a7f3c0]" />
                      {settings.contactPhone}
                    </a>
                  ) : null}
                  {settings.contactEmail ? (
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="flex items-center gap-3 transition-colors hover:text-white"
                    >
                      <Mail size={16} className="shrink-0 text-[#a7f3c0]" />
                      {settings.contactEmail}
                    </a>
                  ) : null}
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#14532d] transition-colors hover:bg-[#dcfce7]"
              >
                <MapPin size={16} /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
