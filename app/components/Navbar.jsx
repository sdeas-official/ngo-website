"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  "Home",
  "About",
  "Programs",
  "Gallery",
  "Partner With Us",
  "Contact",
];

function getHref(item) {
  if (item === "Home") return "/";
  if (item === "About") return "/about";
  if (item === "Programs") return "/programs";
  if (item === "Gallery") return "/gallery";
  if (item === "Partner With Us") return "/partner-with-us";
  if (item === "Contact") return "/contact";
  return "#";
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="relative flex h-20 w-full items-center justify-between px-4 md:h-24 md:px-8 lg:px-10">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="SDEAS Welfare Foundation Home"
        >
          <Image
            src="/logo.jpeg"
            alt="SDEAS Welfare Foundation"
            width={220}
            height={56}
            priority
            className="h-10 w-auto object-contain md:h-14"
          />
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-base font-medium text-[#576076] xl:flex">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href={getHref(item)}
                className="transition-colors hover:text-[#171a34]"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#63c37a] text-white shadow-[0_6px_18px_rgba(99,195,122,0.35)] transition-colors hover:bg-[#459557] xl:hidden"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden items-center justify-end pl-3 md:pl-8 xl:flex">
          <a
            href="#"
            className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-sm border border-[#63c37a] px-4 text-sm font-semibold transition-colors md:h-14 md:gap-2 md:px-8 md:text-lg ${
              isScrolled
                ? "bg-[#63c37a] text-[#ffffff] hover:bg-transparent hover:text-[#63c37a]"
                : "bg-transparent text-[#63c37a] hover:bg-[#63c37a] hover:text-[#ffffff]"
            }`}
          >
            <span className="text-sm">❤</span>
            Donate
          </a>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-sm xl:hidden">
          <ul className="space-y-3 text-base font-medium text-[#576076]">
            {navItems.map((item) => (
              <li key={`mobile-${item}`}>
                <a
                  href={getHref(item)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-fit transition-colors hover:text-[#171a34]"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
