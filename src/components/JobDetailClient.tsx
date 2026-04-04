"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JobListing, FacilityProfile } from "@/data/types";
import ScheduleInterviewModal from "@/components/ScheduleInterviewModal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function daysAgo(d: string) {
  const n = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000));
  return n === 0 ? "today" : n === 1 ? "1 day ago" : `${n} days ago`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">{children}</p>;
}

function CheckIcon({ color = "#3AAFA9" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="10" fill={color} fillOpacity="0.15" />
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= Math.round(rating) ? "#F4A942" : "#E4E4EC"}>
          <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4L6 1z"/>
        </svg>
      ))}
    </span>
  );
}


export default function JobDetailClient({ job, facility }: { job: JobListing; facility: FacilityProfile | null }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem("flor_applied_jobs") || "[]");
    if (ids.includes(job.id)) setApplied(true);
  }, [job.id]);

  const fmt = (v: number) => v % 1 === 0 ? String(v) : v.toFixed(2);
  const payText = job.payRange.min === job.payRange.max
    ? `$${fmt(job.payRange.min)}`
    : `$${fmt(job.payRange.min)}–$${fmt(job.payRange.max)}`;

  const fitColor = (job.fitScore ?? 0) >= 90 ? "#3AAFA9" : (job.fitScore ?? 0) >= 80 ? "#8B8FD4" : "#F4A942";

  async function handleApply() {
    setApplyLoading(true);
    setApplyError("");
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/login?redirect=/jobs/${job.id}`); return; }
      const { data: profile } = await supabase.from("nurse_profiles")
        .select("license_verified, specialty, location_zip").eq("id", user.id).single();
      if (!profile?.license_verified) { router.push("/nurse-profile?incomplete=license"); return; }
      if (!profile.specialty || !profile.location_zip) { router.push("/nurse-profile?incomplete=profile"); return; }
    }
    setApplyLoading(false);
    if (job.directScheduling && (job.fitScore ?? 0) >= 85) {
      setShowScheduleModal(true);
    } else {
      setShowApplyConfirm(true);
    }
  }

  async function submitApplication() {
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("applications").upsert(
          { nurse_id: user.id, job_id: job.id, status: "Applied" },
          { onConflict: "nurse_id,job_id" }
        );
      }
    }
    const prev: string[] = JSON.parse(localStorage.getItem("flor_applied_jobs") || "[]");
    if (!prev.includes(job.id)) localStorage.setItem("flor_applied_jobs", JSON.stringify([...prev, job.id]));
    setApplied(true);
    setShowApplyConfirm(false);
    setShowScheduleModal(false);
    setInterviewScheduled(true);
  }

  return (
    <div className="bg-[#F4F4FB] min-h-screen pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-2">
        <div className="text-sm text-text-muted flex items-center gap-2">
          <Link href="/jobs" className="hover:text-periwinkle transition-colors font-medium">Jobs</Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-text font-semibold truncate">{job.title}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-6">
        <div className="lg:flex lg:gap-10 lg:items-start">

          {/* ═══════════ LEFT COLUMN ═══════════ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── SECTION 1: Header ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              {job.specialty && (
                <span className="inline-block bg-periwinkle/10 text-periwinkle text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                  {job.specialty}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] leading-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
                {job.title}
              </h1>
              <Link href={`/facility/${job.facilityId}`} className="inline-flex items-center gap-1.5 text-periwinkle hover:text-periwinkle-dark font-semibold text-base transition-colors mb-3">
                {job.facilityName}
                {!job.isScraped && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.3L10.2 5.5L15 6.3L11.5 9.7L12.4 14.5L8 12.2L3.6 14.5L4.5 9.7L1 6.3L5.8 5.5L8 1.3Z" fill="#3AAFA9"/>
                    <path d="M5.8 8.2L7.2 9.6L10.4 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                  </svg>
                  {job.location.city}, {job.location.state}
                </span>
                <span>·</span>
                <span>{job.type}{job.hoursPerWeek ? ` · ${job.hoursPerWeek} hrs/wk` : ""}</span>
                <span>·</span>
                <span>Posted {daysAgo(job.postedDate)}</span>
              </div>
            </div>

            {/* ── SECTION 2: Pay ── */}
            <div className="bg-[#EBF8F7] rounded-2xl border border-[#3AAFA9]/15 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Pay</SectionLabel>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1E1E2E] mb-2" style={{ letterSpacing: "-0.02em" }}>
                {payText}<span className="text-lg font-semibold text-[#6B7280] ml-1">/{job.payUnit}</span>
              </div>
              {(job.signOnBonus ?? 0) > 0 && (
                <div className="inline-flex items-center gap-2 bg-white text-[#3AAFA9] font-bold text-sm px-4 py-1.5 rounded-full mb-4 border border-[#3AAFA9]/20">
                  💰 ${job.signOnBonus!.toLocaleString()} sign-on bonus
                </div>
              )}
              <div className="bg-white/80 rounded-xl p-5 mt-3">
                <p className="text-xs font-bold text-[#3AAFA9] uppercase tracking-wider mb-2">Pay Explained</p>
                <p className="text-sm text-[#374151] leading-relaxed">{job.payExplained}</p>
              </div>
              {(job.nightDifferential || job.weekendDifferential) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {job.nightDifferential && (
                    <span className="inline-flex items-center gap-1.5 bg-white/80 text-[#3AAFA9] text-sm font-semibold px-3 py-1.5 rounded-full border border-[#3AAFA9]/20">
                      +${job.nightDifferential}/hr nights
                    </span>
                  )}
                  {job.weekendDifferential && (
                    <span className="inline-flex items-center gap-1.5 bg-white/80 text-[#3AAFA9] text-sm font-semibold px-3 py-1.5 rounded-full border border-[#3AAFA9]/20">
                      +${job.weekendDifferential}/hr weekends
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-[#9CA3AF] mt-4 italic">
                Pay is posted directly by the employer and reflects what you&apos;ll actually be offered — not an estimate.
              </p>
            </div>

            {/* ── SECTION 3: Schedule ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Schedule</SectionLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.scheduleBadges.map((b) => (
                  <span key={b} className="bg-periwinkle/10 text-periwinkle text-sm font-semibold px-3.5 py-1.5 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
              <p className="text-sm text-text-light mb-4">{job.schedule}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Weekends", value: job.weekends || "Not specified — ask at interview" },
                  { label: "On-call", value: job.onCall || "Not specified — ask at interview" },
                  { label: "Hours/week", value: job.hoursPerWeek ? `${job.hoursPerWeek} hrs` : "Not specified" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F7F7FF] rounded-xl p-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-semibold text-text">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 4: Patient Ratio ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Patient Ratio</SectionLabel>
              {job.patientRatio ? (
                <div className="flex items-center gap-6">
                  <div className="text-5xl font-extrabold text-[#1E1E2E]" style={{ letterSpacing: "-0.02em" }}>
                    {job.patientRatio}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text mb-1">Patient-to-nurse ratio</p>
                    {job.patientRatioVerified ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#EBF8F7] text-[#3AAFA9] text-xs font-bold px-2.5 py-1 rounded-full border border-[#3AAFA9]/20">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                          </svg>
                          Flor Ethics Pledge Verified
                        </span>
                        <Link href="/ethics" className="text-xs text-periwinkle hover:underline">How this works →</Link>
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted">Self-reported by the employer.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFF8F0] border border-amber/20 rounded-xl p-5">
                  <p className="text-sm font-semibold text-text mb-1">Patient ratio not posted</p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    You have the right to ask before accepting any offer.{" "}
                    <Link href="/interview-intel" className="text-periwinkle hover:underline font-medium">
                      See questions to ask at interview →
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* ── SECTION 5: Requirements ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Requirements</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-[#3AAFA9] uppercase tracking-wider mb-3">Required</p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-sm text-text">
                      <CheckIcon />
                      {job.licenseRequired.state} {job.licenseRequired.type} License
                    </li>
                    {job.certificationsRequired.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-text">
                        <CheckIcon />
                        {c}
                      </li>
                    ))}
                    {job.drivingRequired && (
                      <li className="flex items-start gap-2.5 text-sm text-text">
                        <CheckIcon />
                        Valid driver&apos;s license
                      </li>
                    )}
                  </ul>
                </div>
                {((job.certificationsPreferred?.length ?? 0) > 0 || job.preferredExperience) && (
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Preferred</p>
                    <ul className="space-y-2.5">
                      {job.certificationsPreferred?.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-text-muted">
                          <CheckIcon color="#9CA3AF" />
                          {c}
                        </li>
                      ))}
                      {job.preferredExperience && (
                        <li className="flex items-start gap-2.5 text-sm text-text-muted">
                          <CheckIcon color="#9CA3AF" />
                          {job.preferredExperience}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-xs text-text-muted mt-5 italic">
                Meeting all preferred qualifications is not required to apply. Flor Fit score accounts for where you actually match.
              </p>
            </div>

            {/* ── SECTION 6: Role Details ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Role Details</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.ehrSystem && (
                  <div className="bg-[#F7F7FF] rounded-xl p-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">EHR System</p>
                    <p className="text-sm font-semibold text-text">{job.ehrSystem}</p>
                    <p className="text-xs text-text-muted mt-1">Flor never disqualifies candidates based on EHR experience</p>
                  </div>
                )}
                {job.specialty && (
                  <div className="bg-[#F7F7FF] rounded-xl p-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Specialty</p>
                    <p className="text-sm font-semibold text-text">{job.specialty}</p>
                  </div>
                )}
                {job.facilityType && (
                  <div className="bg-[#F7F7FF] rounded-xl p-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Facility Type</p>
                    <p className="text-sm font-semibold text-text">{job.facilityType}</p>
                  </div>
                )}
                <div className="bg-[#F7F7FF] rounded-xl p-4">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Union</p>
                  <p className="text-sm font-semibold text-text">{job.union ? `Yes — ${job.unionName || "unionized"}` : "Non-union"}</p>
                </div>
                <div className="bg-[#F7F7FF] rounded-xl p-4">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">PSLF Eligible</p>
                  {job.loanForgiveness ? (
                    <div>
                      <p className="text-sm font-semibold text-[#3AAFA9] flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        PSLF Eligible
                      </p>
                      <p className="text-xs text-text-muted mt-1">This employer qualifies for Public Service Loan Forgiveness. Full-time work counts toward your 10-year forgiveness period.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">Check with employer</p>
                  )}
                </div>
                {job.magnetDesignated && (
                  <div className="bg-[#F7F7FF] rounded-xl p-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Magnet Status</p>
                    <p className="text-sm font-semibold text-periwinkle">Magnet Designated</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── SECTION 7: About Employer ── */}
            {facility && (
              <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
                <SectionLabel>About the Employer</SectionLabel>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-text">{facility.name}</h3>
                    <p className="text-sm text-text-muted">{facility.type}</p>
                  </div>
                  {facility.starRating > 0 && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StarRating rating={facility.starRating} />
                      <span className="text-sm font-semibold text-text">{facility.starRating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-text-light leading-relaxed mb-4">{facility.description}</p>
                {facility.culture && (
                  <p className="text-sm text-text-light leading-relaxed mb-4 italic">&ldquo;{facility.culture}&rdquo;</p>
                )}
                <Link href={`/facility/${job.facilityId}`} className="text-sm font-semibold text-periwinkle hover:text-periwinkle-dark transition-colors">
                  View full facility profile →
                </Link>
                {facility.reviews.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Nurse Reviews</p>
                    {facility.reviews.slice(0, 3).map((r) => (
                      <div key={r.id} className="bg-[#F7F7FF] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-periwinkle flex items-center justify-center text-xs font-bold text-white">{r.authorInitials}</div>
                          <span className="text-xs font-semibold text-text">{r.role}</span>
                          <StarRating rating={r.rating} />
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">&ldquo;{r.text.length > 120 ? r.text.slice(0, 120) + "…" : r.text}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SECTION 8: Q&A ── */}
            <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-6 sm:p-8 shadow-sm">
              <SectionLabel>Questions &amp; Answers</SectionLabel>
              <p className="text-sm text-text-muted mb-5 leading-relaxed">
                Questions are posted anonymously. The employer&apos;s answer stays on this listing permanently for all nurses to see.
              </p>
              {job.questions.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {job.questions.map((qa) => (
                    <div key={qa.id} className="border border-periwinkle-100/40 rounded-xl p-4 hover:border-periwinkle/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-periwinkle-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-periwinkle">Q</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text break-words">{qa.question}</p>
                          <p className="text-xs text-text-muted mt-1">Asked {qa.askedDate}</p>
                        </div>
                      </div>
                      {qa.answer && (
                        <div className="flex items-start gap-3 mt-3 ml-0 sm:ml-10">
                          <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-amber-dark">A</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-text break-words leading-relaxed">{qa.answer}</p>
                            <p className="text-xs text-text-muted mt-1">{qa.answeredBy} · {qa.answeredDate}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted text-sm mb-6 bg-periwinkle-50/30 rounded-xl">
                  No questions yet. Be the first to ask.
                </div>
              )}
              {submitted ? (
                <div className="bg-success-light rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-success">Your question has been submitted anonymously.</p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a question about this role (submitted anonymously)..."
                    className="w-full border border-periwinkle-100/60 rounded-xl p-4 text-sm resize-none min-h-[80px] focus:outline-none focus:border-periwinkle"
                    rows={3}
                  />
                  <button
                    onClick={() => { if (newQuestion.trim()) setSubmitted(true); }}
                    disabled={!newQuestion.trim()}
                    className="mt-3 bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 min-h-[44px]"
                  >
                    Submit Question
                  </button>
                </div>
              )}
            </div>

          </div>
          {/* ═══════════ END LEFT COLUMN ═══════════ */}

          {/* ═══════════ RIGHT COLUMN (sticky sidebar) ═══════════ */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-md border border-periwinkle-100/40 p-6 space-y-5">

              {/* Fit Score */}
              {job.fitScore != null && (
                <div className="text-center pb-5 border-b border-periwinkle-100/30">
                  <div className="w-[80px] h-[80px] rounded-full mx-auto flex flex-col items-center justify-center mb-3"
                    style={{ background: fitColor }}>
                    <span className="text-2xl font-extrabold text-white leading-none">{job.fitScore}%</span>
                    <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest mt-0.5">Fit</span>
                  </div>
                  <p className="text-xs font-bold text-text uppercase tracking-wider">Your Flor Fit</p>
                  <p className="text-xs text-text-muted mt-1">Based on your specialty, schedule, and location</p>
                  <Link href="/how-fit-works" className="text-xs text-periwinkle hover:underline mt-1 inline-block">
                    How Fit Score works →
                  </Link>
                </div>
              )}

              {/* Apply button */}
              <div>
                {applied ? (
                  <div className="text-center">
                    <div className="w-full bg-[#EBF8F7] text-[#3AAFA9] font-bold py-3.5 rounded-xl text-base border border-[#3AAFA9]/20 flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      Applied ✓
                    </div>
                    <Link href="/tracker" className="text-sm font-semibold text-periwinkle hover:underline">
                      Track your application →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {applyError && <p className="text-xs text-red-600">{applyError}</p>}
                    <button
                      onClick={handleApply}
                      disabled={applyLoading}
                      className="w-full bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 min-h-[48px]"
                    >
                      {applyLoading ? "Checking…" : "Apply Directly →"}
                    </button>
                    {job.directScheduling && (job.fitScore ?? 0) >= 85 && !interviewScheduled && (
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="w-full border-2 border-periwinkle text-periwinkle font-bold py-3 rounded-xl text-sm hover:bg-periwinkle hover:text-white transition-all duration-150"
                      >
                        📅 Schedule Interview →
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-text-muted mt-2.5 text-center leading-relaxed">
                  Direct application — no recruiter, no middleman. Your information goes only to {job.facilityName}.
                </p>
              </div>

              {/* Quick facts */}
              <div className="border-t border-periwinkle-100/30 pt-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-text-muted font-medium">Pay</span>
                  <span className="text-sm font-bold text-text text-right">{payText}/{job.payUnit}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-text-muted font-medium">Schedule</span>
                  <span className="text-sm font-semibold text-text text-right max-w-[160px]">{job.scheduleType}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-text-muted font-medium">Location</span>
                  <span className="text-sm font-semibold text-text text-right">{job.location.city}, {job.location.state}</span>
                </div>
                {job.loanForgiveness && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-text-muted font-medium">PSLF</span>
                    <span className="text-sm font-bold text-[#3AAFA9] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      Eligible
                    </span>
                  </div>
                )}
                {job.union && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-text-muted font-medium">Union</span>
                    <span className="text-sm font-bold text-[#1E1E2E]">Union ✓</span>
                  </div>
                )}
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E8E9F4] flex items-center px-4 gap-4" style={{ height: 64 }}>
        <div className="flex-1 min-w-0">
          <span className="text-base font-bold text-[#1E1E2E]">{payText}</span>
          <span className="text-sm text-[#6B7280] ml-1">/{job.payUnit}</span>
        </div>
        {applied ? (
          <div className="bg-[#EBF8F7] text-[#3AAFA9] font-bold px-5 py-2.5 rounded-xl text-sm border border-[#3AAFA9]/20 flex-shrink-0">
            Applied ✓
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={applyLoading}
            className="bg-periwinkle hover:bg-periwinkle-dark disabled:opacity-60 text-white font-bold px-5 rounded-xl text-sm transition-all flex-shrink-0"
            style={{ height: 44 }}
          >
            {applyLoading ? "Checking…" : "Apply Directly →"}
          </button>
        )}
      </div>

      {/* ── Apply confirm modal ── */}
      {showApplyConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-extrabold text-text mb-2">Confirm Application</h3>
            <p className="text-sm text-text-light mb-6 leading-relaxed">
              You&apos;re applying to <strong>{job.title}</strong> at <strong>{job.facilityName}</strong>.
              Your profile will be shared directly with the hiring team — no recruiter involved.
            </p>
            <div className="flex gap-3">
              <button onClick={() => submitApplication()} className="flex-1 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-3.5 rounded-full text-base transition-all">
                Submit Application
              </button>
              <button onClick={() => setShowApplyConfirm(false)} className="px-6 py-3.5 rounded-full text-base font-semibold text-text-muted border border-periwinkle-100/60 hover:border-periwinkle/30 transition-colors">
                Cancel
              </button>
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">Direct application — no recruiter middleman</p>
          </div>
        </div>
      )}

      {/* ── Schedule Interview Modal ── */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          job={job}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={async (data) => {
            try {
              const existing = JSON.parse(localStorage.getItem("flor-scheduled-interviews") || "[]");
              existing.push({
                id: `int-nurse-${Date.now()}`,
                jobId: job.id,
                jobTitle: job.title,
                facilityName: job.facilityName,
                date: data.date,
                time: data.time,
                duration: job.interviewDuration ?? 30,
                nurseName: data.name,
                nurseEmail: data.email,
                note: data.note,
                status: "scheduled",
              });
              localStorage.setItem("flor-scheduled-interviews", JSON.stringify(existing));
            } catch { /* ignore */ }
            await submitApplication();
          }}
        />
      )}

    </div>
  );
}
