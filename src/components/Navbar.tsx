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
        { href: "/survey", label: "Share Feedback" },
      ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "auto",
        background: "#FFFFFF",
        borderBottom: "1px solid #E4E4EC",
        boxShadow: scrolled ? "0 1px 12px rgba(139,143,212,0.12)" : "0 1px 12px rgba(139,143,212,0.06)",
        transition: "box-shadow 0.3s",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo + Wordmark */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image
              src="/flor-logo.jpg"
              alt="Flor"
              width={26}
              height={32}
              style={{ objectFit: "contain" }}
              priority
            />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 20,
                color: "#8B8FD4",
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
              }}
            >
              FLOR
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14, fontWeight: 600, color: "#555",
                  padding: "8px 16px", borderRadius: 12, textDecoration: "none",
                  transition: "all 0.2s", fontFamily: "Manrope, sans-serif",
                }}
                className="hover:text-[#8B8FD4] hover:bg-[#8B8FD4]/5"
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
              style={{
                fontSize: 11, fontWeight: 700, color: "#999",
                padding: "6px 12px", borderRadius: 20,
                border: "1px solid #E4E4EC", background: "transparent",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "Manrope, sans-serif",
              }}
              className="hover:text-[#8B8FD4] hover:border-[#8B8FD4]/30"
            >
              {isEmployer ? "Switch to Nurse" : "Switch to Employer"}
            </button>
            <div style={{ marginLeft: 8, paddingLeft: 16, borderLeft: "1px solid #E4E4EC", display: "flex", alignItems: "center", gap: 12 }}>
              {/* Bell icon with coral dot */}
              <button
                style={{
                  position: "relative", background: "transparent", border: "none",
                  cursor: "pointer", padding: 6, borderRadius: 10, transition: "background 0.2s",
                }}
                className="hover:bg-[#8B8FD4]/5"
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {/* coral unread dot */}
                <span style={{
                  position: "absolute", top: 4, right: 5,
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#E97D6B", border: "1.5px solid white",
                }} />
              </button>

              {isLoggedIn ? (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#777", fontFamily: "Manrope, sans-serif" }}>
                    Hi, {user?.firstName}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      fontSize: 13, fontWeight: 700, color: "#8B8FD4",
                      padding: "8px 18px", borderRadius: 24,
                      border: "1.5px solid rgba(139,143,212,0.3)", background: "transparent",
                      cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    className="hover:border-[#8B8FD4]/50 hover:bg-[#8B8FD4]/5"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    style={{
                      fontSize: 13, fontWeight: 700, color: "#8B8FD4",
                      padding: "8px 18px", borderRadius: 24,
                      border: "1.5px solid rgba(139,143,212,0.3)",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    className="hover:border-[#8B8FD4]/50 hover:bg-[#8B8FD4]/5"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    style={{
                      background: "#8B8FD4", color: "white",
                      padding: "8px 22px", borderRadius: 24,
                      fontSize: 13, fontWeight: 700, textDecoration: "none",
                      transition: "all 0.2s", boxShadow: "0 2px 8px rgba(139,143,212,0.2)",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    className="hover:bg-[#7578C0] hover:shadow-md hover:-translate-y-px"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger — navy */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              padding: 10, borderRadius: 12, background: "transparent",
              border: "none", cursor: "pointer", transition: "background 0.2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            paddingBottom: 24, borderTop: "1px solid #E4E4EC", marginTop: 4, paddingTop: 16,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "14px 16px", fontSize: 15, fontWeight: 600,
                    color: "#555", borderRadius: 12, textDecoration: "none",
                    minHeight: 48, display: "flex", alignItems: "center",
                    transition: "all 0.2s", fontFamily: "Manrope, sans-serif",
                  }}
                  className="hover:text-[#8B8FD4] hover:bg-[#8B8FD4]/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div style={{ padding: "8px 16px", fontSize: 13, color: "#999", fontFamily: "Manrope, sans-serif" }}>
                    Signed in as {user?.firstName} {user?.lastName}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    style={{
                      marginTop: 8, border: "1.5px solid rgba(139,143,212,0.3)",
                      color: "#8B8FD4", padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      background: "transparent", cursor: "pointer",
                      transition: "all 0.2s", fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    style={{
                      marginTop: 8, border: "1.5px solid rgba(139,143,212,0.3)",
                      color: "#8B8FD4", padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "Manrope, sans-serif",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    style={{
                      marginTop: 8, background: "#8B8FD4", color: "white",
                      padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "Manrope, sans-serif",
                    }}
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
