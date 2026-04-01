"use client";

import { useState, useEffect, useRef } from "react";
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

const seedNotifications: { id: number; icon: string; text: string; time: string; unread: boolean }[] = [];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const [isEmployer, setIsEmployer] = useState(false);
  const unreadCount = seedNotifications.filter((n) => n.unread).length;
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    }
    if (notifsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notifsOpen]);

  useEffect(() => {
    setIsEmployer(localStorage.getItem("flor_user_type") === "employer");
  }, []);

  const links = isEmployer
    ? [
        { href: "/employer/dashboard", label: "Dashboard" },
        { href: "/employer/post", label: "Post Job" },
      ]
    : [
        { href: "/jobs/matched", label: "Find Jobs" },
        { href: "/jobs/community", label: "Community" },
        { href: "/interview-intel", label: "Interview Intel" },
        { href: "/pay-intelligence", label: "Pay Intel" },
        { href: "/nurse-profile", label: "My Profile" },
        { href: "/tracker", label: "Applications" },
      ];

  return (
    <nav
      ref={notifsRef}
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
            {isEmployer ? (
              <button
                onClick={() => {
                  setIsEmployer(false);
                  localStorage.setItem("flor_user_type", "nurse");
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
                Switch to Nurse
              </button>
            ) : (
              <Link
                href="/employer/demo"
                className="hover:text-[#8B8FD4] hover:border-[#8B8FD4]/30"
                style={{
                  fontSize: 11, fontWeight: 700, color: "#999",
                  padding: "6px 12px", borderRadius: 20,
                  border: `1px solid ${C.border}`, background: "transparent",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  textDecoration: "none",
                }}
              >
                Switch to Employer
              </Link>
            )}
            <div style={{ marginLeft: 8, paddingLeft: 16, borderLeft: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
              {/* Bell icon with coral dot */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setNotifsOpen(!notifsOpen)}
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
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: -3, right: -3,
                      width: 8, height: 8, borderRadius: "50%",
                      background: C.coral, border: `1.5px solid ${C.white}`,
                    }} />
                  )}
                </button>
                {notifsOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: -60,
                    width: 340, background: C.white, borderRadius: 16,
                    boxShadow: "0 8px 32px rgba(30,30,46,0.13)", border: `1px solid ${C.border}`,
                    zIndex: 100, overflow: "hidden",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                  }}>
                    <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.white, background: C.coral, borderRadius: 10, padding: "2px 8px" }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div style={{ maxHeight: 340, overflowY: "auto" }}>
                      <div style={{ padding: "36px 20px", textAlign: "center" }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>You&apos;re all caught up</div>
                        <div style={{ fontSize: 12, color: "#999" }}>Notifications will show up here.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/nurse-profile"
                    style={{ fontSize: 13, fontWeight: 500, color: "#777", fontFamily: "'Manrope', system-ui, sans-serif", textDecoration: "none", transition: "all 0.2s" }}
                    className="hover:text-[#8B8FD4] hover:underline decoration-[#8B8FD4]/50 underline-offset-2"
                  >
                    Hi, {user?.firstName}
                  </Link>
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
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setNotifsOpen(!notifsOpen); setMenuOpen(false); }}
                style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 2 }}
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    width: 8, height: 8, borderRadius: "50%",
                    background: C.coral, border: `1.5px solid ${C.white}`,
                  }} />
                )}
              </button>
              {notifsOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: -12,
                  width: "calc(100vw - 40px)", maxWidth: 340, background: C.white, borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(30,30,46,0.13)", border: `1px solid ${C.border}`,
                  zIndex: 100, overflow: "hidden",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}>
                  <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.white, background: C.coral, borderRadius: 10, padding: "2px 8px" }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div style={{ maxHeight: 340, overflowY: "auto" }}>
                    <div style={{ padding: "36px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>You&apos;re all caught up</div>
                      <div style={{ fontSize: 12, color: "#999" }}>Notifications will show up here.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setNotifsOpen(false); }}
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
                  <Link
                    href="/nurse-profile"
                    style={{ padding: "8px 16px", fontSize: 13, color: "#999", fontFamily: "'Manrope', system-ui, sans-serif", textDecoration: "none", display: "block" }}
                    className="hover:text-[#8B8FD4] hover:underline decoration-[#8B8FD4]/50 underline-offset-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Signed in as {user?.firstName} {user?.lastName}
                  </Link>
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
