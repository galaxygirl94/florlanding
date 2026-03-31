"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Colors ────────────────────────────────────────────────────── */
const C = {
  navy: "#1E1E2E",
  periwinkle: "#8B8FD4",
  periwinkleDark: "#6C70B8",
  periwinkleLt: "#C5C7EA",
  periwinkleBg: "#EEEEF9",
  sage: "#7BA68E",
  amber: "#F4A942",
  coral: "#E97D6B",
  white: "#FFFFFF",
  muted: "#6B7280",
  border: "#E4E4EC",
  success: "#059669",
  successBg: "#ECFDF5",
};

/* ── Demo data: Hasbro Children's Hospital ────────────────────── */
const FACILITY = {
  name: "Hasbro Children's Hospital",
  location: "Providence, RI",
  type: "Pediatric Hospital",
  beds: 102,
};

const DEMO_POSTINGS = [
  { id: "p1", title: "Pediatric RN", specialty: "Peds", pay: "$40–$50/hr", shift: "Days", type: "Full-time", candidates: 5, status: "active" as const },
  { id: "p2", title: "Behavioral Health RN", specialty: "Psych", pay: "$42–$52/hr", shift: "Rotating", type: "Full-time", candidates: 3, status: "active" as const },
  { id: "p3", title: "Per Diem RN", specialty: "Med Surg", pay: "$48–$55/hr", shift: "Flexible", type: "Per Diem", candidates: 2, status: "active" as const },
];

const DEMO_CANDIDATES = [
  { id: "c1", initials: "PP", name: "Priya P.", score: 100, specialty: "Peds", yrs: 12, verified: true, shift: "Days", distance: "3.2 mi", color: "#8B8FD4" },
  { id: "c2", initials: "ER", name: "Emily R.", score: 92, specialty: "Peds", yrs: 5, verified: true, shift: "Days", distance: "4.1 mi", color: "#E97D6B" },
  { id: "c3", initials: "AS", name: "Angela S.", score: 87, specialty: "Peds / NICU", yrs: 8, verified: true, shift: "Rotating", distance: "6.3 mi", color: "#7BA68E" },
  { id: "c4", initials: "DC", name: "David C.", score: 78, specialty: "Med Surg", yrs: 3, verified: true, shift: "Nights", distance: "8.7 mi", color: "#F4A942" },
  { id: "c5", initials: "KM", name: "Kevin M.", score: 71, specialty: "New Grad", yrs: 1, verified: false, shift: "Days", distance: "12.1 mi", color: "#9CA3AF" },
];

const DEMO_NOTIFICATIONS = [
  { id: 1, text: "Priya P. applied for Pediatric RN — 100% Flor Fit", time: "2h ago", unread: true },
  { id: 2, text: "Emily R. applied for Pediatric RN — 92% Flor Fit", time: "5h ago", unread: true },
  { id: 3, text: "Interview request sent to Angela S. for Pediatric RN", time: "1d ago", unread: false },
  { id: 4, text: "Your posting 'Per Diem RN' received 2 new applicants", time: "2d ago", unread: false },
  { id: 5, text: "Ethics Pledge status: Active", time: "5d ago", unread: false },
];

const DEMO_ACTIVITY = [
  { id: 1, nurse: "Priya P.", initials: "PP", color: "#8B8FD4", score: 100, job: "Pediatric RN", action: "Applied", time: "2h ago" },
  { id: 2, nurse: "Emily R.", initials: "ER", color: "#E97D6B", score: 92, job: "Pediatric RN", action: "Applied", time: "5h ago" },
  { id: 3, nurse: "Angela S.", initials: "AS", color: "#7BA68E", score: 87, job: "Pediatric RN", action: "Interview Requested", time: "1d ago" },
  { id: 4, nurse: "David C.", initials: "DC", color: "#F4A942", score: 78, job: "Behavioral Health RN", action: "Applied", time: "1d ago" },
  { id: 5, nurse: "Kevin M.", initials: "KM", color: "#9CA3AF", score: 71, job: "Per Diem RN", action: "Applied", time: "2d ago" },
];

/* ── Helpers ───────────────────────────────────────────────────── */
function fitBadge(score: number) {
  if (score >= 85) return { bg: C.successBg, color: C.success };
  if (score >= 70) return { bg: "#FFFDE7", color: "#F57F17" };
  return { bg: "#F3F4F6", color: C.muted };
}

type Tab = "dashboard" | "candidates" | "postings";

/* ── Page ──────────────────────────────────────────────────────── */
export default function EmployerDemoPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selectedPosting, setSelectedPosting] = useState("p1");

  const tabs: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "candidates", label: "Candidates" },
    { id: "postings", label: "Postings" },
  ];

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", background: "#FAFAFE", minHeight: "100vh" }}>
      {/* Demo banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #2D2D4E 100%)`,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            background: C.periwinkle, color: C.white,
            fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
            letterSpacing: "0.05em",
          }}>
            DEMO MODE
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.8)" }}>
            {FACILITY.name} — Employer Preview
          </span>
        </div>
        <Link
          href="/employer/onboarding"
          className="hover:opacity-90"
          style={{
            background: C.white, color: C.navy,
            borderRadius: 10, padding: "8px 20px",
            fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}
        >
          Get Full Access →
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-8">
        {/* Header + tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: C.navy }}>
                {FACILITY.name}
              </h1>
              <span style={{
                background: C.successBg, color: C.success,
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              }}>
                Ethics Pledge Active
              </span>
            </div>
            <p className="text-sm" style={{ color: C.muted }}>
              {FACILITY.location} · {FACILITY.type} · {FACILITY.beds} beds
            </p>
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="transition-all"
              style={{
                padding: "8px 20px", borderRadius: 12,
                background: tab === t.id ? C.periwinkle : C.white,
                color: tab === t.id ? C.white : C.muted,
                border: tab === t.id ? "none" : `1.5px solid ${C.border}`,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Dashboard Tab ─────────────────────────────────── */}
        {tab === "dashboard" && (
          <div>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Active Postings", value: DEMO_POSTINGS.length, color: C.sage, bg: C.successBg },
                { label: "Candidates in Queue", value: DEMO_CANDIDATES.length, color: C.periwinkle, bg: C.periwinkleBg },
                { label: "Interview Requests Sent", value: 1, color: C.coral, bg: "#FEF2F0" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border p-5" style={{ background: C.white, borderColor: C.border }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-3" style={{ background: s.bg, color: s.color }}>
                    {s.value}
                  </div>
                  <div className="text-2xl font-extrabold mb-1" style={{ color: C.navy }}>{s.value}</div>
                  <div className="text-sm font-medium" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <h2 className="text-lg font-extrabold mb-4" style={{ color: C.navy }}>Notifications</h2>
            <div className="rounded-2xl border overflow-hidden mb-8" style={{ background: C.white, borderColor: C.border }}>
              {DEMO_NOTIFICATIONS.map((n, i) => (
                <div key={n.id} className="flex items-center gap-3 px-5 py-4" style={{
                  borderBottom: i < DEMO_NOTIFICATIONS.length - 1 ? `1px solid #F0F0F5` : "none",
                  background: n.unread ? "rgba(139,143,212,0.04)" : "transparent",
                }}>
                  {n.unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C.coral }} />}
                  <span className="text-sm flex-1" style={{ color: C.navy, fontWeight: n.unread ? 600 : 400 }}>{n.text}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: "#9CA3AF" }}>{n.time}</span>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold" style={{ color: C.navy }}>Recent Activity</h2>
              <button onClick={() => setTab("candidates")} className="text-sm font-bold hover:underline" style={{ color: C.periwinkle, background: "none", border: "none", cursor: "pointer" }}>
                View All Candidates
              </button>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: C.white, borderColor: C.border }}>
              {DEMO_ACTIVITY.map((a, i) => {
                const fb = fitBadge(a.score);
                return (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFE] transition-colors" style={{
                    borderBottom: i < DEMO_ACTIVITY.length - 1 ? "1px solid #F0F0F5" : "none",
                  }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: a.color }}>
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: C.navy }}>{a.nurse}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: fb.bg, color: fb.color }}>
                          {a.score}% Fit
                        </span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                        {a.action} · {a.job}
                      </div>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "#9CA3AF" }}>{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Candidates Tab ────────────────────────────────── */}
        {tab === "candidates" && (
          <div>
            {/* Posting selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold" style={{ color: C.muted }}>Candidates for:</span>
              <select
                value={selectedPosting}
                onChange={(e) => setSelectedPosting(e.target.value)}
                className="rounded-xl border px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B8FD4]/40"
                style={{ borderColor: C.border, color: C.navy }}
              >
                {DEMO_POSTINGS.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.candidates} candidates)</option>
                ))}
              </select>
            </div>

            {/* Candidate cards */}
            <div className="grid gap-4">
              {DEMO_CANDIDATES.map((c) => {
                const fb = fitBadge(c.score);
                return (
                  <div key={c.id} className="rounded-2xl border p-5 hover:-translate-y-0.5 transition-all" style={{ background: C.white, borderColor: C.border }}>
                    <div className="flex items-start gap-4">
                      {/* Initials avatar */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: c.color }}>
                        {c.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base font-extrabold" style={{ color: C.navy }}>{c.name}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: fb.bg, color: fb.color }}>
                            {c.score}% Fit
                          </span>
                          {c.verified && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: C.successBg, color: C.success }}>
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M10 3L5 9L2 6" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              Nursys Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs mt-1 flex-wrap" style={{ color: C.muted }}>
                          <span>{c.specialty}</span>
                          <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                          <span>{c.yrs} yrs exp</span>
                          <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                          <span>{c.shift}</span>
                          <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                          <span>{c.distance}</span>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <button
                            className="hover:opacity-90 transition-opacity"
                            style={{
                              background: C.periwinkle, color: C.white,
                              border: "none", borderRadius: 10, padding: "8px 18px",
                              fontSize: 13, fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            Request Interview
                          </button>
                          <button
                            className="hover:bg-[#8B8FD4]/5 transition-colors"
                            style={{
                              background: "transparent", color: C.periwinkle,
                              border: `1.5px solid ${C.periwinkleLt}`, borderRadius: 10,
                              padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Locked CTA */}
            <div className="mt-6 rounded-2xl p-6 text-center" style={{ background: C.periwinkleBg }}>
              <p className="text-sm mb-3" style={{ color: C.periwinkleDark }}>
                Full profiles, Nursys license details, and direct messaging are available to verified employers.
              </p>
              <Link
                href="/employer/onboarding"
                className="hover:opacity-90"
                style={{
                  display: "inline-block", background: C.periwinkle, color: C.white,
                  borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create Employer Account →
              </Link>
            </div>
          </div>
        )}

        {/* ── Postings Tab ──────────────────────────────────── */}
        {tab === "postings" && (
          <div>
            <div className="grid gap-4">
              {DEMO_POSTINGS.map((p) => (
                <div key={p.id} className="rounded-2xl border p-5" style={{ background: C.white, borderColor: C.border }}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-base font-extrabold" style={{ color: C.navy }}>{p.title}</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: C.successBg, color: C.success }}>
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: C.muted }}>
                        <span>{p.specialty}</span>
                        <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                        <span>{p.pay}</span>
                        <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                        <span>{p.shift}</span>
                        <span className="w-1 h-1 rounded-full" style={{ background: C.periwinkleLt }} />
                        <span>{p.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-extrabold" style={{ color: C.periwinkle }}>{p.candidates}</div>
                        <div className="text-xs" style={{ color: C.muted }}>candidates</div>
                      </div>
                      <button
                        onClick={() => { setSelectedPosting(p.id); setTab("candidates"); }}
                        className="hover:opacity-90"
                        style={{
                          background: C.periwinkle, color: C.white,
                          border: "none", borderRadius: 10, padding: "8px 16px",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        View Candidates
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Value prop */}
            <div className="mt-8 rounded-2xl p-6" style={{ background: C.white, border: `1.5px solid ${C.periwinkleLt}40` }}>
              <div className="flex gap-4 items-start">
                <span className="text-2xl flex-shrink-0">✿</span>
                <div>
                  <div className="text-sm font-extrabold mb-2" style={{ color: C.navy }}>Why hire through Flor?</div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                    {[
                      "Direct hire — no agency fees",
                      "Flor Fit scores by specialty & certs",
                      "Nurses who want permanent roles",
                      "Ethics Pledge protects your reputation",
                    ].map((t) => (
                      <div key={t} className="text-sm flex gap-2" style={{ color: C.muted }}>
                        <span style={{ color: C.success }}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 rounded-2xl p-8 text-center" style={{ background: C.navy }}>
              <div className="text-xl font-extrabold mb-2" style={{ color: C.white }}>
                Ready to hire without the middleman?
              </div>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,.6)" }}>
                Create your account, verify your facility, and sign the Ethics Pledge to access full profiles and post jobs.
              </p>
              <Link
                href="/employer/onboarding"
                className="hover:opacity-90"
                style={{
                  display: "inline-block", background: C.periwinkle, color: C.white,
                  borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create Employer Account →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
