"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { JobListing } from "@/data/types";
import SpecialtyIllustration from "@/components/SpecialtyIllustration";

interface JobCardProps {
  job: JobListing;
  index?: number;
}

/* ── Circular progress ring for Fit Score ── */
function FitScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 44, height: 44 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="22" cy="22" r={radius} fill="none" stroke="#E4E5F4" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={radius} fill="none"
            stroke="#8B8FD4" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "all 0.7s" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#8B8FD4", fontFamily: "Manrope, sans-serif"
        }}>
          {score}
        </span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: "#8B8FD4", lineHeight: 1.3, fontFamily: "Manrope, sans-serif" }}>
        Flor<br />Fit
      </span>
    </div>
  );
}

/* ── Smart facility image with illustrated fallback ── */
function FacilityImage({ src, specialty }: { src?: string; specialty?: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SpecialtyIllustration specialty={specialty} className="w-full h-full" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={specialty || "Facility"}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      onError={() => setFailed(true)}
    />
  );
}

/* ── Pay scale bar ── */
function PayScaleBar({ min, max }: { min: number; max: number }) {
  const SCALE_MIN = 30;
  const SCALE_MAX = 90;
  const clamp = (v: number) => Math.max(0, Math.min(100, ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));
  const leftPct = clamp(min);
  const rightPct = clamp(max);

  return (
    <div style={{ marginTop: 10, padding: "0 2px" }}>
      <div style={{ position: "relative", height: 5, borderRadius: 3, background: "#E4E5F4" }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, borderRadius: 3,
          left: `${leftPct}%`, width: `${Math.max(rightPct - leftPct, 2)}%`,
          background: "linear-gradient(90deg, #8B8FD4, #A89ED4)",
        }} />
        {/* min dot */}
        <div style={{
          position: "absolute", top: "50%", left: `${leftPct}%`, transform: "translate(-50%, -50%)",
          width: 9, height: 9, borderRadius: "50%", background: "#8B8FD4", border: "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
        }} />
        {/* max dot */}
        {min !== max && (
          <div style={{
            position: "absolute", top: "50%", left: `${rightPct}%`, transform: "translate(-50%, -50%)",
            width: 9, height: 9, borderRadius: "50%", background: "#8B8FD4", border: "2px solid white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
          }} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#999", fontFamily: "Manrope, sans-serif" }}>$30/hr</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#999", fontFamily: "Manrope, sans-serif" }}>$90/hr</span>
      </div>
    </div>
  );
}

/* ── Pay display with boxed pills ── */
function PayDisplay({ job }: { job: JobListing }) {
  const isPayHidden = job.payHidden || (job.payRange.min === 0 && job.payRange.max === 0);

  if (isPayHidden) {
    return (
      <div style={{ padding: "12px 0" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#8B8FD4", color: "white", borderRadius: 10, padding: "6px 14px",
          fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 700,
        }}>
          Pay Available
        </div>
        <p style={{ fontSize: 10, color: "#8B8FD4", marginTop: 4, fontFamily: "Manrope, sans-serif", fontWeight: 500 }}>
          Hidden elsewhere. Shown here.
        </p>
      </div>
    );
  }

  const fmtPay = (v: number) => `$${v % 1 === 0 ? v : v.toFixed(2)}`;
  const payText = job.payRange.min === job.payRange.max
    ? fmtPay(job.payRange.min)
    : `${fmtPay(job.payRange.min)}–${fmtPay(job.payRange.max)}`;

  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {/* Base pay — filled pill */}
        <div style={{
          background: "#8B8FD4", color: "white", borderRadius: 10, padding: "6px 14px",
          fontFamily: "Manrope, sans-serif", fontSize: 16, fontWeight: 600,
          display: "inline-flex", alignItems: "baseline", gap: 4,
        }}>
          {payText}
          <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>/{job.payUnit}</span>
        </div>

        {/* Night diff — outlined pill */}
        {job.nightDifferential && (
          <div style={{
            border: "1.5px solid #8B8FD4", color: "#8B8FD4", borderRadius: 10, padding: "5px 12px",
            fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 500,
          }}>
            +${job.nightDifferential}/hr nights
          </div>
        )}

        {/* Weekend diff — outlined pill */}
        {job.weekendDifferential && (
          <div style={{
            border: "1.5px solid #8B8FD4", color: "#8B8FD4", borderRadius: 10, padding: "5px 12px",
            fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 500,
          }}>
            +${job.weekendDifferential}/hr wknd
          </div>
        )}
      </div>

      {/* Pay scale bar */}
      <PayScaleBar min={job.payRange.min} max={job.payRange.max} />
    </div>
  );
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const delayClass =
    index === 0
      ? "animate-fade-in-up"
      : index === 1
      ? "animate-fade-in-up-delay-1"
      : index === 2
      ? "animate-fade-in-up-delay-2"
      : "animate-fade-in-up-delay-3";

  const fitScore = job.fitScore ?? Math.floor(Math.random() * 20 + 75);
  const accentColor = "#8B8FD4";

  return (
    <div
      className={`group h-full flex flex-col ${delayClass}`}
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(139,143,212,0.15)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "Manrope, sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(139,143,212,0.22)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image area — 160px tall */}
      <Link href={`/jobs/${job.id}`} className="block">
        <div style={{ position: "relative", height: 160, overflow: "hidden", background: "rgba(139,143,212,0.05)" }}>
          <FacilityImage src={job.facilityImage} specialty={job.specialty} />

          {/* Shift badge — top-right frosted pill */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
            borderRadius: 20, padding: "4px 12px",
            fontSize: 10, fontWeight: 700, color: "#1E1E2E", letterSpacing: "0.02em",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontFamily: "Manrope, sans-serif",
          }}>
            {job.scheduleType}
          </div>

          {/* Sign-on bonus — amber gradient bottom strip */}
          {(job.signOnBonus ?? 0) > 0 && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(90deg, #F4A942ee, #F4C542aa)",
              padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "Manrope, sans-serif",
            }}>
              <span style={{ fontSize: 13 }}>⭐</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>
                ${job.signOnBonus!.toLocaleString()} Sign-On Bonus
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Title + Verified */}
        <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <h3
              className="group-hover:text-[#8B8FD4] transition-colors"
              style={{
                fontSize: 15, fontWeight: 700, color: "#1E1E2E", lineHeight: 1.35,
                fontFamily: "Manrope, sans-serif", flex: 1, margin: 0,
              }}
            >
              {job.title}
            </h3>
            {job.patientRatioVerified && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 9, fontWeight: 700, color: "#7BA68E",
                background: "rgba(123,166,142,0.1)", padding: "3px 8px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L5 9L2 6" stroke="#7BA68E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </Link>

        {/* Employer + Location */}
        <p style={{
          fontSize: 12, color: "#777", margin: "0 0 8px 0",
          display: "flex", alignItems: "center", gap: 4,
          fontFamily: "Manrope, sans-serif", fontWeight: 500,
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="6" r="1.5" fill="currentColor" />
          </svg>
          {job.facilityName} · {job.location.city}, {job.location.state}
        </p>

        {/* Pay display — boxed pills + scale bar */}
        <PayDisplay job={job} />

        {/* Flor Fit Score */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(139,143,212,0.1)",
        }}>
          <FitScoreRing score={fitScore} />
        </div>

        {/* CTA Button — outline, fills on card hover */}
        <Link href={`/jobs/${job.id}`} className="block" style={{ marginTop: 12 }}>
          <button
            className="group-hover:shadow-md"
            style={{
              width: "100%", border: `1.5px solid ${accentColor}`, color: accentColor,
              fontWeight: 700, padding: "10px 0", borderRadius: 14, fontSize: 14,
              background: "transparent", cursor: "pointer",
              transition: "all 0.2s", fontFamily: "Manrope, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accentColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = accentColor;
            }}
          >
            View Position →
          </button>
        </Link>
      </div>
    </div>
  );
}
