"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";
import { useAuth } from "@/context/AuthContext";

const SPECIALTIES = [
  "All", "Med Surg", "ICU", "ED", "Peds", "Psych", "Ortho", "Community Health", "Home Health",
  "Rehab", "SNF/LTC", "School Nurse", "Outpatient/Clinic", "L&D", "OR",
  "Aesthetics", "Infusions", "Dialysis/Renal", "Neuro/Stroke", "Chemotherapy",
  "Respiratory", "Mother-Baby", "NICU", "Dementia Care", "PICU", "PACU",
  "Step-Down", "Women's Health", "Occupational Health", "Nurse Administrator",
  "MDS Coordination", "Case Management", "Ambulatory Care", "Outpatient Care",
  "Hospice/Palliative", "School Nursing",
];
const FACILITY_TYPES = ["All", "Acute Care Hospital", "Hospital", "Psychiatric Hospital", "Community Health / Nonprofit", "Outpatient clinic", "SNF/Long-term care", "Rehab", "Home health", "School"];
const SHIFT_TYPES = ["All", "Days", "Nights", "Evenings", "Rotating"];
const WEEKEND_OPTIONS = ["All", "No Weekends", "Optional", "Required"];
const ON_CALL_OPTIONS = ["All", "No", "Optional", "Yes"];
const HOUR_TYPES = ["All", "Full-time", "Part-time", "Per diem"];
const LOCATIONS = ["All", "Providence, RI", "Cranston, RI", "Warwick, RI", "Wakefield, RI", "East Greenwich, RI", "East Providence, RI"];

function ExclusiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-periwinkle bg-periwinkle-50 px-1.5 py-0.5 rounded ml-1.5">
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      Flor Exclusive
    </span>
  );
}

function FilterSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-periwinkle/15 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 text-sm font-bold text-text hover:text-periwinkle transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-periwinkle/30" />
          {title}
        </span>
        <svg className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function JobListingsPage() {
  const { isLoggedIn } = useAuth();

  // Filter state
  const [specialty, setSpecialty] = useState("All");
  const [facilityType, setFacilityType] = useState("All");
  const [shift, setShift] = useState("All");
  const [weekends, setWeekends] = useState("All");
  const [onCall, setOnCall] = useState("All");
  const [hourType, setHourType] = useState("All");
  const [location, setLocation] = useState("All");
  const [payMin, setPayMin] = useState(0);
  const [payMax, setPayMax] = useState(100);
  const [loanForgiveness, setLoanForgiveness] = useState(false);
  const [signOnBonus, setSignOnBonus] = useState(false);
  const [relocation, setRelocation] = useState(false);
  const [tuition, setTuition] = useState(false);
  const [unionOnly, setUnionOnly] = useState(false);
  const [magnetOnly, setMagnetOnly] = useState(false);
  const [minFitScore, setMinFitScore] = useState(0);
  const [verifiedRatioOnly, setVerifiedRatioOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("flor_saved_jobs");
    if (stored) try { setSavedIds(JSON.parse(stored)); } catch { /* ignore */ }
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("flor_saved_jobs", JSON.stringify(next));
      return next;
    });
  };

  // Authenticated nurses never see scraped jobs
  const baseJobs = isLoggedIn ? seedJobs.filter((j) => !j.isScraped) : seedJobs;

  const filteredJobs = useMemo(() => {
    return baseJobs.filter((job) => {
      // Search query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${job.title} ${job.facilityName} ${job.specialty || ""} ${job.location.city}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (specialty !== "All" && job.specialty !== specialty) return false;
      if (facilityType !== "All" && job.facilityType !== facilityType) return false;
      if (shift !== "All" && job.scheduleType !== shift) return false;
      if (weekends !== "All" && job.weekends !== weekends) return false;
      if (onCall !== "All" && job.onCall !== onCall) return false;
      if (hourType !== "All" && job.type !== hourType) return false;
      if (location !== "All") {
        const jobLoc = `${job.location.city}, ${job.location.state}`;
        if (jobLoc !== location) return false;
      }
      if (payMin > 0 && job.payRange.max < payMin) return false;
      if (payMax < 100 && job.payRange.min > payMax) return false;
      if (loanForgiveness && !job.loanForgiveness) return false;
      if (signOnBonus && !(job.signOnBonus && job.signOnBonus > 0)) return false;
      if (relocation && !job.relocationAssistance) return false;
      if (tuition && !job.tuitionReimbursement) return false;
      if (unionOnly && !job.union) return false;
      if (magnetOnly && !job.magnetDesignated) return false;
      if (minFitScore > 0 && (job.fitScore ?? 0) < minFitScore) return false;
      if (verifiedRatioOnly && !job.patientRatioVerified) return false;
      return true;
    });
  }, [baseJobs, specialty, facilityType, shift, weekends, onCall, hourType, location, payMin, payMax, loanForgiveness, signOnBonus, relocation, tuition, unionOnly, magnetOnly, minFitScore, verifiedRatioOnly]);

  // Count how many jobs match a specific filter value
  const countFor = (key: string, value: string | boolean) => {
    return baseJobs.filter((job) => {
      // Apply all current filters except the one being counted
      const base = filteredJobs;
      switch (key) {
        case "specialty": return value === "All" ? true : job.specialty === value;
        case "facilityType": return value === "All" ? true : job.facilityType === value;
        case "shift": return value === "All" ? true : job.scheduleType === value;
        case "weekends": return value === "All" ? true : job.weekends === value;
        case "onCall": return value === "All" ? true : job.onCall === value;
        case "hourType": return value === "All" ? true : job.type === value;
        case "loanForgiveness": return value ? job.loanForgiveness : true;
        case "signOnBonus": return value ? (job.signOnBonus ?? 0) > 0 : true;
        case "verifiedRatio": return value ? job.patientRatioVerified : true;
        default: return true;
      }
    }).length;
  };

  const activeFilters = [specialty, facilityType, shift, weekends, onCall, hourType, location].filter((f) => f !== "All").length
    + (loanForgiveness ? 1 : 0) + (signOnBonus ? 1 : 0) + (relocation ? 1 : 0) + (tuition ? 1 : 0)
    + (unionOnly ? 1 : 0) + (magnetOnly ? 1 : 0) + (minFitScore > 0 ? 1 : 0) + (verifiedRatioOnly ? 1 : 0)
    + (payMin > 0 ? 1 : 0) + (payMax < 100 ? 1 : 0);

  const clearAll = () => {
    setSpecialty("All"); setFacilityType("All"); setShift("All"); setWeekends("All");
    setOnCall("All"); setHourType("All"); setLocation("All"); setPayMin(0); setPayMax(100);
    setLoanForgiveness(false); setSignOnBonus(false); setRelocation(false); setTuition(false);
    setUnionOnly(false); setMagnetOnly(false); setMinFitScore(0); setVerifiedRatioOnly(false);
  };

  const selectClass = "w-full border border-periwinkle-100/60 rounded-xl px-3 py-2.5 text-sm bg-white min-h-[40px]";
  const checkClass = "flex items-center gap-2.5 cursor-pointer min-h-[36px]";

  const filterContent = (
    <>
      <FilterSection title="Specialty & Setting" defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Specialty</label>
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={selectClass}>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s === "All" ? "All Specialties" : s} ({countFor("specialty", s)})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Facility type</label>
            <select value={facilityType} onChange={(e) => setFacilityType(e.target.value)} className={selectClass}>
              {FACILITY_TYPES.map((f) => <option key={f} value={f}>{f === "All" ? "All Facilities" : f} ({countFor("facilityType", f)})</option>)}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Schedule & Flexibility" defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Shift</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)} className={selectClass}>
              {SHIFT_TYPES.map((s) => <option key={s} value={s}>{s === "All" ? "All Shifts" : s} ({countFor("shift", s)})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Weekends</label>
            <select value={weekends} onChange={(e) => setWeekends(e.target.value)} className={selectClass}>
              {WEEKEND_OPTIONS.map((w) => <option key={w} value={w}>{w === "All" ? "Any" : w} ({countFor("weekends", w)})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">On-call</label>
            <select value={onCall} onChange={(e) => setOnCall(e.target.value)} className={selectClass}>
              {ON_CALL_OPTIONS.map((o) => <option key={o} value={o}>{o === "All" ? "Any" : o} ({countFor("onCall", o)})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Hours</label>
            <select value={hourType} onChange={(e) => setHourType(e.target.value)} className={selectClass}>
              {HOUR_TYPES.map((h) => <option key={h} value={h}>{h === "All" ? "All Hours" : h} ({countFor("hourType", h)})</option>)}
            </select>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Compensation & Benefits" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">Min pay ($/hr): {payMin > 0 ? `$${payMin}` : "Any"}</label>
            <input type="range" min={0} max={60} step={5} value={payMin} onChange={(e) => setPayMin(Number(e.target.value))}
              className="w-full accent-periwinkle" />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5"><span>$0</span><span>$60</span></div>
          </div>
          <label className={checkClass}>
            <input type="checkbox" checked={loanForgiveness} onChange={(e) => setLoanForgiveness(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Loan forgiveness eligible</span>
            <ExclusiveBadge />
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={signOnBonus} onChange={(e) => setSignOnBonus(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Sign-on bonus</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={relocation} onChange={(e) => setRelocation(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Relocation assistance</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={tuition} onChange={(e) => setTuition(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Tuition reimbursement</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Workplace Quality" defaultOpen={false}>
        <div className="space-y-3">
          <label className={checkClass}>
            <input type="checkbox" checked={verifiedRatioOnly} onChange={(e) => setVerifiedRatioOnly(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Verified patient-to-nurse ratio</span>
            <ExclusiveBadge />
          </label>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">
              Min Flor Fit Score: {minFitScore > 0 ? `${minFitScore}%` : "Any"}
            </label>
            <input type="range" min={0} max={100} step={5} value={minFitScore} onChange={(e) => setMinFitScore(Number(e.target.value))}
              className="w-full accent-periwinkle" />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5"><span>0%</span><span>100%</span></div>
          </div>
          <label className={checkClass}>
            <input type="checkbox" checked={unionOnly} onChange={(e) => setUnionOnly(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Union facility</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={magnetOnly} onChange={(e) => setMagnetOnly(e.target.checked)}
              className="w-4 h-4 rounded border-periwinkle-100 accent-periwinkle" />
            <span className="text-sm text-text">Magnet designated</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Location" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">City</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l === "All" ? "All Locations" : l}</option>)}
            </select>
          </div>
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="bg-[#F7F7FF]">
      {/* Page Header with photo banner */}
      <div className="relative overflow-hidden h-[220px] sm:h-[300px]">
        <Image
          src="/nurse-tablet.jpg"
          alt="Two nurses looking at a phone together"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/85 via-[#1E1E2E]/55 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif">Find Nursing Jobs</h1>
              <p className="text-white/75 mt-3 text-base sm:text-lg max-w-lg leading-relaxed">
                Every listing shows real pay and honest schedules. No guesswork, no ghost posts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark navy stats/trust band */}
      <div className="bg-[#1E1E2E]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">{filteredJobs.length}</p>
              <p className="text-xs text-white/50 font-medium mt-0.5">Open Positions</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light font-serif">100%</p>
              <p className="text-xs text-white/50 font-medium mt-0.5">Pay Transparent</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-serif">0</p>
              <p className="text-xs text-white/50 font-medium mt-0.5">Recruiter Middlemen</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light font-serif">Direct</p>
              <p className="text-xs text-white/50 font-medium mt-0.5">Apply In-Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* "Why Flor Shows Pay" callout */}
      <div className="bg-[#1E1E2E]">
        <div className="max-w-[700px] mx-auto px-6 sm:px-10 py-16 sm:py-20 text-center">
          <div className="w-[60px] h-[2px] bg-periwinkle mx-auto mb-6" />
          <h2 className="text-3xl sm:text-[40px] font-extrabold text-white italic leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Every job. Every salary. No&nbsp;exceptions.
          </h2>
          <div className="w-[60px] h-[2px] bg-periwinkle mx-auto mt-6 mb-6" />
          <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xl mx-auto">
            Other job boards let employers hide pay. We don&apos;t. Direct hire only — no recruiters, no agencies, no spam. Nurses on Flor apply knowing exactly what they&apos;ll earn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 mt-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light">0</p>
              <p className="text-xs text-white/50 font-medium mt-1">Recruiters</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light">100%</p>
              <p className="text-xs text-white/50 font-medium mt-1">Pay Visible</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light">Direct</p>
              <p className="text-xs text-white/50 font-medium mt-1">Hire Only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        {/* Search bar */}
        <div className="relative mb-6">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#6B7280" strokeWidth="2" strokeLinecap="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search roles, specialties, or facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-periwinkle-100/60 rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-periwinkle transition-colors"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          />
        </div>

        {/* Mobile filter button */}
        <button
          className="lg:hidden w-full mb-5 bg-white border border-periwinkle-100/60 rounded-xl px-4 py-3.5 text-sm font-bold text-periwinkle flex items-center justify-center gap-2 min-h-[44px]"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilters > 0 && (
            <span className="bg-periwinkle text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        {/* Mobile specialty pills */}
        <div className="lg:hidden overflow-x-auto pb-3 mb-5 -mx-4 px-4">
          <div className="flex gap-2">
            {SPECIALTIES.slice(0, 6).map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  specialty === s
                    ? "bg-periwinkle text-white shadow-md shadow-periwinkle/25"
                    : "bg-white text-text-light border border-periwinkle-100/60 hover:border-periwinkle/40"
                }`}
              >
                {s === "All" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: sidebar + content */}
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-periwinkle-100/40 p-6 max-h-[calc(100vh-120px)] overflow-y-auto section-shadow">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text font-serif">Filters</h2>
                {activeFilters > 0 && (
                  <button onClick={clearAll} className="text-xs text-periwinkle hover:text-periwinkle-dark font-bold">
                    Clear all ({activeFilters})
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-8 flex items-center gap-3">
              <span className="text-base font-bold text-text">
                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
              </span>
              <span className="h-px flex-1 bg-periwinkle-100/40" />
              {activeFilters > 0 && (
                <button
                  onClick={clearAll}
                  className="lg:hidden text-xs text-periwinkle hover:text-periwinkle-dark font-bold transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Job cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} isSaved={savedIds.includes(job.id)} onToggleSave={toggleSave} showExampleBadge={!isLoggedIn} />
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-text font-serif">No jobs match your filters</h3>
                <p className="text-text-muted text-sm mb-4">Try adjusting your filters to see more results.</p>
                <button onClick={clearAll} className="text-periwinkle hover:text-periwinkle-dark font-bold text-sm">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== MOBILE FILTER SLIDE-UP ========== */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />

          {/* Panel — slides up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Handle + header */}
            <div className="flex-shrink-0 pt-3 pb-2 px-6 border-b border-periwinkle-100/40">
              <div className="w-10 h-1 bg-periwinkle-100 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-text font-serif">Filters</h2>
                <div className="flex items-center gap-3">
                  {activeFilters > 0 && (
                    <button onClick={clearAll} className="text-xs text-periwinkle font-bold">Clear all</button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 rounded-full bg-periwinkle-50 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable filters */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {filterContent}
            </div>

            {/* Sticky apply button */}
            <div className="flex-shrink-0 p-4 border-t border-periwinkle-100/40 bg-white">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-3.5 rounded-full text-base transition-all duration-200 min-h-[44px]"
              >
                Show {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
