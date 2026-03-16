"use client";

import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] items-center md:min-h-[62vh]">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
            alt="Contact us"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d73]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Contact Us
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Let&apos;s Build Impact Together
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Have questions about our programs, volunteering, CSR partnerships,
              or training opportunities? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-3 lg:gap-10 lg:px-10">
          <aside className="space-y-6 lg:col-span-1">
            <div>
              <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
                Get In Touch
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
                We&apos;re Here to Help
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5f6879]">
                Reach out for admissions, partnerships, volunteering, and all
                other collaboration opportunities.
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
                      Our Offices
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5f6879]">
                      A-547 Koel Nagar, Rourkela
                      <br />
                      B-5 Sector 20, Rourkela
                      <br />
                      Odisha, India
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
                    <h4 className="font-semibold text-[#1d2238]">Email Us</h4>
                    <a
                      href="mailto:info@sdeasfoundation.org"
                      className="mt-1.5 inline-block text-sm text-[#63c37a] hover:text-[#459557]"
                    >
                      info@sdeasfoundation.org
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
                    <h4 className="font-semibold text-[#1d2238]">Call Us</h4>
                    <p className="mt-1.5 text-sm text-[#5f6879]">
                      +91 93486 29818
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#63c37a1f] bg-[#f0fdf4] p-5">
              <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                Office Hours
              </h4>
              <div className="mt-4 space-y-4 text-sm text-[#5f6879]">
                <div>
                  <p className="font-semibold text-[#1d2238]">Weekdays</p>
                  <p className="mt-1">
                    Monday - Friday
                    <br />
                    9:00 AM - 6:00 PM
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#1d2238]">Weekends</p>
                  <p className="mt-1">
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Closed on Sundays
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold text-[#1d2238]">Follow Us</h4>
              <div className="flex gap-2.5">
                {[Facebook, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                  <a
                    key={`social-${idx}`}
                    href="#"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#576076] transition-colors hover:bg-[#63c37a] hover:text-white"
                    aria-label="social link"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#63c37a1f] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.08)] md:p-8">
              <h3 className="font-serif text-3xl font-bold text-[#1d2238] md:text-4xl">
                Send us a Message
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
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                      placeholder="+91 XXXXX XXXXX"
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
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557]"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Find Us
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Visit Our Office
            </h2>
          </div>

          <div className="mt-8 flex h-80 items-center justify-center rounded-3xl border border-[#63c37a1f] bg-white text-center shadow-[0_8px_24px_rgba(17,24,39,0.08)] md:h-96">
            <div className="px-4">
              <MapPin className="mx-auto mb-4 text-[#63c37a]" size={44} />
              <h3 className="font-serif text-3xl font-bold text-[#1d2238]">
                Location Map
              </h3>
              <p className="mt-3 text-[#5f6879]">
                A-547 Koel Nagar, Rourkela, Odisha
                <br />
                Interactive map integration can be added here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
