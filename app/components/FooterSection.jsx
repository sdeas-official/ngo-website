import Image from "next/image";
import Link from "next/link";

const causes = [
  {
    label: "Skill Development Training",
    desc: "Equipping youth with industry-ready skills.",
    href: "/programs",
  },
  {
    label: "Youth Empowerment Workshops",
    desc: "Building confidence and leadership in communities.",
    href: "/programs",
  },
  {
    label: "CSR Community Projects",
    desc: "Collaborating with corporates for social impact.",
    href: "/partner-with-us",
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Partner With Us", href: "/partner-with-us" },
  { label: "Contact", href: "/contact" },
];

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "X (Twitter)", href: "#", Icon: XIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
];

export default function FooterSection() {
  return (
    <footer className="bg-linear-to-r from-[#121317] via-[#14161b] to-[#111216] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-12 md:px-8 md:pt-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="SDEAS Welfare Foundation"
            >
              <Image
                src="/logo.jpeg"
                alt="SDEAS Welfare Foundation"
                width={220}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-[32ch] text-sm leading-relaxed text-white/60 md:text-base">
              Empowering youth through skill development, education, industrial
              training, and community development initiatives across India.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all hover:border-[#63c37a]/60 hover:bg-[#63c37a]/15 hover:text-[#63c37a]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#63c37a] md:text-2xl">
              Contact Us
            </h3>

            <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/60 md:text-base">
              <p>Rourkela, Odisha, India</p>
              <p>+91 93486 29818</p>
              <a
                href="mailto:info@sdeasfoundation.org"
                className="block transition-colors hover:text-[#63c37a]"
              >
                info@sdeasfoundation.org
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#63c37a] md:text-2xl">
              Navigate
            </h3>

            <ul className="mt-6 space-y-2.5 text-sm text-white/60 md:text-base">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#63c37a]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Causes */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#63c37a] md:text-2xl">
              Our Causes
            </h3>

            <ul className="mt-6 space-y-5">
              {causes.map((cause) => (
                <li key={cause.label}>
                  <Link
                    href={cause.href}
                    className="block text-sm font-semibold text-white transition-colors hover:text-[#63c37a] md:text-base"
                  >
                    {cause.label}
                  </Link>
                  <p className="mt-1 text-xs text-white/40 md:text-sm">
                    {cause.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-7">
          <div className="flex flex-col items-start justify-between gap-5 text-xs text-white/40 md:flex-row md:items-center md:text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#" className="transition-colors hover:text-white">
                Privacy &amp; Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms &amp; Conditions
              </a>
            </div>
            <p>©2026 SDEAS Welfare Foundation. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
