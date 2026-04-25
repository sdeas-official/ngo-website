"use client";

const stats = [
  { number: "4,000+", label: "Youth Trained" },
  { number: "50+", label: "Programs Delivered" },
  { number: "5+", label: "Years of Impact" },
  { number: "3+", label: "States Covered" },
];

export default function GetInTouchSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#1d2238] py-20 md:py-28">
      {/* Subtle background decoration */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-48 -top-48 h-125 w-125 rounded-full bg-[#63c37a]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#63c37a]/8 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cta-dots"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#63c37a]/40 bg-[#63c37a]/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#a3e4b0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#63c37a]" />
          Make a Difference
        </span>

        <h2 className="mt-6 font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Ready to Change a Life?
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          Every contribution, partnership, or volunteer hour helps us reach more
          youth, deliver better training, and build stronger communities across
          India.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/partner-with-us"
            className="inline-flex h-14 min-w-44 items-center justify-center rounded-full bg-[#63c37a] px-10 text-base font-bold text-white shadow-[0_8px_28px_rgba(99,195,122,0.35)] transition-all hover:bg-[#459557] hover:shadow-[0_12px_36px_rgba(99,195,122,0.45)]"
          >
            Donate Now
          </a>
          <a
            href="/register-now"
            className="inline-flex h-14 min-w-44 items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-base font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
          >
            Volunteer
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative mx-auto mt-16 max-w-4xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1d2238] px-6 py-8 text-center"
            >
              <p className="text-3xl font-extrabold text-[#63c37a] md:text-4xl">
                {stat.number}
              </p>
              <p className="mt-2 text-sm font-medium text-white/50 md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
