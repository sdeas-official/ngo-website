"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { DonationCard } from "../components/DonationCard";
import { Button } from "../components/Button";

export default function PartnerWithUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    availability: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you for your interest! We will contact you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      skills: "",
      availability: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] items-center md:min-h-[62vh]">
          <img
            src="https://images.unsplash.com/photo-1728584388081-819a78aa30ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
            alt="Partner with us"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d73]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Partner With Us
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Be Part of the Change
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Support our mission through donations, volunteering, and strategic
              partnerships that transform lives.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Support Our Mission
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Choose Your Impact
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Your donation directly creates opportunities in skills,
              healthcare, and livelihood development.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <DonationCard
              amount="1,000"
              title="Training Support"
              description="Support training materials"
              features={[
                "Study materials for 5 students",
                "Basic training equipment",
                "Digital resources access",
              ]}
            />
            <DonationCard
              amount="5,000"
              title="Sponsor a Student"
              description="Complete training sponsorship"
              features={[
                "Full course materials",
                "Practical sessions",
                "Placement assistance",
                "Certificate issuance",
              ]}
              highlighted
            />
            <DonationCard
              amount="25,000"
              title="Skill Development Batch"
              description="Sponsor an entire training batch"
              features={[
                "Training for 20 students",
                "Complete course duration",
                "Job placement support",
                "Success tracking",
              ]}
            />
            <DonationCard
              amount="1,00,000"
              title="Community Project"
              description="Fund a complete initiative"
              features={[
                "Healthcare camp for 500+ people",
                "Infrastructure development",
                "Sustainable impact",
                "Progress reporting",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
          <div>
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Volunteer With Us
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Become a Volunteer
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              Join our passionate team making a measurable difference in
              communities. Whether you have a few hours a week or can support
              long-term, there is a role for you.
            </p>

            <div className="mt-7 space-y-4">
              {[
                {
                  title: "Training Assistants",
                  desc: "Help facilitate workshops and provide mentorship to students.",
                },
                {
                  title: "Community Coordinators",
                  desc: "Assist in organizing field activities and healthcare camps.",
                },
                {
                  title: "Administrative Support",
                  desc: "Support documentation, communication, and coordination.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]"
                >
                  <h4 className="font-semibold text-[#1d2238]">{item.title}</h4>
                  <p className="mt-1.5 text-sm text-[#5f6879]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-[#63c37a1f] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.08)] md:p-8">
              <h3 className="font-serif text-3xl font-bold text-[#1d2238]">
                Volunteer Application
              </h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
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
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Skills & Expertise
                  </label>
                  <textarea
                    rows={3}
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                    placeholder="Tell us about your skills..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1d2238]">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[#1d2238] outline-none focus:border-[#63c37a]"
                  >
                    <option value="">Select availability</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="flexible">Flexible</option>
                    <option value="full-time">Full-time</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#63c37a] px-8 text-base font-bold text-white transition-colors hover:bg-[#459557]"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#63c37a] md:text-2xl">
              Our Network
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Partners & Sponsors
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              We collaborate with leading organizations to maximize impact and
              scale social outcomes.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "Industry Partners",
              "CSR Foundations",
              "Educational Institutions",
              "Government Bodies",
            ].map((item) => (
              <div
                key={item}
                className="flex min-h-28 items-center justify-center rounded-2xl border border-[#63c37a1f] bg-[#f7fdf8] px-4 text-center"
              >
                <h4 className="font-semibold text-[#5f6879]">{item}</h4>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-[#63c37a] p-8 text-center text-white md:p-12">
            <h3 className="font-serif text-3xl font-bold md:text-5xl">
              Interested in Partnership?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 md:text-lg">
              Join us as a corporate partner, CSR sponsor, or collaborating
              organization. Let&apos;s create meaningful impact together.
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="min-w-52"
              >
                Discuss Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
