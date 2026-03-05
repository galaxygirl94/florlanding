"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/nurse-profile", label: "My Profile" },
    { href: "/tracker", label: "Applications" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1E1E2E]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10"
          : "bg-[#1E1E2E]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Image
              src="/flor-logo.jpg"
              alt="Flor"
              width={28}
              height={34}
              className="object-contain"
              priority
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              fl<span className="text-periwinkle-light">o</span>r
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-white/70 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-white/15">
              <Link
                href="/nurse-profile"
                className="bg-periwinkle hover:bg-periwinkle-light text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-sm shadow-periwinkle/30 hover:shadow-md hover:shadow-periwinkle/40 hover:-translate-y-px"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-white/10 mt-1 pt-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3.5 text-base font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/nurse-profile"
                className="mt-4 bg-periwinkle text-white px-4 py-3.5 rounded-full text-base font-bold text-center hover:bg-periwinkle-light transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
