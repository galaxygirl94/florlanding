"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const C = {
  navy: "#1E1E2E",
  periwinkle: "#8B8FD4",
  coral: "#E97D6B",
  white: "#FFFFFF",
  border: "#E4E4EC",
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

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
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        boxShadow: "0 1px 12px rgba(139,143,212,0.10)",
        fontFamily: "'Manrope', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo + Wordmark */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <Image
              src="/flor-logo.jpg"
              alt="Flor"
              width={30}
              height={36}
              style={{ objectFit: "contain", borderRadius: 5 }}
              priority
            />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Manrope', system-ui, sans-serif",
              fontSize: 18, fontWeight: 600,
              color: C.periwinkle, letterSpacing: "0.22em",
              lineHeight: 1, textTransform: "uppercase" as const,
            }}>
              FLOR
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#8B8FD4] hover:bg-[#8B8FD4]/5"
                style={{
                  fontSize: 14, fontWeight: 600, color: "#555",
                  padding: "8px 16px", borderRadius: 12, textDecoration: "none",
                  transition: "all 0.2s", fontFamily: "'Manrope', system-ui, sans-serif",
                }}
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
              className="hover:text-[#8B8FD4] hover:border-[#8B8FD4]/30"
              style={{
                fontSize: 11, fontWeight: 700, color: "#999",
                padding: "6px 12px", borderRadius: 20,
                border: `1px solid ${C.border}`, background: "transparent",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            >
              {isEmployer ? "Switch to Nurse" : "Switch to Employer"}
            </button>
            <div style={{ marginLeft: 8, paddingLeft: 16, borderLeft: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
              {/* Bell icon with coral dot */}
              <button
                style={{
                  position: "relative", background: "none", border: "none",
                  cursor: "pointer", padding: 2,
                }}
                title="Notifications"
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  width: 8, height: 8, borderRadius: "50%",
                  background: C.coral, border: `1.5px solid ${C.white}`,
                }} />
              </button>

              {isLoggedIn ? (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#777", fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    Hi, {user?.firstName}
                  </span>
                  <button
                    onClick={logout}
                    className="hover:border-[#8B8FD4]/50 hover:bg-[#8B8FD4]/5"
                    style={{
                      fontSize: 13, fontWeight: 700, color: C.periwinkle,
                      padding: "8px 18px", borderRadius: 24,
                      border: "1.5px solid rgba(139,143,212,0.3)", background: "transparent",
                      cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:border-[#8B8FD4]/50 hover:bg-[#8B8FD4]/5"
                    style={{
                      fontSize: 13, fontWeight: 700, color: C.periwinkle,
                      padding: "8px 18px", borderRadius: 24,
                      border: "1.5px solid rgba(139,143,212,0.3)",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    className="hover:bg-[#7578C0] hover:shadow-md hover:-translate-y-px"
                    style={{
                      background: C.periwinkle, color: "white",
                      padding: "8px 22px", borderRadius: 24,
                      fontSize: 13, fontWeight: 700, textDecoration: "none",
                      transition: "all 0.2s", boxShadow: "0 2px 8px rgba(139,143,212,0.2)",
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile — bell + hamburger in navy */}
          <div className="md:hidden" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 2 }}
              title="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{
                position: "absolute", top: -3, right: -3,
                width: 8, height: 8, borderRadius: "50%",
                background: C.coral, border: `1.5px solid ${C.white}`,
              }} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ padding: 2, background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            paddingBottom: 24, borderTop: `1px solid ${C.border}`,
            marginTop: 4, paddingTop: 16,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#8B8FD4] hover:bg-[#8B8FD4]/5"
                  style={{
                    padding: "14px 16px", fontSize: 15, fontWeight: 600,
                    color: "#555", borderRadius: 12, textDecoration: "none",
                    minHeight: 48, display: "flex", alignItems: "center",
                    transition: "all 0.2s", fontFamily: "'Manrope', system-ui, sans-serif",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div style={{ padding: "8px 16px", fontSize: 13, color: "#999", fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    Signed in as {user?.firstName} {user?.lastName}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    style={{
                      marginTop: 8, border: "1.5px solid rgba(139,143,212,0.3)",
                      color: C.periwinkle, padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      background: "transparent", cursor: "pointer",
                      transition: "all 0.2s", fontFamily: "'Manrope', system-ui, sans-serif",
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
                      color: C.periwinkle, padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/onboarding/resume"
                    style={{
                      marginTop: 8, background: C.periwinkle, color: "white",
                      padding: "14px 16px", borderRadius: 24,
                      fontSize: 15, fontWeight: 700, textAlign: "center",
                      textDecoration: "none", transition: "all 0.2s",
                      fontFamily: "'Manrope', system-ui, sans-serif",
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
