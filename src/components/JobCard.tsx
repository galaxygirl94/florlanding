"use client";

import { useState } from "react";
import Link from "next/link";
import { JobListing } from "@/data/types";

/* ── palette ─────────────────────────────────────────── */
const C = {
  navy: "#1E1E2E",
  periwinkle: "#8B8FD4",
  periwinkleBg: "#EEEEF9",
  teal: "#3AAFA9",
  tealLight: "#EBF8F7",
  white: "#FFFFFF",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
  border: "#E4E4EC",
};

export interface JobCardProps {
  job: JobListing;
  index?: number;
  /* retained for backward compat — not rendered per new spec */
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  showExampleBadge?: boolean;
  isApplied?: boolean;
}

function daysAgo(dateStr: string): string {
  const d = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000));
  return d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;
}

function FitBadge({ score }: { score: number }) {
  const bg = score >= 90 ? C.teal : score >= 80 ? C.periwinkle : "#F4A942";
  return (
    <div style={{
      width: 42, height: 42, borderRadius: "50%", background: bg, flexShrink: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}%</span>
      <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", lineHeight: 1.5 }}>FIT</span>
    </div>
  );
}

function VerifiedShield() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 1.3L10.2 5.5L15 6.3L11.5 9.7L12.4 14.5L8 12.2L3.6 14.5L4.5 9.7L1 6.3L5.8 5.5L8 1.3Z" fill="#3AAFA9" />
      <path d="M5.8 8.2L7.2 9.6L10.4 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DELAYS = [
  "animate-fade-in-up",
  "animate-fade-in-up-delay-1",
  "animate-fade-in-up-delay-2",
  "animate-fade-in-up-delay-3",
];

export default function JobCard({ job, index = 0, isApplied = false }: JobCardProps) {
  const [hovered, setHovered] = useState(false);

  const fmt = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(2));
  const payText =
    job.payRange.min === job.payRange.max
      ? `$${fmt(job.payRange.min)}`
      : `$${fmt(job.payRange.min)}–$${fmt(job.payRange.max)}`;

  const payShort = job.payExplained
    ? job.payExplained.length > 80
      ? job.payExplained.slice(0, 80).trim() + "…"
      : job.payExplained
    : "";

  return (
    <Link href={`/jobs/${job.id}`} className={`block h-full ${DELAYS[Math.min(index, 3)]}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: isApplied ? C.tealLight : C.white,
          borderRadius: 16,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Manrope', system-ui, sans-serif",
          boxShadow: hovered
            ? "0 12px 36px rgba(139,143,212,0.2), 0 2px 8px rgba(0,0,0,0.05)"
            : "0 2px 10px rgba(0,0,0,0.05)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.15s ease",
          borderTop: `1px solid ${hovered ? "#8B8FD430" : C.border}`,
          borderRight: `1px solid ${hovered ? "#8B8FD430" : C.border}`,
          borderBottom: `1px solid ${hovered ? "#8B8FD430" : C.border}`,
          /* 3px always — color transitions transparent→periwinkle with no layout shift */
          borderLeft: `3px solid ${hovered ? C.periwinkle : "transparent"}`,
        }}
      >
        <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>

          {/* ── Row 1: Employer bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0, flex: 1, marginRight: 8 }}>
              <span style={{
                fontSize: 13, fontWeight: 600, color: C.periwinkle,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {job.facilityName}
              </span>
              {!job.isScraped && <VerifiedShield />}
            </div>
            {job.fitScore != null && <FitBadge score={job.fitScore} />}
          </div>

          {/* ── Row 2: Title + specialty pill ── */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{
              fontSize: 18, fontWeight: 700, color: C.navy,
              lineHeight: 1.25, margin: "0 0 6px 0",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}>
              {job.title}
            </h3>
            {job.specialty && (
              <span style={{
                display: "inline-block",
                background: C.periwinkleBg, color: C.periwinkle,
                fontSize: 11, fontWeight: 600,
                padding: "3px 10px", borderRadius: 20,
              }}>
                {job.specialty}
              </span>
            )}
          </div>

          {/* ── Row 3: Pay hero ── */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 26, fontWeight: 800, color: C.navy,
                letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {payText}
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: 0 }}>/{job.payUnit}</span>
              </span>
              {(job.signOnBonus ?? 0) > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: C.tealLight, color: C.teal,
                  fontSize: 11, fontWeight: 700,
                  padding: "3px 9px", borderRadius: 20,
                  border: `1px solid ${C.teal}28`,
                }}>
                  💰 ${job.signOnBonus!.toLocaleString()} sign-on
                </span>
              )}
            </div>
            {payShort && (
              <p style={{
                fontSize: 13, fontStyle: "italic", color: C.mutedLight,
                margin: "4px 0 0", lineHeight: 1.4,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {payShort}
              </p>
            )}
          </div>

          {/* ── Row 4: Schedule badges ── */}
          {job.scheduleBadges.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
              {job.scheduleBadges.map((badge) => (
                <span key={badge} style={{
                  background: C.periwinkleBg, color: C.periwinkle,
                  fontSize: 11, fontWeight: 600,
                  padding: "3px 9px", borderRadius: 6,
                  whiteSpace: "nowrap",
                }}>
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* ── Row 5: Location + details ── */}
          <div style={{
            fontSize: 13, color: C.muted, marginBottom: 14,
            display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap",
          }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5S12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke={C.muted} strokeWidth="1.3" />
              <circle cx="8" cy="6" r="1.5" fill={C.muted} />
            </svg>
            <span>{job.location.city}, {job.location.state}</span>
            <span style={{ color: "#D1D5DB" }}>·</span>
            <span>{job.type}</span>
            {job.ehrSystem && (
              <>
                <span style={{ color: "#D1D5DB" }}>·</span>
                <span>{job.ehrSystem}</span>
              </>
            )}
            {job.union && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                background: C.navy, color: "#fff",
                fontSize: 10, fontWeight: 700,
                padding: "2px 7px", borderRadius: 4,
              }}>
                Union ✓
              </span>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* ── Row 6: Bottom action ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.mutedLight }}>
              {daysAgo(job.postedDate)}
            </span>
            {isApplied ? (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: C.tealLight, color: C.teal,
                fontSize: 12, fontWeight: 700,
                padding: "7px 14px", borderRadius: 12,
                border: `1.5px solid ${C.teal}30`,
              }}>
                Applied ✓
              </span>
            ) : (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: C.periwinkle, color: "#fff",
                fontSize: 12, fontWeight: 700,
                padding: "7px 14px", borderRadius: 12,
                transition: "box-shadow 0.15s",
                boxShadow: hovered ? `0 3px 10px ${C.periwinkle}50` : "none",
              }}>
                Apply Directly →
              </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
