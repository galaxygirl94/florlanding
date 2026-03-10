"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Colors ────────────────────────────────────────────────────── */
const P = "#8B8FD4";
const NAVY = "#1E1E2E";
const GREEN = "#059669";
const AMBER = "#D97706";

/* ── Pipeline data ─────────────────────────────────────────────── */
const PIPELINE_STAGES = ["Applied", "Under Review", "Viewed", "Interview", "Offer"];

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  Applied:        { color: P,         bg: "#F0F0FA" },
  "Under Review": { color: AMBER,     bg: "#FFFBEB" },
  Viewed:         { color: "#3B82F6", bg: "#EFF6FF" },
  Interview:      { color: GREEN,     bg: "#ECFDF5" },
  Offer:          { color: GREEN,     bg: "#D1FAE5" },
};

const nurseApps = [
  { id: 1, title: "Pediatric RN", unit: "Inpatient Pediatrics", employer: "Hasbro Children's Hospital", pay: "$38–$44/hr", status: "Interview", appliedDays: 18, nudge: "Interview request received — check your messages", nudgeType: "action" as const, fit: 92 },
  { id: 2, title: "RN", unit: "Respiratory Intermediate Care", employer: "Rhode Island Hospital", pay: "$41–$48/hr", status: "Viewed", appliedDays: 13, nudge: "Employer viewed your profile 11 days ago", nudgeType: "info" as const, fit: 78 },
  { id: 3, title: "ICU RN", unit: "Intensive Care Unit", employer: "Brown University Health", pay: "$45–$52/hr", status: "Applied", appliedDays: 9, nudge: "Most employers respond within 5–7 days", nudgeType: "neutral" as const, fit: 87 },
];

/* ── Shared components ─────────────────────────────────────────── */

function FitBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const color = score >= 88 ? GREEN : score >= 75 ? P : AMBER;
  const bg = score >= 88 ? "#ECFDF5" : score >= 75 ? "#F0F0FA" : "#FFFBEB";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: bg, borderRadius: size === "lg" ? 12 : 8, padding: size === "lg" ? "12px 16px" : "6px 10px", minWidth: size === "lg" ? 72 : 50 }}>
      <span style={{ fontSize: size === "lg" ? 22 : 13, fontWeight: 800, color, lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "0.08em", marginTop: 2 }}>FLOR FIT</span>
    </div>
  );
}

function StatusPill({ label, type }: { label: string; type: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    action: { bg: "#ECFDF5", color: GREEN },
    new: { bg: "#F0F0FA", color: P },
    review: { bg: "#FFFBEB", color: AMBER },
    info: { bg: "#EFF6FF", color: "#3B82F6" },
    neutral: { bg: "#F3F4F6", color: "#9CA3AF" },
  };
  const s = map[type] || map.neutral;
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

/* ── Pipeline bar ──────────────────────────────────────────────── */

function PipelineBar({ status }: { status: string }) {
  const ai = PIPELINE_STAGES.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = i === ai;
        const isPast = i < ai;
        const isLast = i === PIPELINE_STAGES.length - 1;
        const cfg = STATUS_CFG[status];
        return (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: isActive ? 10 : 7, height: isActive ? 10 : 7, borderRadius: "50%", background: isActive ? cfg.color : isPast ? P : "#E2E4F0", boxShadow: isActive ? `0 0 0 3px ${cfg.bg}` : "none", transition: "all .2s" }} />
              <span style={{ fontSize: 9.5, fontWeight: isActive ? 700 : 400, color: isActive ? cfg.color : isPast ? "#6B7280" : "#C0C4D6", whiteSpace: "nowrap" }}>{stage}</span>
            </div>
            {!isLast && <div style={{ height: 2, flex: 1, background: isPast ? P : "#E2E4F0", margin: "0 2px 14px" }} />}
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

/* ── Tracker (tab) ─────────────────────────────────────────────── */

function NurseTracker() {
  const actionable = nurseApps.filter((a) => a.nudgeType === "action").length;
  const sorted = [...nurseApps].sort(
    (a, b) => ({ action: 0, info: 1, neutral: 2 }[a.nudgeType] - { action: 0, info: 1, neutral: 2 }[b.nudgeType])
  );
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>Application Tracker</h2>
      <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, marginBottom: 24 }}>
        {nurseApps.length} active applications
        {actionable > 0 && (
          <span style={{ color: GREEN, fontWeight: 600 }}>
            {" "}· {actionable} need{actionable === 1 ? "s" : ""} your attention
          </span>
        )}
      </p>

      {sorted.map((app) => (
        <div key={app.id} style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #ECEEF8", boxShadow: "0 1px 4px rgba(139,143,212,.06)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{app.title} — {app.unit}</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>{app.employer}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{app.pay} · Applied {app.appliedDays} days ago</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FitBadge score={app.fit} />
              <StatusPill label={app.status} type={app.nudgeType === "action" ? "action" : app.status === "Viewed" ? "info" : "neutral"} />
            </div>
          </div>
          <PipelineBar status={app.status} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: { action: "#ECFDF5", info: "#EFF6FF", neutral: "#F9FAFB" }[app.nudgeType], color: { action: GREEN, info: "#3B82F6", neutral: "#9CA3AF" }[app.nudgeType], borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: app.nudgeType === "action" ? 600 : 400, marginTop: 8 }}>
            <span style={{ fontSize: 10 }}>{app.nudgeType === "action" ? "→" : app.nudgeType === "info" ? "●" : "○"}</span>
            {app.nudge}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function TrackerPage() {
  const [tab, setTab] = useState<"tracker" | "profile">("tracker");

  return (
    <div style={{ fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", background: "#F7F8FC", minHeight: "100vh" }}>
      {/* Sub-nav tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #ECEEF8", padding: "0 32px", display: "flex", gap: 4 }}>
        {([["tracker", "Application Tracker"], ["profile", "My Profile"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
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
        {tab === "tracker" && <NurseTracker />}
        {tab === "profile" && <NurseProfile />}
      </div>
    </div>
  );
}
