"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { seedNotifications } from "@/data/seed-notifications";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const nurseLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Find Jobs" },
    { href: "/nurse-profile", label: "My Profile" },
    { href: "/tracker", label: "Applications" },
  ];

  const employerLinks = [
    { href: "/employer", label: "Dashboard" },
    { href: "/employer/jobs", label: "My Jobs" },
    { href: "/employer/pipeline", label: "Pipeline" },
    { href: "/employer/interviews", label: "Interviews" },
    { href: "/employer/analytics", label: "Analytics" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Dashboard" },
    { href: "/jobs", label: "Browse Jobs" },
  ];

  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Find Jobs" },
  ];

  const links = !isAuthenticated
    ? guestLinks
    : user?.role === "employer"
    ? employerLinks
    : user?.role === "admin"
    ? adminLinks
    : nurseLinks;

  const userNotifs = isAuthenticated
    ? seedNotifications.filter((n) => n.userId === user?.id)
    : [];
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-periwinkle-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={user?.role === "employer" ? "/employer" : user?.role === "admin" ? "/admin" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-periwinkle flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-periwinkle-dark">Flor</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-periwinkle transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg hover:bg-periwinkle-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl card-shadow border border-periwinkle-100 z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-periwinkle-100">
                      <h3 className="text-sm font-bold">Notifications</h3>
                    </div>
                    {userNotifs.length === 0 ? (
                      <div className="p-4 text-sm text-text-light text-center">No notifications</div>
                    ) : (
                      userNotifs.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link || "#"}
                          onClick={() => setNotifOpen(false)}
                          className={`block p-3 border-b border-periwinkle-50 hover:bg-periwinkle-50/50 transition-colors ${!n.read ? "bg-periwinkle-50/30" : ""}`}
                        >
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-text-light mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-text-light mt-1">{n.createdAt}</p>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-light">
                  {user?.firstName} ({user?.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-periwinkle-50 text-periwinkle-dark px-3 py-2 rounded-full text-sm font-medium hover:bg-periwinkle-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-periwinkle hover:text-periwinkle-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register/nurse"
                  className="bg-periwinkle text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-periwinkle-dark transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
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
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-base font-medium text-text-light hover:text-periwinkle hover:bg-periwinkle-50 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="mt-2 bg-periwinkle-50 text-periwinkle-dark px-4 py-3 rounded-full text-base font-semibold text-center"
                >
                  Sign Out ({user?.firstName})
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-3 text-base font-medium text-periwinkle hover:bg-periwinkle-50 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register/nurse"
                    className="mt-2 bg-periwinkle text-white px-4 py-3 rounded-full text-base font-semibold text-center hover:bg-periwinkle-dark transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
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
