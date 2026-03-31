"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Colors ────────────────────────────────────────────────────── */
const P = "#8B8FD4";
const NAVY = "#1E1E2E";
const GREEN = "#059669";
const AMBER = "#D97706";

/* ── Pipeline config ───────────────────────────────────────────── */
const PIPELINE = ["Applied", "Under Review", "Viewed", "Interview", "Offer"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; index: number }> = {
  Applied:        { color: P,         bg: "#F0F0FA", index: 0 },
  "Under Review": { color: "#F59E0B", bg: "#FFFBEB", index: 1 },
  Viewed:         { color: "#3B82F6", bg: "#EFF6FF", index: 2 },
  Interview:      { color: "#10B981", bg: "#ECFDF5", index: 3 },
  Offer:          { color: GREEN,     bg: "#D1FAE5", index: 4 },
};

/* ── Application data ──────────────────────────────────────────── */
const applications = [
  { id: 1, title: "Pediatric RN", unit: "Inpatient Pediatrics", employer: "Hasbro Children's Hospital", location: "Providence, RI", status: "Interview", appliedDaysAgo: 18, updatedDaysAgo: 7, nudge: "Interview request received — check your messages", nudgeType: "action" as const, pay: "$38–$44/hr", fit: 92 },
  { id: 2, title: "RN", unit: "Respiratory Intermediate Care", employer: "Rhode Island Hospital", location: "Providence, RI", status: "Viewed", appliedDaysAgo: 13, updatedDaysAgo: 11, nudge: "Employer viewed your profile 11 days ago", nudgeType: "info" as const, pay: "$41–$48/hr", fit: 78 },
  { id: 3, title: "ICU RN", unit: "Intensive Care Unit", employer: "Brown University Health", location: "Providence, RI", status: "Applied", appliedDaysAgo: 9, updatedDaysAgo: 9, nudge: "Most employers respond within 5–7 days", nudgeType: "neutral" as const, pay: "$45–$52/hr", fit: 87 },
];

/* ── Job listing detail data ───────────────────────────────────── */
const jobListing = {
  title: "ICU RN", unit: "Intensive Care Unit", employer: "Brown University Health", location: "Providence, RI",
  type: "Full-time · 36 hrs/wk", pay: "$45–$52", payNote: "$45/hr base for 2+ yrs ICU experience. Up to $52/hr for 7+ yrs with critical care certifications. +$6/hr night shift differential.",
  bonus: "$8,000 sign-on bonus", ratio: "2:1", fit: 87,
  schedule: ["3×12hr", "Nights", "Weekend Rotation"],
  scheduleNote: "3×12hr shifts, 7PM–7AM · Weekend rotation every 3rd weekend",
  weekends: "Required", oncall: "Optional",
  requirements: ["RI RN License", "BLS", "ACLS"],
  details: { ehr: "Epic", specialty: "ICU", facilityType: "Hospital", experience: "2+ years ICU or critical care" },
  perks: ["Tuition Reimbursement", "Magnet Designated"],
  qa: [
    { q: "What does the tuition reimbursement program cover?", a: "Up to $5,250/year for BSN, MSN, or DNP programs at accredited institutions.", who: "Nursing Education", daysAgo: 18 },
    { q: "How does the sign-on bonus work?", a: "$8,000 total — $4,000 after 90 days, $4,000 after 1 year. Pro-rated clawback if you leave before 2 years.", who: "HR Team", daysAgo: 17 },
  ],
};

/* ── Shared components ─────────────────────────────────────────── */

function FitBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const color = score >= 85 ? GREEN : score >= 70 ? P : AMBER;
  const bg = score >= 85 ? "#D1FAE5" : score >= 70 ? "#F0F0FA" : "#FFFBEB";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: bg, borderRadius: size === "lg" ? 12 : 8, padding: size === "lg" ? "12px 16px" : "6px 10px", minWidth: size === "lg" ? 80 : 56 }}>
      <span style={{ fontSize: size === "lg" ? 24 : 14, fontWeight: 800, color, lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: size === "lg" ? 10 : 9, fontWeight: 600, color, letterSpacing: "0.08em", marginTop: 2 }}>FLOR FIT</span>
    </div>
  );
}

function NudgePill({ text, type }: { text: string; type: string }) {
  const styles: Record<string, { bg: string; color: string; icon: string }> = {
    action:  { bg: "#ECFDF5", color: GREEN,     icon: "→" },
    info:    { bg: "#EFF6FF", color: "#3B82F6", icon: "●" },
    neutral: { bg: "#F9FAFB", color: "#9CA3AF", icon: "○" },
  };
  const s = styles[type] || styles.neutral;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: type === "action" ? 600 : 400, marginTop: 8 }}>
      <span style={{ fontSize: 10 }}>{s.icon}</span>
      {text}
    </div>
  );
}

/* ── Pipeline bar ──────────────────────────────────────────────── */

function PipelineBar({ status }: { status: string }) {
  const activeIndex = STATUS_CONFIG[status]?.index ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 12 }}>
      {PIPELINE.map((stage, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        const isLast = i === PIPELINE.length - 1;
        return (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: isActive ? 10 : 8, height: isActive ? 10 : 8, borderRadius: "50%", background: isActive ? STATUS_CONFIG[status].color : isPast ? P : "#E2E4F0", border: isActive ? `2px solid ${STATUS_CONFIG[status].color}` : "none", boxShadow: isActive ? `0 0 0 3px ${STATUS_CONFIG[status].bg}` : "none", transition: "all 0.2s" }} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? STATUS_CONFIG[status].color : isPast ? "#6B7280" : "#C0C4D6", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>{stage}</span>
            </div>
            {!isLast && <div style={{ height: 2, flex: 1, background: isPast ? P : "#E2E4F0", marginBottom: 14, marginLeft: 2, marginRight: 2, borderRadius: 1 }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Nurse Profile (tab) ───────────────────────────────────────── */

function NurseProfile() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: "0 0 20px" }}>My Profile</h2>
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #ECEEF8", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "white" }}>G</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>Grace Mathews</div>
            <div style={{ fontSize: 14, color: "#6B7280" }}>grace@florfornurses.com</div>
            <div style={{ fontSize: 12, color: P, fontWeight: 600, marginTop: 3 }}>RN · ICU / Critical Care</div>
          </div>
        </div>
        <div style={{ height: 1, background: "#F0F1F8", margin: "20px 0" }} />
        {([["License", "RI RN — Active through 2027"], ["Specialty", "ICU / Critical Care"], ["Experience", "6 years"], ["Certifications", "CCRN, BLS, ACLS"], ["Preferred shift", "Nights, 3×12hr"], ["Location", "Providence, RI"]] as const).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 14 }}>
            <span style={{ color: "#9CA3AF", minWidth: 110 }}>{k}</span>
            <span style={{ color: NAVY, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <div style={{ height: 1, background: "#F0F1F8", margin: "20px 0" }} />
        <Link href="/nurse-profile" style={{ display: "inline-block", background: P, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>Edit Profile</Link>
      </div>
    </div>
  );
}

/* ── Application Card ──────────────────────────────────────────── */

function ApplicationCard({ app }: { app: typeof applications[number] }) {
  const cfg = STATUS_CONFIG[app.status];
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #ECEEF8", boxShadow: "0 1px 4px rgba(139,143,212,0.06)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{app.title} — {app.unit}</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>{app.employer} · {app.location}</div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{app.pay} · Applied {app.appliedDaysAgo} days ago</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FitBadge score={app.fit} />
          <div style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{app.status}</div>
        </div>
      </div>
      <PipelineBar status={app.status} />
      <NudgePill text={app.nudge} type={app.nudgeType} />
    </div>
  );
}

/* ── Tracker View (tab) ────────────────────────────────────────── */

function TrackerView() {
  const actionable = applications.filter((a) => a.nudgeType === "action").length;
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>Application Tracker</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 0 }}>
          {applications.length} active applications
          {actionable > 0 && <span style={{ color: GREEN, fontWeight: 600 }}> · {actionable} need{actionable === 1 ? "s" : ""} your attention</span>}
        </p>
      </div>
      {[...applications].sort((a, b) => {
        const order: Record<string, number> = { action: 0, info: 1, neutral: 2 };
        return (order[a.nudgeType] ?? 2) - (order[b.nudgeType] ?? 2);
      }).map((app) => <ApplicationCard key={app.id} app={app} />)}
    </div>
  );
}

/* ── Job Listing View (tab) ────────────────────────────────────── */

function JobListingView() {
  return (
    <div style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: NAVY, margin: 0, lineHeight: 1.2 }}>
              {jobListing.title} — {jobListing.unit}
            </h1>
            <Link href="/facility/facility-2" style={{ fontSize: 15, color: P, fontWeight: 600, textDecoration: "none", marginTop: 4, display: "block" }}>
              {jobListing.employer} ›
            </Link>
            <div style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{jobListing.location} · {jobListing.type}</div>
          </div>
          <FitBadge score={jobListing.fit} size="lg" />
        </div>
      </div>

      {/* Pay */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 8 }}>PAY</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{jobListing.pay}<span style={{ fontSize: 16, fontWeight: 400, color: "#6B7280" }}>/hr</span></div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: "#ECFDF5", color: GREEN, borderRadius: 20, padding: "3px 10px", fontSize: 13, fontWeight: 600 }}>
          💰 {jobListing.bonus}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 8, lineHeight: 1.5 }}>{jobListing.payNote}</p>
      </div>

      <div style={{ height: 1, background: "#F3F4F8", marginBottom: 24 }} />

      {/* Ratio */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, background: "#F0F0FA", borderRadius: 10, padding: "8px 14px" }}>{jobListing.ratio}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>Patient-to-nurse ratio</div>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <span>✓</span> Flor Verified · Ethics Pledge committed
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "#F3F4F8", marginBottom: 24 }} />

      {/* Schedule */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 10 }}>SCHEDULE</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {jobListing.schedule.map((s) => (
            <span key={s} style={{ background: "#F0F0FA", color: P, borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0" }}>{jobListing.scheduleNote}</p>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0" }}>Weekends: <strong style={{ color: NAVY }}>{jobListing.weekends}</strong> · On-call: <strong style={{ color: NAVY }}>{jobListing.oncall}</strong></p>
      </div>

      <div style={{ height: 1, background: "#F3F4F8", marginBottom: 24 }} />

      {/* Requirements + Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 10 }}>REQUIREMENTS</div>
          {jobListing.requirements.map((r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: NAVY }}>{r}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 10 }}>DETAILS</div>
          <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.9 }}>
            <div><span style={{ fontWeight: 600, color: NAVY }}>EHR:</span> {jobListing.details.ehr}</div>
            <div><span style={{ fontWeight: 600, color: NAVY }}>Specialty:</span> {jobListing.details.specialty}</div>
            <div><span style={{ fontWeight: 600, color: NAVY }}>Facility:</span> {jobListing.details.facilityType}</div>
            <div><span style={{ fontWeight: 600, color: NAVY }}>Experience:</span> {jobListing.details.experience}</div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "#F3F4F8", marginBottom: 24 }} />

      {/* Perks */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 10 }}>BENEFITS & PERKS</div>
        <div style={{ display: "flex", gap: 8 }}>
          {jobListing.perks.map((p) => (
            <span key={p} style={{ border: "1.5px solid #E0E1F4", color: P, borderRadius: 8, padding: "5px 12px", fontSize: 13, fontWeight: 500 }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Apply */}
      <div style={{ marginBottom: 32 }}>
        <button style={{ background: P, color: "white", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}>Apply Now</button>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>Direct application — no recruiter middleman</div>
      </div>

      <div style={{ height: 1, background: "#F3F4F8", marginBottom: 24 }} />

      {/* Q&A */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Questions & Answers</div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Ask anonymously. Facility answers are visible to all nurses.</div>
        </div>
        {jobListing.qa.map((item, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Q: {item.q}</div>
            <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#374151", borderLeft: `3px solid ${P}` }}>
              {item.a}
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{item.who} · {item.daysAgo} days ago</div>
            </div>
          </div>
        ))}
        <div style={{ border: "1.5px dashed #E0E1F4", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#9CA3AF", cursor: "pointer", textAlign: "center" }}>
          + Ask a question about this role
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function TrackerPage() {
  const [tab, setTab] = useState<"tracker" | "job" | "profile">("tracker");

  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", background: "#F7F8FC", minHeight: "100vh" }}>
      {/* Sub-nav tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #ECEEF8", padding: "0 32px", display: "flex", gap: 4 }}>
        {([["tracker", "Application Tracker"], ["job", "Job Listing"], ["profile", "My Profile"]] as [string, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as "tracker" | "job" | "profile")}
            style={{
              background: "none", border: "none", padding: "14px 16px", fontSize: 14,
              fontWeight: tab === key ? 700 : 400, color: tab === key ? P : "#6B7280",
              cursor: "pointer", borderBottom: tab === key ? `2px solid ${P}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "tracker" && <TrackerView />}
        {tab === "job" && <JobListingView />}
        {tab === "profile" && <NurseProfile />}
      </div>
    </div>
  );
}
