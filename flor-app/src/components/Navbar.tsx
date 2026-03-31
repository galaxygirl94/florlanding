"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-periwinkle-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-periwinkle-dark">Flor</span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/jobs" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Find Jobs
            </Link>
            <Link href="/community" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Community
            </Link>
            <Link href="/interview-intel" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Interview Intel
            </Link>
            <Link href="/pay-intel" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Pay Intel
            </Link>
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/nurse-profile" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              My Profile
            </Link>
            <Link href="/tracker" className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Applications
            </Link>
            <span className="text-periwinkle-100 mx-1">|</span>
            <button className="text-sm font-medium text-text-light hover:text-periwinkle px-3 py-2 rounded-lg hover:bg-periwinkle-50 transition-colors">
              Log In
            </button>
            <Link
              href="/nurse-profile"
              className="bg-periwinkle text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-periwinkle-dark transition-colors"
            >
              Get Started
            </Link>
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
            <div className="flex flex-col gap-1">
              {[
                { href: "/jobs", label: "Find Jobs" },
                { href: "/community", label: "Community" },
                { href: "/interview-intel", label: "Interview Intel" },
                { href: "/pay-intel", label: "Pay Intel" },
                { href: "/nurse-profile", label: "My Profile" },
                { href: "/tracker", label: "Applications" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-base font-medium text-text-light hover:text-periwinkle hover:bg-periwinkle-50 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3">
                <Link
                  href="/nurse-profile"
                  className="block bg-periwinkle text-white px-4 py-3 rounded-full text-base font-semibold text-center hover:bg-periwinkle-dark transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
