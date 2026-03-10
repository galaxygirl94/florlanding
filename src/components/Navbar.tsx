"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    setIsEmployer(localStorage.getItem("flor_user_type") === "employer");
  }, []);

  const links = isEmployer
    ? [
        { href: "/employer", label: "Dashboard" },
        { href: "/employer/post", label: "Post Job" },
      ]
    : [
        { href: "/jobs/matched", label: "Find Jobs" },
        { href: "/students", label: "For Students" },
        { href: "/nurse-profile", label: "My Profile" },
        { href: "/tracker", label: "Applications" },
      ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#1E1E2E]/95 backdrop-blur-xl border-white/8 shadow-lg"
          : "bg-[#1E1E2E] border-white/8"
      }`}
      style={{ height: "auto" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-[60px] sm:h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image
              src="/flor-logo.jpg"
              alt="Flor"
              width={28}
              height={34}
              className="object-contain"
              priority
            />
            <span
              className="text-2xl font-bold tracking-tight text-periwinkle italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fl<span className="text-white">o</span>r
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-white/75 hover:text-white px-4 py-2 rounded-xl hover:bg-white/8 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            {/* Demo view toggle */}
            <button
              onClick={() => {
                const next = !isEmployer;
                setIsEmployer(next);
                localStorage.setItem("flor_user_type", next ? "employer" : "nurse");
              }}
              className="text-[11px] font-bold text-white/40 hover:text-periwinkle-light px-3 py-1.5 rounded-full border border-white/10 hover:border-periwinkle/30 transition-all"
            >
              {isEmployer ? "Switch to Nurse" : "Switch to Employer"}
            </button>
            <div className="ml-2 pl-4 border-l border-white/10 flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-sm font-medium text-white/60">
                    Hi, {user?.firstName}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-bold text-periwinkle-light hover:text-white px-4 py-2.5 rounded-full border border-periwinkle/30 hover:border-periwinkle/50 transition-all duration-200"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-bold text-periwinkle-light hover:text-white px-4 py-2.5 rounded-full border border-periwinkle/30 hover:border-periwinkle/50 transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    className="bg-periwinkle hover:bg-periwinkle-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-sm shadow-periwinkle/20 hover:shadow-md hover:shadow-periwinkle/30 hover:-translate-y-px"
                  >
                    Get Started
                  </Link>
                </>
              )}
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

        {/* Mobile menu — full-height right drawer feel */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-white/8 mt-1 pt-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3.5 text-base font-medium text-white/75 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-200 min-h-[48px] flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-sm text-white/40">
                    Signed in as {user?.firstName} {user?.lastName}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="mt-2 border border-periwinkle/30 text-periwinkle-light px-4 py-3.5 rounded-full text-base font-bold text-center hover:bg-white/8 transition-all duration-200"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="mt-2 border border-periwinkle/30 text-periwinkle-light px-4 py-3.5 rounded-full text-base font-bold text-center hover:bg-white/8 transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    className="mt-2 bg-periwinkle text-white px-4 py-3.5 rounded-full text-base font-bold text-center hover:bg-periwinkle-dark transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started — It&apos;s Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
