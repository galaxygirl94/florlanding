"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { JobListing } from "@/data/types";
import SpecialtyIllustration from "@/components/SpecialtyIllustration";

const C = {
  navy: "#1E1E2E",
  periwinkle: "#8B8FD4",
  periwinkleLt: "#C5C7EA",
  periwinkleBg: "#EEEEF9",
  sage: "#7BA68E",
  amber: "#F4A942",
  coral: "#E97D6B",
  white: "#FFFFFF",
  muted: "#6B7280",
  border: "#E4E4EC",
};

interface JobCardProps {
  job: JobListing;
  index?: number;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  showExampleBadge?: boolean;
}

/* ── Specialty → image mapping (no photo should repeat across visible cards) ── */
const SPECIALTY_IMAGE_MAP: Record<string, string> = {
  "Med Surg": "/nurse-confident.jpg",
  "Telemetry": "/nurse-confident.jpg",
  "ICU": "/nurse-hero.jpg",
  "Acute Care": "/nurse-hero.jpg",
  "Peds": "/nurse-mom.jpg",
  "Psych": "/nurse-community.jpg",
  "Behavioral Health": "/nurse-community.jpg",
  "Outpatient/Clinic": "/nurse-community.jpg",
  "Community Health": "/nurse-community.jpg",
  "SNF/LTC": "/nurse-tablet.jpg",
  "Hospice": "/nurse-tablet.jpg",
  "School Nurse": "/nurse-tablet.jpg",
  "Rehab": "/nurse-group.jpg",
  "Ortho": "/nurse-group.jpg",
  "Home Health": "/nurse-commute.jpg",
  "ED": "/nurse-hero.jpg",
  "OR": "/nurse-hands.jpg",
  "Pulmonology": "/nurse-hands.jpg",
  "Cardiac": "/nurse-hero.jpg",
};

function getSpecialtyImage(specialty?: string): string | undefined {
  if (!specialty) return undefined;
  return SPECIALTY_IMAGE_MAP[specialty];
}

/* ── Smart facility image with illustrated fallback ── */
function FacilityImage({ src, specialty, accentColor }: { src?: string; specialty?: string; accentColor: string }) {
  const resolvedSrc = src || getSpecialtyImage(specialty);
  const [failed, setFailed] = useState(!resolvedSrc);

  if (failed || !resolvedSrc) {
    return <SpecialtyIllustration specialty={specialty} color={accentColor} className="w-full h-full" />;
  }

  return (
    <Image
      src={resolvedSrc}
      alt={specialty || "Facility"}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      onError={() => setFailed(true)}
    />
  );
}

/* ── Pay display — boxed scale with filled/outlined pills ── */
function PayDisplay({ job, accentColor }: { job: JobListing; accentColor: string }) {
  const isPayHidden = job.payHidden || (job.payRange.min === 0 && job.payRange.max === 0);
  const accent = accentColor;

  if (isPayHidden) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          background: accent, borderRadius: 10, padding: "6px 12px", minWidth: 90,
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Manrope', system-ui, sans-serif", lineHeight: 1.1 }}>
            Pay Available
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.75)", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginTop: 2 }}>
            shown here
          </span>
        </div>
      </div>
    );
  }

  const fmtPay = (v: number) => v % 1 === 0 ? String(v) : v.toFixed(2);
  const payText = job.payRange.min === job.payRange.max
    ? `$${fmtPay(job.payRange.min)}`
    : `$${fmtPay(job.payRange.min)}–$${fmtPay(job.payRange.max)}`;

  // Scale: $30 floor, $90 ceiling for RN roles
  const SCALE_MIN = 30, SCALE_MAX = 90;
  const pctMin = Math.min(100, Math.max(0, ((job.payRange.min - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));
  const pctMax = Math.min(100, Math.max(0, ((job.payRange.max - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Pay boxes row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const, marginBottom: 8 }}>
        {/* Base rate — filled pill */}
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          background: accent, borderRadius: 10, padding: "6px 12px", minWidth: 90,
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Manrope', system-ui, sans-serif", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            {payText}
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.75)", textTransform: "uppercase" as const, letterSpacing: "0.07em", marginTop: 2 }}>
            /{job.payUnit} base
          </span>
        </div>

        {/* Night diff — outlined */}
        {job.nightDifferential && (
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            border: `1.5px solid ${accent}`, borderRadius: 10, padding: "5px 10px", minWidth: 72,
            background: accent + "0D",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: accent, fontFamily: "'Manrope', system-ui, sans-serif", lineHeight: 1.1 }}>
              +${job.nightDifferential}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, color: accent, opacity: 0.7, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginTop: 2 }}>
              nights
            </span>
          </div>
        )}

        {/* Weekend diff — outlined */}
        {job.weekendDifferential && (
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            border: `1.5px solid ${accent}`, borderRadius: 10, padding: "5px 10px", minWidth: 72,
            background: accent + "0D",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: accent, fontFamily: "'Manrope', system-ui, sans-serif", lineHeight: 1.1 }}>
              +${job.weekendDifferential}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, color: accent, opacity: 0.7, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginTop: 2 }}>
              wknd
            </span>
          </div>
        )}
      </div>

      {/* Pay scale bar */}
      <div style={{ position: "relative", marginTop: 4 }}>
        <div style={{ height: 5, borderRadius: 99, background: accent + "22", position: "relative", overflow: "visible" }}>
          <div style={{
            position: "absolute", left: `${pctMin}%`, width: `${Math.max(pctMax - pctMin, 2)}%`,
            height: "100%", background: `linear-gradient(90deg, ${accent}99, ${accent})`, borderRadius: 99,
          }} />
          <div style={{
            position: "absolute", left: `${pctMin}%`, top: "50%", transform: "translate(-50%, -50%)",
            width: 9, height: 9, borderRadius: "50%", background: accent, border: "2px solid #fff",
            boxShadow: `0 0 0 1px ${accent}`,
          }} />
          {job.payRange.min !== job.payRange.max && (
            <div style={{
              position: "absolute", left: `${pctMax}%`, top: "50%", transform: "translate(-50%, -50%)",
              width: 9, height: 9, borderRadius: "50%", background: accent, border: "2px solid #fff",
              boxShadow: `0 0 0 1px ${accent}`,
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobCard({ job, index = 0, isSaved, onToggleSave, showExampleBadge }: JobCardProps) {
  const [hovered, setHovered] = useState(false);
  const delayClass =
    index === 0
      ? "animate-fade-in-up"
      : index === 1
      ? "animate-fade-in-up-delay-1"
      : index === 2
      ? "animate-fade-in-up-delay-2"
      : "animate-fade-in-up-delay-3";

  const accentColor = C.periwinkle;

  return (
    <div
      className={`group h-full flex flex-col ${delayClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered
          ? `0 14px 44px ${accentColor}2E, 0 2px 8px rgba(0,0,0,0.08)`
          : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
        borderTop: `1px solid ${hovered ? accentColor + "40" : C.border}`,
        borderRight: `1px solid ${hovered ? accentColor + "40" : C.border}`,
        borderBottom: `1px solid ${hovered ? accentColor + "40" : C.border}`,
        borderLeft: `3px solid ${hovered ? accentColor : accentColor + "80"}`,
        fontFamily: "'Manrope', system-ui, sans-serif",
      }}
    >
      {/* ── Image area — 160px tall, full-bleed illustration ── */}
      <Link href={`/jobs/${job.id}`} className="block">
        <div style={{
          position: "relative", height: 160, overflow: "hidden",
          borderRadius: "18px 18px 0 0",
        }}>
          <FacilityImage src={job.facilityImage} specialty={job.specialty} accentColor={accentColor} />

          {/* Shift badge — periwinkle filled pill top-left */}
          <div style={{
            position: "absolute", top: 10, left: 12,
            background: accentColor + "E6", backdropFilter: "blur(6px)",
            borderRadius: 20, padding: "4px 11px",
            fontSize: 10, fontWeight: 700, color: "#fff",
            boxShadow: `0 2px 8px ${accentColor}40`,
            letterSpacing: "0.05em",
          }}>
            {job.scheduleType}
          </div>

          {/* Example Listing badge — shown for scraped jobs on public view */}
          {showExampleBadge && job.isScraped && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "rgba(30,30,46,0.75)", backdropFilter: "blur(6px)",
              borderRadius: 20, padding: "3px 9px",
              fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)",
              letterSpacing: "0.05em", textTransform: "uppercase" as const,
              border: "1px solid rgba(255,255,255,0.18)",
            }}>
              Example Listing
            </div>
          )}

          {/* Save button — top right (shifted down when Example Listing badge is present) */}
          {onToggleSave && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(job.id); }}
              style={{
                position: "absolute", top: showExampleBadge && job.isScraped ? 36 : 8, right: 10,
                background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)",
                border: "none", cursor: "pointer",
                width: 30, height: 30, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease",
                transform: isSaved ? "scale(1.15)" : "scale(1)",
                zIndex: 2,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? C.coral : "none"} stroke={isSaved ? C.coral : C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}

          {/* Sign-on bonus — amber gradient bottom strip */}
          {(job.signOnBonus ?? 0) > 0 && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(90deg, #F4A942ee, #F4C54299)",
              padding: "5px 14px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" fill="#fff" />
              </svg>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#fff",
                letterSpacing: "0.04em", fontFamily: "'Manrope', system-ui, sans-serif",
              }}>
                ${job.signOnBonus!.toLocaleString()} Sign-On Bonus
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Body ── */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Title + Verified */}
        <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <h3
              className="group-hover:text-[#8B8FD4] transition-colors"
              style={{
                fontSize: 14, fontWeight: 700, color: C.navy,
                lineHeight: 1.3, flex: 1, marginRight: 8, margin: 0,
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            >
              {job.title}
            </h3>
            {job.patientRatioVerified && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em",
                color: C.sage, background: C.sage + "18",
                padding: "2px 8px", borderRadius: 20,
                textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L5 9L2 6" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </Link>

        {/* Employer + Location */}
        <p style={{
          fontSize: 12, color: C.muted, marginBottom: 10, marginTop: 0,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke={C.muted} strokeWidth="1.3" />
            <circle cx="8" cy="6" r="1.5" fill={C.muted} />
          </svg>
          {job.facilityName} · {job.location.city}, {job.location.state}
        </p>

        {/* Pay — boxed pills + scale bar */}
        <PayDisplay job={job} accentColor={accentColor} />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <Link href={`/jobs/${job.id}`} className="block" style={{ marginTop: 12, textDecoration: "none" }}>
          <button style={{
            width: "100%", padding: "11px",
            background: hovered ? accentColor : accentColor + "12",
            color: hovered ? C.white : accentColor,
            border: `1.5px solid ${accentColor + (hovered ? "FF" : "60")}`,
            borderRadius: 12, fontSize: 13, fontWeight: 700,
            cursor: "pointer", transition: "all 0.18s ease",
            fontFamily: "'Manrope', system-ui, sans-serif",
            letterSpacing: "0.01em",
            boxShadow: hovered ? `0 4px 12px ${accentColor}30` : "none",
          }}>
            View Position →
          </button>
        </Link>
      </div>
    </div>
  );
}
