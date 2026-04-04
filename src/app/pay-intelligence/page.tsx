"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Tab = "staff" | "travel";
type Specialty = "All Specialties" | "RN" | "CNA";
type EmployerType = "All" | "FQHC / PACE" | "Hospital" | "School";

const JOB_ROWS = [
  {
    id: "job-pace-cna",
    role: "CNA — Day Center",
    employer: "PACE Organization of Rhode Island",
    payRange: "$20–$24/hr",
    schedule: "M–F Days",
    pslf: "eligible" as const,
    posted: "Active",
    specialty: "CNA" as const,
    employerType: "FQHC / PACE" as const,
  },
  {
    id: "job-brown-behavioral",
    role: "RN — Outpatient Behavioral Health",
    employer: "Brown University Health / Gateway",
    payRange: "$38–$47/hr",
    schedule: "M–F Days",
    pslf: "check" as const,
    posted: "Active",
    specialty: "RN" as const,
    employerType: "Hospital" as const,
  },
  {
    id: "job-rih-or",
    role: "RN — Inpatient OR",
    employer: "Rhode Island Hospital",
    payRange: "$43–$55/hr",
    schedule: "Variable",
    pslf: "check" as const,
    posted: "Active",
    specialty: "RN" as const,
    employerType: "Hospital" as const,
  },
];

const ACCORDION_ITEMS = [
  {
    title: "Initial RI RN License",
    content:
      "To obtain an initial Rhode Island RN license, you must have passed the NCLEX-RN and submit an application to the RI Board of Nursing. The application fee is $135. Processing time is typically 4–6 weeks for paper applications, or 2–3 weeks online. The RI Board of Nursing can be reached at (401) 222-5700 or online at health.ri.gov.",
  },
  {
    title: "License Renewal",
    content:
      "Rhode Island RN licenses renew every two years on your birthday month. Renewal requires 30 continuing education hours per renewal period. The renewal fee is $135. You can renew online at health.ri.gov/licenses. Late renewals incur a $25 late fee per month.",
  },
  {
    title: "Compact License Status",
    content:
      "Rhode Island is a Compact State under the Nurse Licensure Compact (NLC). If you hold a compact license issued in your home state, you can practice in Rhode Island without obtaining a separate RI license. To apply for an RI compact license, apply through the RI Board of Nursing and designate Rhode Island as your primary state of residence. For a full list of compact states and the NCSBN Compact Map, visit ncsbn.org.",
  },
  {
    title: "Verifying Your License",
    content:
      "Any RI nursing license can be verified through Nursys QuickConfirm at nursys.com. Employers, including those on Flor, use Nursys to verify active license status. The Flor Verified badge on job listings indicates the employer has verified nurse credentials through Nursys. You can also self-verify your license through your state board's online lookup.",
  },
  {
    title: "License with a History",
    content:
      "If your nursing license has a past disciplinary issue, encumbrance, or resolved complaint, we recommend reviewing your current license status directly at the RI Board of Nursing before applying. Flor verifies active license status only and does not automatically disqualify applicants based on resolved historical issues. If you have questions about an active encumbrance or appeal, the RI Board of Nursing's legal division can be reached at (401) 222-5700.",
  },
];

function ShieldIcon() {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 1L11 3.5V7C11 9.76 8.84 12.36 6 13C3.16 12.36 1 9.76 1 7V3.5L6 1Z"
        fill="#3AAFA9"
        fillOpacity="0.2"
        stroke="#3AAFA9"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M4 6.5L5.5 8L8.5 5"
        stroke="#3AAFA9"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 9L9 2M9 2H5M9 2V6"
        stroke="#6B7280"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PayIntelligencePage() {
  const [tab, setTab] = useState<Tab>("staff");
  const [specialty, setSpecialty] = useState<Specialty>("All Specialties");
  const [employerType, setEmployerType] = useState<EmployerType>("All");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const filteredRows = useMemo(() => {
    return JOB_ROWS.filter((row) => {
      const matchesSpecialty =
        specialty === "All Specialties" || row.specialty === specialty;
      const matchesEmployerType =
        employerType === "All" || row.employerType === employerType;
      return matchesSpecialty && matchesEmployerType;
    });
  }, [specialty, employerType]);

  return (
    <main className="min-h-screen bg-white">
      {/* ── PART 1: HERO ──────────────────────────────────────────────── */}
      <section className="bg-[#1E1E2E] py-20 sm:py-28 relative overflow-hidden">
        {/* Periwinkle glow blob top right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #6C63FF 0%, transparent 70%)",
          }}
        />
        {/* Secondary soft blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/4 w-[320px] h-[320px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #6C63FF 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10">
          {/* Eyebrow pill */}
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-semibold tracking-wide px-4 py-1.5 rounded-full border border-periwinkle/30 bg-periwinkle/10">
              ✦ Real data from real employers
            </span>
          </div>

          {/* H1 */}
          <h1
            className="text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] max-w-[720px] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Know what you&rsquo;re worth in Rhode Island
          </h1>

          {/* Subtext */}
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-[620px]">
            These pay ranges come directly from verified employers posting on
            Flor — not national BLS averages, not scraped estimates. Real
            numbers from real jobs.
          </p>
        </div>
      </section>

      {/* ── PART 2 + 3: STAFF vs TRAVEL TOGGLE + PAY TABLE ───────────── */}
      <section className="bg-[#F4F4FB] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          {/* Tab buttons */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={() => setTab("staff")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
                tab === "staff"
                  ? "bg-periwinkle text-white shadow-sm"
                  : "bg-white text-[#1E1E2E] border border-periwinkle/40 hover:border-periwinkle"
              }`}
            >
              Staff Positions
            </button>
            <button
              onClick={() => setTab("travel")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
                tab === "travel"
                  ? "bg-periwinkle text-white shadow-sm"
                  : "bg-white text-[#1E1E2E] border border-periwinkle/40 hover:border-periwinkle"
              }`}
            >
              Travel
            </button>
          </div>

          {/* Travel block */}
          {tab === "travel" && (
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-periwinkle/10 max-w-[680px]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-periwinkle/10 flex items-center justify-center text-periwinkle text-lg">
                  ✦
                </div>
                <div>
                  <p className="text-[#1E1E2E] text-base leading-relaxed mb-5">
                    Flor focuses on direct-hire staff positions. If you&rsquo;re
                    considering the move from travel to staff, our calculator
                    shows you the real comparison — including PSLF.
                  </p>
                  <Link
                    href="/travel-off-ramp"
                    className="inline-flex items-center gap-1.5 text-periwinkle font-bold text-sm hover:underline"
                  >
                    Run the numbers →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Staff tab: Pay data table */}
          {tab === "staff" && (
            <div>
              {/* Section heading */}
              <h2
                className="text-[#1E1E2E] text-2xl sm:text-3xl mb-8 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Current pay ranges from verified RI employers on Flor
              </h2>

              {/* Filters row */}
              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Specialty)}
                  className="appearance-none bg-white border border-periwinkle/30 text-[#1E1E2E] text-sm font-semibold rounded-full px-5 py-2.5 pr-9 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-periwinkle/30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  <option>All Specialties</option>
                  <option>RN</option>
                  <option>CNA</option>
                </select>

                <select
                  value={employerType}
                  onChange={(e) =>
                    setEmployerType(e.target.value as EmployerType)
                  }
                  className="appearance-none bg-white border border-periwinkle/30 text-[#1E1E2E] text-sm font-semibold rounded-full px-5 py-2.5 pr-9 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-periwinkle/30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  <option>All</option>
                  <option>FQHC / PACE</option>
                  <option>Hospital</option>
                  <option>School</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-periwinkle/10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-[#F4F4FB]">
                        {[
                          "Role",
                          "Employer",
                          "Pay Range",
                          "Schedule",
                          "PSLF Eligible",
                          "Posted",
                          "",
                        ].map((col) => (
                          <th
                            key={col}
                            className="text-left text-xs font-bold uppercase tracking-wider text-[#6B7280] px-5 py-4 first:pl-6 last:pr-6"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-[#6B7280] text-sm py-12"
                          >
                            No listings match your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b border-[#F4F4FB] last:border-0 hover:bg-[#F4F4FB]/50 transition-colors duration-100"
                          >
                            <td className="px-5 py-4 pl-6">
                              <span className="font-semibold text-[#1E1E2E] text-sm">
                                {row.role}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-[#1E1E2E] text-sm">
                                {row.employer}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-[#1E1E2E] text-sm tabular-nums">
                                {row.payRange}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-[#6B7280] text-sm">
                                {row.schedule}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {row.pslf === "eligible" ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#EBF8F7] text-[#3AAFA9] text-xs font-bold px-3 py-1 rounded-full border border-[#3AAFA9]/20">
                                  <ShieldIcon />
                                  ✓ PSLF Eligible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#6B7280] text-xs font-semibold px-3 py-1 rounded-full">
                                  <ExternalLinkIcon />
                                  Check with employer
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3AAFA9]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3AAFA9] flex-shrink-0" />
                                {row.posted}
                              </span>
                            </td>
                            <td className="px-5 py-4 pr-6 text-right">
                              <Link
                                href={`/jobs/${row.id}`}
                                className="text-periwinkle text-sm font-bold hover:underline whitespace-nowrap"
                              >
                                View Job →
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Below-table note */}
              <p className="mt-4 text-[#6B7280] text-[13px] italic">
                Pay ranges updated as employers post. Every range is posted
                directly by the employer — we never estimate or scrape.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── PART 4: PSLF ADVANTAGE ────────────────────────────────────── */}
      <section className="bg-[#EEEEF9] py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <div className="max-w-[760px]">
            <h2
              className="text-[#1E1E2E] text-2xl sm:text-3xl lg:text-4xl leading-[1.2] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why a $39/hr community health job might be worth more than a
              $52/hr hospital job
            </h2>

            <p
              className="text-[#6B7280] mb-8"
              style={{ fontSize: "16px", lineHeight: "1.7" }}
            >
              Rhode Island RN salaries average 17% below the national average —
              but that number doesn&rsquo;t tell the whole story. If you have
              federal student loans and work full-time at a qualifying community
              health employer, Public Service Loan Forgiveness can cancel your
              remaining balance after 10 years of payments. Every FQHC and PACE
              program on Flor qualifies.
            </p>

            {/* Callout card */}
            <div className="bg-white rounded-2xl border-l-4 border-[#3AAFA9] shadow-sm p-6 mb-4">
              <p
                className="text-[#1E1E2E] text-sm"
                style={{ lineHeight: "1.75" }}
              >
                <span className="font-bold">Example:</span> A nurse with
                $80,000 in federal student loans making $300/month in payments
                would have $44,000 remaining after 10 years. At a qualifying
                employer, that $44,000 is forgiven — tax-free. That&rsquo;s
                worth roughly{" "}
                <span className="font-bold text-[#3AAFA9]">
                  $4,400/year in real terms
                </span>{" "}
                on top of her salary.
              </p>
            </div>

            <p className="text-[#6B7280] text-[13px] italic mb-8">
              This is an illustration, not financial advice. Use the calculator
              to run your own numbers.
            </p>

            <Link
              href="/travel-off-ramp#pslf-calculator"
              className="inline-flex items-center gap-2 bg-periwinkle text-white font-bold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Calculate your PSLF savings →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PART 5: RI MARKET CONTEXT ─────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
          <h2
            className="text-[#1E1E2E] text-2xl sm:text-3xl lg:text-4xl mb-12 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Rhode Island nursing market, honestly
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              {
                stat: "~13,300",
                label: "Active RNs in Rhode Island",
                source: "Source: RI Board of Nursing",
              },
              {
                stat: "650–750",
                label: "Open RN positions at any given time",
                source: "Based on job posting analysis",
              },
              {
                stat: "$85K–$100K",
                label: "Annual cost of one unfilled RN position to a facility",
                source: "Industry estimate",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-periwinkle/20 p-8 shadow-sm text-center"
              >
                <div
                  className="text-periwinkle mb-3 leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 700,
                  }}
                >
                  {card.stat}
                </div>
                <div
                  className="text-[#1E1E2E] font-bold mb-2"
                  style={{ fontSize: "15px" }}
                >
                  {card.label}
                </div>
                <div className="text-[#6B7280] text-[12px] italic">
                  {card.source}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[#6B7280] text-[13px] italic text-center">
            Data sourced from RI Board of Nursing, Bureau of Labor Statistics,
            and Flor market research. Updated periodically.
          </p>
        </div>
      </section>

      {/* ── PART 6: RI LICENSE GUIDE ──────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24 border-t border-[#F4F4FB]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-10">
          <h2
            className="text-[#1E1E2E] text-2xl sm:text-3xl lg:text-4xl mb-10 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rhode Island nursing license guide
          </h2>

          <div className="divide-y divide-periwinkle/20">
            {ACCORDION_ITEMS.map((item, index) => {
              const isOpen = openAccordion === index;
              return (
                <div key={item.title}>
                  <button
                    className="w-full flex items-center justify-between text-left py-5 gap-4"
                    onClick={() =>
                      setOpenAccordion(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-[#1E1E2E] text-base">
                      {item.title}
                    </span>
                    <span className="flex-shrink-0">
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-5">
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PART 7: BOTTOM CTA ────────────────────────────────────────── */}
      <section className="bg-periwinkle py-20 text-center">
        <div className="max-w-[720px] mx-auto px-6 sm:px-10">
          <h2
            className="text-white text-3xl sm:text-4xl lg:text-5xl mb-5 leading-[1.15]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            See what verified employers are actually paying
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Browse real listings with pay explained on every single one.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-white text-periwinkle font-bold text-base px-10 py-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-150"
          >
            Browse Jobs →
          </Link>
        </div>
      </section>
    </main>
  );
}
