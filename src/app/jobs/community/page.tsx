"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Color palette (matches project tokens) ─────────────────────── */
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
  offwhite: "#F8F7FC",
  muted: "#6B7280",
  border: "#E4E4EC",
};

/* ── Community / government / nonprofit job data ────────────────── */
const communityJobs = [
  {
    id: "community-school-nurse",
    title: "School Nurse",
    facility: "Providence Public Schools",
    location: "Providence, RI",
    distance: "1.2 mi",
    pay: { min: 34, max: 42, unit: "hr" },
    tags: ["Mon–Fri", "No Weekends", "Summers Off"],
    meta: ["Full-time", "School Year"],
    score: 98,
    verified: true,
    type: "Community" as const,
    isNew: true,
  },
  {
    id: "community-public-health",
    title: "Public Health RN",
    facility: "RI Department of Health",
    location: "Providence, RI",
    distance: "2.4 mi",
    pay: { min: 38, max: 47, unit: "hr" },
    tags: ["Days", "No Nights", "Gov Benefits"],
    meta: ["Full-time", "State Pension"],
    score: 94,
    verified: true,
    type: "Government" as const,
    isNew: false,
  },
  {
    id: "community-health-rn",
    title: "Community Health RN",
    facility: "Providence Community Health Centers",
    location: "Providence, RI",
    distance: "0.8 mi",
    pay: { min: 36, max: 44, unit: "hr" },
    tags: ["Days", "No Weekends", "Mission-Driven"],
    meta: ["Full-time", "Loan Forgiveness"],
    score: 91,
    verified: true,
    type: "Nonprofit" as const,
    isNew: false,
  },
  {
    id: "community-visiting-nurse",
    title: "Visiting Nurse (Home Health)",
    facility: "VNA of Care New England",
    location: "Warwick, RI",
    distance: "8.1 mi",
    pay: { min: null, max: null, unit: "hr" },
    tags: ["Flexible Hours", "Case-Based"],
    meta: ["Full-time or Part-time"],
    score: 82,
    verified: false,
    type: "Nonprofit" as const,
    isNew: false,
  },
  {
    id: "community-correctional",
    title: "Correctional Health RN",
    facility: "RI Department of Corrections",
    location: "Cranston, RI",
    distance: "5.3 mi",
    pay: { min: 41, max: 52, unit: "hr" },
    tags: ["Days & Evenings", "State Benefits"],
    meta: ["Full-time", "State Pension"],
    score: 78,
    verified: false,
    type: "Government" as const,
    isNew: false,
  },
];

type JobType = "Community" | "Government" | "Nonprofit";

const typeColors: Record<JobType, { bg: string; text: string }> = {
  Community: { bg: "#E8F5E9", text: "#2E7D32" },
  Government: { bg: "#E3F2FD", text: "#1565C0" },
  Nonprofit: { bg: "#FCE4EC", text: "#AD1457" },
};

function scoreColor(s: number) {
  if (s >= 90) return { bg: "#E8F5E9", text: "#1B5E20", border: "#A5D6A7" };
  if (s >= 80) return { bg: "#FFFDE7", text: "#F57F17", border: "#FFF176" };
  return { bg: C.periwinkleBg, text: C.periwinkleDark, border: C.periwinkleLt };
}

const filterOptions = ["All", "Community", "Government", "Nonprofit"] as const;

export default function CommunityJobsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered =
    activeFilter === "All"
      ? communityJobs
      : communityJobs.filter((j) => j.type === activeFilter);

  const toggleSave = (id: string) =>
    setSaved((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="bg-offwhite min-h-screen">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#1E1E2E] to-[#2D2D44] text-white py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full"
              style={{ background: C.periwinkle + "30", color: C.periwinkleLt }}
            >
              Community &amp; Public Health
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight animate-fade-in-up">
            Beyond the Bedside
          </h1>
          <p className="text-periwinkle-light mt-2 text-lg animate-fade-in-up-delay-1 max-w-xl">
            School nursing, public health, corrections, home health — roles that
            matter, with schedules that make sense.
          </p>
          <p className="mt-3 text-sm animate-fade-in-up-delay-2" style={{ color: C.periwinkleLt }}>
            {filtered.length} positions · sorted by Flor Fit Score
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
        {/* Filter pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="transition-all duration-150"
              style={{
                flexShrink: 0,
                padding: "7px 18px",
                borderRadius: 20,
                border: activeFilter === f ? "none" : `1.5px solid ${C.periwinkleLt}`,
                background: activeFilter === f ? C.periwinkle : C.white,
                color: activeFilter === f ? C.white : C.periwinkle,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job, i) => {
            const sc = scoreColor(job.score);
            const tc = typeColors[job.type];
            const isExpanded = expanded === job.id;
            const delayClass =
              i === 0 ? "animate-fade-in-up"
              : i === 1 ? "animate-fade-in-up-delay-1"
              : i === 2 ? "animate-fade-in-up-delay-2"
              : "animate-fade-in-up-delay-3";

            return (
              <div
                key={job.id}
                onClick={() => setExpanded(isExpanded ? null : job.id)}
                className={`group cursor-pointer ${delayClass}`}
                style={{
                  background: C.white,
                  borderRadius: 18,
                  padding: "18px 18px 16px",
                  boxShadow: isExpanded
                    ? `0 4px 24px ${C.periwinkle}22`
                    : "0 1px 6px rgba(0,0,0,0.06)",
                  border: isExpanded
                    ? `1.5px solid ${C.periwinkleLt}`
                    : "1.5px solid transparent",
                  transition: "all 0.18s ease",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    {/* Type + badges */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: tc.bg,
                          color: tc.text,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {job.type.toUpperCase()}
                      </span>
                      {job.verified && (
                        <span
                          style={{
                            background: "#E8F5E9",
                            color: "#2E7D32",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L5 9L2 6" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          FLOR VERIFIED
                        </span>
                      )}
                      {job.isNew && (
                        <span
                          style={{
                            background: C.periwinkle,
                            color: C.white,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div
                      className="group-hover:text-[#8B8FD4] transition-colors"
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: C.navy,
                        lineHeight: 1.3,
                        marginBottom: 3,
                      }}
                    >
                      {job.title}
                    </div>

                    {/* Facility */}
                    <div style={{ fontSize: 13, color: C.periwinkle, fontWeight: 600, marginBottom: 2 }}>
                      {job.facility}
                    </div>

                    {/* Location */}
                    <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z" stroke={C.muted} strokeWidth="1.3" />
                        <circle cx="8" cy="6" r="1.5" fill={C.muted} />
                      </svg>
                      {job.location} · {job.distance}
                    </div>
                  </div>

                  {/* Fit Score badge */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: sc.bg,
                      border: `2px solid ${sc.border}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 800, color: sc.text, lineHeight: 1 }}>
                      {job.score}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: sc.text,
                        letterSpacing: "0.04em",
                        marginTop: 1,
                      }}
                    >
                      FIT
                    </span>
                  </div>
                </div>

                {/* Pay row */}
                <div
                  style={{
                    background: C.offwhite,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {job.pay.min ? (
                    <span style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>
                      ${job.pay.min}–${job.pay.max}
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>
                        {" "}
                        /{job.pay.unit}
                      </span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 14, color: C.muted, fontStyle: "italic" }}>
                      Pay not listed — we&apos;ll find out
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(job.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={saved[job.id] ? C.coral : "none"}
                      stroke={saved[job.id] ? C.coral : C.periwinkleLt}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: C.periwinkleBg,
                        color: C.periwinkle,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    fontSize: 12,
                    color: C.muted,
                    marginBottom: 14,
                  }}
                >
                  {job.meta.map((m, idx) => (
                    <span key={m} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {idx > 0 && (
                        <span
                          style={{
                            width: 3,
                            height: 3,
                            background: C.periwinkleLt,
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        />
                      )}
                      {m}
                    </span>
                  ))}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div
                    className="animate-fade-in-up"
                    style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 4 }}
                  >
                    {!job.verified && (
                      <div
                        style={{
                          background: "#FFF8E1",
                          border: "1px solid #FFE082",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 12,
                          fontSize: 12,
                          color: "#B45309",
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                          <path d="M8 1L1 14h14L8 1z" stroke="#B45309" strokeWidth="1.3" fill="#FFF8E1" />
                          <path d="M8 6v3M8 11v.5" stroke="#B45309" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        <span>
                          This listing was aggregated from the web. Flor hasn&apos;t verified
                          the details yet — we&apos;ll flag when it&apos;s confirmed.
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {(
                        [
                          ["Setting", "Community / Outpatient"],
                          ["Schedule", job.tags[0]],
                          ["Employment", job.meta[0]],
                          ["Benefits", job.meta[1] || "TBD"],
                        ] as const
                      ).map(([label, val]) => (
                        <div
                          key={label}
                          style={{ background: C.offwhite, borderRadius: 10, padding: "10px 12px" }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: C.muted,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              marginBottom: 3,
                              textTransform: "uppercase",
                            }}
                          >
                            {label}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/jobs/${job.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="hover:bg-[#6C70B8] transition-colors"
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: C.periwinkle,
                      color: C.white,
                      border: "none",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                  >
                    View Position →
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-12 mb-8 text-center rounded-2xl p-8 sm:p-12"
          style={{ background: C.periwinkleBg }}
        >
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: C.navy }}>
            Not seeing your role?
          </h2>
          <p className="text-sm mb-5" style={{ color: C.muted }}>
            We&apos;re adding new community and public health positions every week.
            <br />
            Set up alerts and we&apos;ll let you know when something matches.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/jobs/matched"
              className="hover:bg-[#6C70B8] transition-colors"
              style={{
                background: C.periwinkle,
                color: C.white,
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            >
              Browse All Jobs
            </Link>
            <Link
              href="/pay-intelligence"
              className="hover:border-[#6C70B8] transition-colors"
              style={{
                background: C.white,
                color: C.periwinkle,
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                border: `1.5px solid ${C.periwinkleLt}`,
                textDecoration: "none",
                fontFamily: "'Manrope', system-ui, sans-serif",
              }}
            >
              Check Pay Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
