"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { seedJobs } from "@/data/seed-jobs";
import { calculateFitScore, getDistance, FitScoreResult } from "@/lib/fit-score";
import { NurseProfile, JobListing } from "@/data/types";

const SPECIALTIES = [
  "Med Surg", "ICU", "ED", "OR", "L&D", "NICU", "Peds", "Psych",
  "Home Health", "Oncology", "Rehab", "School Nurse", "Telemetry",
  "Cardiac", "Outpatient/Clinic", "SNF/LTC",
];
const SHIFTS = ["Days", "Evenings", "Nights", "Rotating"];
const SCHEDULE_TYPES = ["Full-time", "Part-time", "Per diem"];
const CARE_SETTINGS = [
  "Acute care/Hospital", "SNF/Long-term care", "Outpatient clinic",
  "Home health", "School", "Ambulatory surgery", "Rehab", "Psych facility",
];
const SORT_OPTIONS = [
  { value: "bestMatch", label: "Best Match" },
  { value: "highestPay", label: "Highest Pay" },
  { value: "closest", label: "Closest" },
  { value: "newest", label: "Newest" },
];

interface ScoredJob {
  job: JobListing;
  result: FitScoreResult;
  distance: number | null;
}

function FitScoreCircle({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-success bg-success-light" :
    score >= 60 ? "text-periwinkle bg-periwinkle-50" :
    "text-amber bg-amber/10";
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm ${color}`}>
      {score}
    </div>
  );
}

export default function MatchedJobsPage() {
  const [nurseProfile, setNurseProfile] = useState<NurseProfile | null>(null);
  const [filters, setFilters] = useState({
    specialty: "",
    shift: "",
    scheduleType: "",
    minPay: "",
    maxDistance: "",
    careSetting: "",
  });
  const [sortBy, setSortBy] = useState("bestMatch");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [showApplyConfirm, setShowApplyConfirm] = useState<string | null>(null);
  const [applyNote, setApplyNote] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("flor_nurse_profile");
    if (stored) {
      try { setNurseProfile(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const apps = localStorage.getItem("flor_applied_jobs");
    if (apps) {
      try { setAppliedJobs(new Set(JSON.parse(apps))); } catch { /* ignore */ }
    }
  }, []);

  const activeJobs = seedJobs.filter((j) => !j.status || j.status === "active");

  const scoredJobs: ScoredJob[] = useMemo(() => {
    return activeJobs.map((job) => {
      const result = nurseProfile
        ? calculateFitScore(nurseProfile, job)
        : { score: 0, breakdown: { specialty: 0, certifications: 0, experience: 0, shiftSchedule: 0, careSetting: 0, patientPopulation: 0, ehrSystem: 0 }, flags: { payMismatch: false, commuteExceeded: false }, topMatch: "", topGap: "" };
      const distance = nurseProfile ? getDistance(nurseProfile.zipCode, job.location.zip) : null;
      return { job, result, distance };
    });
  }, [nurseProfile, activeJobs]);

  const filteredJobs = useMemo(() => {
    let jobs = [...scoredJobs];

    if (filters.specialty) jobs = jobs.filter((j) => j.job.specialty === filters.specialty);
    if (filters.shift) jobs = jobs.filter((j) => j.job.scheduleType === filters.shift);
    if (filters.scheduleType) jobs = jobs.filter((j) => j.job.type === filters.scheduleType);
    if (filters.minPay) jobs = jobs.filter((j) => j.job.payRange.max >= Number(filters.minPay));
    if (filters.maxDistance) jobs = jobs.filter((j) => j.distance === null || j.distance <= Number(filters.maxDistance));
    if (filters.careSetting) jobs = jobs.filter((j) => (j.job.careSetting || j.job.facilityType || "").includes(filters.careSetting));

    switch (sortBy) {
      case "highestPay": jobs.sort((a, b) => b.job.payRange.max - a.job.payRange.max); break;
      case "closest": jobs.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999)); break;
      case "newest": jobs.sort((a, b) => new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime()); break;
      default: jobs.sort((a, b) => b.result.score - a.result.score);
    }
    return jobs;
  }, [scoredJobs, filters, sortBy]);

  const selectedJob = selectedJobId ? scoredJobs.find((j) => j.job.id === selectedJobId) : null;

  const handleApply = (jobId: string) => {
    const newApplied = new Set(appliedJobs);
    newApplied.add(jobId);
    setAppliedJobs(newApplied);
    localStorage.setItem("flor_applied_jobs", JSON.stringify([...newApplied]));
    if (applyNote) {
      console.log(`Application note for ${jobId}: ${applyNote}`);
    }
    setShowApplyConfirm(jobId);
    setApplyNote("");
    setTimeout(() => setShowApplyConfirm(null), 3000);
  };

  const clearFilters = () => setFilters({ specialty: "", shift: "", scheduleType: "", minPay: "", maxDistance: "", careSetting: "" });
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-offwhite min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1E2E] to-[#2D2D44] text-white py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight animate-fade-in-up">
            Your Job Matches
          </h1>
          <p className="text-periwinkle-light mt-2 text-lg animate-fade-in-up-delay-1">
            {nurseProfile
              ? `Personalized for ${nurseProfile.firstName} — sorted by Flor Fit Score`
              : "Complete your profile to see personalized Fit Scores"}
          </p>
          {!nurseProfile && (
            <Link href="/onboarding/resume" className="inline-flex items-center gap-2 mt-4 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-6 py-2.5 font-bold text-sm transition-colors">
              Complete Your Profile
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <p className="text-sm text-text-light font-bold">{filteredJobs.length} jobs found</p>
          <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 bg-white border border-periwinkle-100/40 rounded-full px-4 py-2 text-sm font-bold text-text">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
            Filters{hasActiveFilters ? ` (${Object.values(filters).filter(Boolean).length})` : ""}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-periwinkle-100/40 p-6 section-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-text">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs font-bold text-periwinkle hover:text-periwinkle-dark">Clear all</button>
                )}
              </div>
              <FilterControls filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Job Cards */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-text-light font-bold">{filteredJobs.length} jobs found</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Sort by</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-periwinkle-100/40 rounded-xl px-3 py-2 text-sm font-bold text-text">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-periwinkle-100/40 p-12 text-center section-shadow">
                <p className="text-text-muted text-lg mb-4">No jobs match your current filters.</p>
                <button onClick={clearFilters} className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-6 py-2.5 font-bold text-sm transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(({ job, result, distance }) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}>
                    {/* Accent bar */}
                    <div className="h-1 bg-gradient-to-r from-periwinkle via-periwinkle-light to-periwinkle-200 rounded-t-2xl" />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-extrabold text-text truncate">{job.title}</h3>
                            {job.union && (
                              <span className="bg-info/10 text-info text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">Union</span>
                            )}
                          </div>
                          <p className="text-sm text-text-light">{job.facilityName}</p>
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            {job.location.city}, {job.location.state}
                            {distance !== null && <span className="ml-1">· {distance} mi</span>}
                          </div>
                        </div>
                        {nurseProfile && <FitScoreCircle score={result.score} />}
                      </div>

                      {/* Pay */}
                      <div className="mt-4 bg-periwinkle-50 rounded-xl px-4 py-3">
                        <span className="text-xl font-extrabold text-text">${job.payRange.min}–${job.payRange.max}</span>
                        <span className="text-sm text-text-muted ml-1">/{job.payUnit}</span>
                        {job.signOnBonus && (
                          <span className="ml-3 text-xs font-bold text-success bg-success-light px-2 py-0.5 rounded-full">
                            +${(job.signOnBonus / 1000).toFixed(0)}K sign-on
                          </span>
                        )}
                      </div>

                      {/* Schedule badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.scheduleBadges.slice(0, 4).map((b) => (
                          <span key={b} className="bg-offwhite text-text-light text-xs font-bold px-2.5 py-1 rounded-full">{b}</span>
                        ))}
                        {job.patientRatio && (
                          <span className="bg-offwhite text-text-light text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            {job.patientRatio}
                            {job.patientRatioVerified && <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>}
                          </span>
                        )}
                      </div>

                      {/* Flags */}
                      {nurseProfile && (result.flags.payMismatch || result.flags.commuteExceeded) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {result.flags.payMismatch && (
                            <span className="text-xs text-amber font-bold flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                              Below your pay preference
                            </span>
                          )}
                          {result.flags.commuteExceeded && (
                            <span className="text-xs text-amber font-bold flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                              Beyond your commute preference
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                        <span>{job.type}</span>
                        {job.ehrSystem && <><span>·</span><span>{job.ehrSystem}</span></>}
                        {job.magnetDesignated && <><span>·</span><span className="text-periwinkle font-bold">Magnet</span></>}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {selectedJobId === job.id && (
                      <div className="border-t border-periwinkle-100/40 p-5 sm:p-6 animate-fade-in bg-offwhite/50 rounded-b-2xl">
                        {/* Fit Score breakdown */}
                        {nurseProfile && (
                          <div className="mb-6">
                            <h4 className="text-sm font-extrabold text-text mb-3">Fit Score Breakdown</h4>
                            <div className="space-y-2">
                              {([
                                { label: "Specialty", value: result.breakdown.specialty, max: 35 },
                                { label: "Certifications", value: result.breakdown.certifications, max: 20 },
                                { label: "Experience", value: result.breakdown.experience, max: 15 },
                                { label: "Shift & Schedule", value: result.breakdown.shiftSchedule, max: 15 },
                                { label: "Care Setting", value: result.breakdown.careSetting, max: 10 },
                                { label: "Patient Population", value: result.breakdown.patientPopulation, max: 4 },
                                { label: "EHR System", value: result.breakdown.ehrSystem, max: 1 },
                              ] as const).map((cat) => (
                                <div key={cat.label} className="flex items-center gap-3">
                                  <span className="text-xs text-text-light w-32 flex-shrink-0">{cat.label}</span>
                                  <div className="flex-1 bg-periwinkle-100/30 rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${cat.value === cat.max ? "bg-success" : cat.value >= cat.max * 0.6 ? "bg-periwinkle" : "bg-amber"}`}
                                      style={{ width: `${(cat.value / cat.max) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-text-muted w-10 text-right">{cat.value}/{cat.max}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {job.description && (
                          <div className="mb-6">
                            <h4 className="text-sm font-extrabold text-text mb-2">About This Role</h4>
                            <p className="text-sm text-text-light leading-relaxed">{job.description}</p>
                          </div>
                        )}

                        {/* Pay explanation */}
                        <div className="mb-6">
                          <h4 className="text-sm font-extrabold text-text mb-2">Pay Details</h4>
                          <p className="text-sm text-text-light leading-relaxed">{job.payExplained}</p>
                        </div>

                        {/* Special badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {job.loanForgiveness && <span className="bg-success-light text-success text-xs font-bold px-3 py-1.5 rounded-full">Loan Forgiveness</span>}
                          {job.tuitionReimbursement && <span className="bg-success-light text-success text-xs font-bold px-3 py-1.5 rounded-full">Tuition Reimbursement</span>}
                          {job.relocationAssistance && <span className="bg-success-light text-success text-xs font-bold px-3 py-1.5 rounded-full">Relocation Assistance</span>}
                          {job.magnetDesignated && <span className="bg-periwinkle-50 text-periwinkle text-xs font-bold px-3 py-1.5 rounded-full">Magnet Designated</span>}
                        </div>

                        {/* Facility info */}
                        <div className="mb-6">
                          <h4 className="text-sm font-extrabold text-text mb-2">Facility</h4>
                          <p className="text-sm text-text-light">{job.facilityName} · {job.location.city}, {job.location.state}</p>
                          <Link href={`/facility/${job.facilityId}`} className="text-xs text-periwinkle font-bold hover:text-periwinkle-dark mt-1 inline-block">View Facility Profile →</Link>
                        </div>

                        {/* Apply */}
                        {appliedJobs.has(job.id) ? (
                          <div className="bg-success-light rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-bold text-success">Applied! You&apos;ll hear back soon.</span>
                          </div>
                        ) : showApplyConfirm === job.id ? (
                          <div className="bg-success-light rounded-xl p-4 flex items-center gap-3 animate-scale-in">
                            <svg className="w-6 h-6 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                              <p className="text-sm font-extrabold text-success">Application sent!</p>
                              <p className="text-xs text-success/80">Your Flor profile is your application. No extra uploads needed.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <textarea
                              value={applyNote}
                              onChange={(e) => setApplyNote(e.target.value)}
                              placeholder="Add a note to your application (optional)"
                              className="w-full bg-white border border-periwinkle-100/40 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-muted resize-none h-20"
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                              className="bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3 font-bold text-sm transition-colors shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30"
                            >
                              Apply Now
                            </button>
                            <p className="text-xs text-text-muted">Your Flor profile is your application — no separate resume needed.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-text">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-offwhite text-text-muted">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <FilterControls filters={filters} setFilters={setFilters} />
              <div className="flex gap-3 mt-6">
                <button onClick={clearFilters} className="flex-1 border border-periwinkle-100/40 text-text rounded-full py-3 font-bold text-sm">Clear</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 bg-periwinkle text-white rounded-full py-3 font-bold text-sm">Show Results</button>
              </div>

              {/* Sort on mobile */}
              <div className="mt-6 pt-6 border-t border-periwinkle-100/40">
                <h4 className="text-sm font-extrabold text-text mb-3">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => setSortBy(o.value)} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${sortBy === o.value ? "bg-periwinkle text-white" : "bg-offwhite text-text-light hover:bg-periwinkle-50"}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Filters {
  specialty: string;
  shift: string;
  scheduleType: string;
  minPay: string;
  maxDistance: string;
  careSetting: string;
}

function FilterControls({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const update = (key: keyof Filters, value: string) => setFilters({ ...filters, [key]: value });

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Specialty</label>
        <select value={filters.specialty} onChange={(e) => update("specialty", e.target.value)} className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl px-3 py-2.5 text-sm text-text">
          <option value="">All Specialties</option>
          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Shift</label>
        <select value={filters.shift} onChange={(e) => update("shift", e.target.value)} className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl px-3 py-2.5 text-sm text-text">
          <option value="">All Shifts</option>
          {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Schedule Type</label>
        <select value={filters.scheduleType} onChange={(e) => update("scheduleType", e.target.value)} className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl px-3 py-2.5 text-sm text-text">
          <option value="">All Types</option>
          {SCHEDULE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Minimum Pay</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">$</span>
          <input type="number" value={filters.minPay} onChange={(e) => update("minPay", e.target.value)} placeholder="0" className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl pl-7 pr-12 py-2.5 text-sm text-text" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">/hr</span>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Max Distance</label>
        <select value={filters.maxDistance} onChange={(e) => update("maxDistance", e.target.value)} className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl px-3 py-2.5 text-sm text-text">
          <option value="">Any Distance</option>
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="15">15 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Care Setting</label>
        <select value={filters.careSetting} onChange={(e) => update("careSetting", e.target.value)} className="w-full bg-offwhite border border-periwinkle-100/40 rounded-xl px-3 py-2.5 text-sm text-text">
          <option value="">All Settings</option>
          {CARE_SETTINGS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
