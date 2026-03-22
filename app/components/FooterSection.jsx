import Image from "next/image";

const causes = [
  { label: "Skill Development Training", href: "/programs" },
  { label: "Youth Empowerment Workshops", href: "/programs" },
  { label: "CSR Community Projects", href: "/partner-with-us" },
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

export default function FooterSection() {
  return (
    <footer className="bg-linear-to-r from-[#121317] via-[#14161b] to-[#111216] text-white">
      <div className="mx-auto w-full max-w-350 px-4 pt-20 pb-12 md:px-8 md:pt-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          <div>
            <a
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
            </a>

            <p className="mt-8 max-w-[32ch] text-base leading-relaxed text-[#f1f1f1] md:text-lg">
              Empowering youth through skill development, education, industrial
              training, and community development initiatives.
            </p>

            <div className="mt-8 flex items-center gap-6 text-xl text-[#a5adba]">
              <a
                href="#"
                aria-label="Facebook"
                className="transition-colors hover:text-white"
              >
                f
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="transition-colors hover:text-white"
              >
                𝕏
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="transition-colors hover:text-white"
              >
                ▶
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="transition-colors hover:text-white"
              >
                in
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-[#63c37a] md:text-3xl">
              Contact us
            </h3>

            <div className="mt-8 space-y-4 text-base leading-normal text-white md:text-lg">
              <p>Rourkela, Odisha, India</p>
              <p>9348629818</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@sdeasfoundation.org"
                  className="transition-colors hover:text-[#63c37a]"
                >
                  info@sdeasfoundation.org
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-[#63c37a] md:text-3xl">
              Navigate
            </h3>

            <ul className="mt-8 space-y-3 text-base leading-relaxed text-white md:text-lg">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-[#63c37a]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-[#63c37a] md:text-3xl">
              Our Causes
            </h3>

            <ul className="mt-8 divide-y divide-white/10">
              {causes.map((cause) => (
                <li key={cause.label} className="py-5 first:pt-0 last:pb-0">
                  <a
                    href={cause.href}
                    className="block text-base leading-relaxed font-semibold text-white transition-colors hover:text-[#63c37a] md:text-lg"
                  >
                    {cause.label}
                  </a>
                  <p className="mt-1 text-sm text-[#9da6b5] md:text-base">
                    Raised: 0 of 0
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/12 pt-7">
          <div className="flex flex-col items-start justify-between gap-5 text-sm text-[#9da6b5] md:flex-row md:items-center md:text-base">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <a href="#" className="transition-colors hover:text-white">
                Privacy &amp; Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms &amp; Conditions
              </a>
            </div>

            <p>©2026 SDEAS Welfare Foundation. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
