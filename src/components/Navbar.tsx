"use client";

import { useState } from "react";
import Link from "next/link";
import FlorLogo from "@/components/FlorLogo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/nurse-profile", label: "My Profile" },
    { href: "/tracker", label: "Applications" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-periwinkle-100/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <FlorLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-xl hover:bg-periwinkle-50/50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-periwinkle-100/50">
              <Link
                href="/nurse-profile"
                className="bg-periwinkle hover:bg-periwinkle-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-periwinkle/15 hover:shadow-md hover:shadow-periwinkle/25"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-periwinkle-50/50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
          <div className="md:hidden pb-5 border-t border-periwinkle-100/50 mt-1 pt-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-base font-medium text-text-light hover:text-periwinkle hover:bg-periwinkle-50/50 rounded-xl transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/nurse-profile"
                className="mt-3 bg-periwinkle text-white px-4 py-3.5 rounded-xl text-base font-semibold text-center hover:bg-periwinkle-dark transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
