"use client";

import { useState } from "react";
import Link from "next/link";

const nurseLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/nurse-signup", label: "Create Profile" },
];

const employerLinks = [
  { href: "/employer-signup", label: "Post Jobs" },
  { href: "/employer-dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"nurses" | "employers">("nurses");

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-periwinkle-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-periwinkle-dark">Flor</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {nurseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-gray-200 mx-2" />

            {employerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="ml-3">
              <Link
                href="/nurse-signup"
                className="bg-periwinkle text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-periwinkle-dark transition-colors"
              >
                I&apos;m a nurse
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-periwinkle-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-periwinkle-100 mt-2 pt-3">
            {/* Tabs */}
            <div className="flex bg-periwinkle-50 rounded-xl p-1 mb-3">
              <button
                onClick={() => setTab("nurses")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === "nurses" ? "bg-white text-periwinkle shadow-sm" : "text-text-light"}`}
              >
                Nurses
              </button>
              <button
                onClick={() => setTab("employers")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === "employers" ? "bg-white text-periwinkle shadow-sm" : "text-text-light"}`}
              >
                Employers
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {(tab === "nurses" ? nurseLinks : employerLinks).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-base font-medium text-text-light hover:text-periwinkle hover:bg-periwinkle-50 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {tab === "nurses" && (
                <Link
                  href="/nurse-signup"
                  className="mt-2 bg-periwinkle text-white px-4 py-3 rounded-full text-base font-semibold text-center hover:bg-periwinkle-dark transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Create nurse profile
                </Link>
              )}
              {tab === "employers" && (
                <Link
                  href="/employer-signup"
                  className="mt-2 bg-periwinkle text-white px-4 py-3 rounded-full text-base font-semibold text-center hover:bg-periwinkle-dark transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Create employer account
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
