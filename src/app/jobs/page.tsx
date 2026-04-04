"use client";

import { useState, useMemo, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";
import { useAuth } from "@/context/AuthContext";

/* ── filter options ──────────────────────────────────── */
const SPECIALTIES = [
  "All", "Med Surg", "ICU", "ED", "Peds", "Psych", "Ortho", "Community Health", "Home Health",
  "Rehab", "SNF/LTC", "School Nurse", "Outpatient/Clinic", "L&D", "OR",
  "Aesthetics", "Infusions", "Dialysis/Renal", "Neuro/Stroke", "Chemotherapy",
  "Respiratory", "Mother-Baby", "NICU", "Dementia Care", "PICU", "PACU",
  "Step-Down", "Women's Health", "Occupational Health", "Nurse Administrator",
  "MDS Coordination", "Case Management", "Ambulatory Care", "Outpatient Care",
  "Hospice/Palliative", "School Nursing", "Behavioral Health",
];
const FACILITY_TYPES = ["All", "Acute Care Hospital", "Hospital", "Psychiatric Hospital", "Community Health / Nonprofit", "Outpatient clinic", "SNF/Long-term care", "Rehab", "Home health", "School"];
const SHIFT_TYPES = ["All", "Days", "Nights", "Evenings", "Rotating"];
const WEEKEND_OPTIONS = ["All", "No Weekends", "Optional", "Required"];
const ON_CALL_OPTIONS = ["All", "No", "Optional", "Yes"];
const HOUR_TYPES = ["All", "Full-time", "Part-time", "Per diem"];
const LOCATIONS = ["All", "Providence, RI", "Cranston, RI", "Warwick, RI", "Wakefield, RI", "East Greenwich, RI", "East Providence, RI"];
type SortBy = "newest" | "match" | "pay_high" | "pay_low";

/* ── sub-components ──────────────────────────────────── */
function FilterSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-periwinkle-100/50 last:border-b-0 py-1">
      <button
        className="w-full flex items-center justify-between py-4 text-sm font-bold text-text hover:text-periwinkle transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-periwinkle/40" />
          {title}
        </span>
        <svg className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="pb-5 space-y-1">{children}</div>}
    </div>
  );
}

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

function EmailCaptureModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {done ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-text mb-2">You&apos;re on the list</h3>
            <p className="text-sm text-text-muted mb-6">We&apos;ll notify you when new verified positions are posted in Rhode Island.</p>
            <button onClick={onClose} className="bg-periwinkle text-white font-bold px-8 py-3 rounded-full text-sm">Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-extrabold text-text mb-2">Get notified of new jobs</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              We&apos;ll email you when new verified employer positions are posted — no spam, no recruiter follow-up.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-periwinkle-100/60 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-periwinkle"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { if (email.includes("@")) setDone(true); }}
                className="flex-1 bg-periwinkle hover:bg-periwinkle-dark text-white font-bold py-3 rounded-full text-sm transition-all"
              >
                Notify me →
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-full text-sm font-semibold text-text-muted border border-periwinkle-100/60 hover:border-periwinkle/30 transition-colors">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────── */
export default function JobListingsPage() {
  const { isLoggedIn } = useAuth();

  /* filter state */
  const [specialty, setSpecialty] = useState("All");
  const [facilityType, setFacilityType] = useState("All");
  const [shift, setShift] = useState("All");
  const [weekends, setWeekends] = useState("All");
  const [onCall, setOnCall] = useState("All");
  const [hourType, setHourType] = useState("All");
  const [location, setLocation] = useState("All");
  const [payMin, setPayMin] = useState(0);
  const [loanForgiveness, setLoanForgiveness] = useState(false);
  const [signOnBonus, setSignOnBonus] = useState(false);
  const [relocation, setRelocation] = useState(false);
  const [tuition, setTuition] = useState(false);
  const [unionOnly, setUnionOnly] = useState(false);
  const [magnetOnly, setMagnetOnly] = useState(false);
  const [minFitScore, setMinFitScore] = useState(0);
  const [verifiedRatioOnly, setVerifiedRatioOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  useEffect(() => {
    const applied = localStorage.getItem("flor_applied_jobs");
    if (applied) try { setAppliedIds(JSON.parse(applied)); } catch { /* ignore */ }
  }, []);

  const baseJobs = isLoggedIn ? seedJobs.filter((j) => !j.isScraped) : seedJobs;

  const filteredJobs = useMemo(() => {
    return baseJobs.filter((job) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!`${job.title} ${job.facilityName} ${job.specialty ?? ""} ${job.location.city}`.toLowerCase().includes(q)) return false;
      }
      if (specialty !== "All" && job.specialty !== specialty) return false;
      if (facilityType !== "All" && job.facilityType !== facilityType) return false;
      if (shift !== "All" && job.scheduleType !== shift) return false;
      if (weekends !== "All" && job.weekends !== weekends) return false;
      if (onCall !== "All" && job.onCall !== onCall) return false;
      if (hourType !== "All" && job.type !== hourType) return false;
      if (location !== "All") {
        if (`${job.location.city}, ${job.location.state}` !== location) return false;
      }
      if (payMin > 0 && job.payRange.max < payMin) return false;
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
  }, [baseJobs, specialty, facilityType, shift, weekends, onCall, hourType, location, payMin, loanForgiveness, signOnBonus, relocation, tuition, unionOnly, magnetOnly, minFitScore, verifiedRatioOnly, searchQuery]);

  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    switch (sortBy) {
      case "match": return arr.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
      case "newest": return arr.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      case "pay_high": return arr.sort((a, b) => b.payRange.max - a.payRange.max);
      case "pay_low": return arr.sort((a, b) => a.payRange.min - b.payRange.min);
      default: return arr;
    }
  }, [filteredJobs, sortBy]);

  const clearAll = () => {
    setSpecialty("All"); setFacilityType("All"); setShift("All"); setWeekends("All");
    setOnCall("All"); setHourType("All"); setLocation("All"); setPayMin(0);
    setLoanForgiveness(false); setSignOnBonus(false); setRelocation(false); setTuition(false);
    setUnionOnly(false); setMagnetOnly(false); setMinFitScore(0); setVerifiedRatioOnly(false);
    setSearchQuery("");
  };

  /* active filter chips */
  const chips: Array<{ label: string; clear: () => void }> = [
    ...(specialty !== "All" ? [{ label: specialty, clear: () => setSpecialty("All") }] : []),
    ...(facilityType !== "All" ? [{ label: facilityType, clear: () => setFacilityType("All") }] : []),
    ...(shift !== "All" ? [{ label: `${shift} shift`, clear: () => setShift("All") }] : []),
    ...(weekends !== "All" ? [{ label: weekends, clear: () => setWeekends("All") }] : []),
    ...(hourType !== "All" ? [{ label: hourType, clear: () => setHourType("All") }] : []),
    ...(location !== "All" ? [{ label: location, clear: () => setLocation("All") }] : []),
    ...(loanForgiveness ? [{ label: "PSLF Eligible", clear: () => setLoanForgiveness(false) }] : []),
    ...(unionOnly ? [{ label: "Union only", clear: () => setUnionOnly(false) }] : []),
    ...(signOnBonus ? [{ label: "Sign-on bonus", clear: () => setSignOnBonus(false) }] : []),
    ...(verifiedRatioOnly ? [{ label: "Verified ratio", clear: () => setVerifiedRatioOnly(false) }] : []),
    ...(payMin > 0 ? [{ label: `$${payMin}+/hr min`, clear: () => setPayMin(0) }] : []),
    ...(magnetOnly ? [{ label: "Magnet only", clear: () => setMagnetOnly(false) }] : []),
  ];

  const countFor = (key: string, value: string | boolean) =>
    baseJobs.filter((job) => {
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
            <label className="text-xs text-text-muted font-medium block mb-1.5">
              Min pay: {payMin > 0 ? `$${payMin}/hr` : "Any"}
            </label>
            <input type="range" min={0} max={60} step={5} value={payMin}
              onChange={(e) => setPayMin(Number(e.target.value))} className="w-full accent-periwinkle" />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5"><span>$0</span><span>$60</span></div>
          </div>
          <label className={checkClass}>
            <input type="checkbox" checked={loanForgiveness} onChange={(e) => setLoanForgiveness(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">PSLF Eligible</span>
            <ExclusiveBadge />
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={signOnBonus} onChange={(e) => setSignOnBonus(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Sign-on bonus</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={relocation} onChange={(e) => setRelocation(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Relocation assistance</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={tuition} onChange={(e) => setTuition(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Tuition reimbursement</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Workplace Quality" defaultOpen={false}>
        <div className="space-y-3">
          <label className={checkClass}>
            <input type="checkbox" checked={verifiedRatioOnly} onChange={(e) => setVerifiedRatioOnly(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Verified patient ratio</span>
            <ExclusiveBadge />
          </label>
          <div>
            <label className="text-xs text-text-muted font-medium block mb-1.5">
              Min Flor Fit: {minFitScore > 0 ? `${minFitScore}%` : "Any"}
            </label>
            <input type="range" min={0} max={100} step={5} value={minFitScore}
              onChange={(e) => setMinFitScore(Number(e.target.value))} className="w-full accent-periwinkle" />
          </div>
          <label className={checkClass}>
            <input type="checkbox" checked={unionOnly} onChange={(e) => setUnionOnly(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Union facility</span>
          </label>
          <label className={checkClass}>
            <input type="checkbox" checked={magnetOnly} onChange={(e) => setMagnetOnly(e.target.checked)} className="w-4 h-4 accent-periwinkle" />
            <span className="text-sm text-text">Magnet designated</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Location" defaultOpen={false}>
        <div>
          <label className="text-xs text-text-muted font-medium block mb-1.5">City</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l === "All" ? "All Locations" : l}</option>)}
          </select>
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="bg-[#F7F7FF]">

      {/* ── Page header ── */}
      <section className="bg-[#1E1E2E] py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-periwinkle/8 rounded-full blur-[120px]" />
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-6">
              <span className="w-8 h-px bg-periwinkle" />
              Rhode Island · Verified Employers Only
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.06] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Real jobs.<br />Real pay.<br />No surprises.
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
              Every listing is posted directly by a verified employer — no scraped posts, no dead links.
            </p>
          </div>

          {/* inline trust stats */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-10">
            {[
              { val: String(baseJobs.filter(j => !j.isScraped).length), label: "Live positions" },
              { val: "100%", label: "Pay transparent" },
              { val: "0", label: "Recruiter middlemen" },
              { val: "Direct", label: "Hire only" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-periwinkle-light" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
                <p className="text-xs text-white/50 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">

        {/* Search bar */}
        <div className="relative mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search roles, specialties, or facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-periwinkle-100/60 rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-periwinkle transition-colors"
          />
        </div>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map(({ label, clear }) => (
              <button
                key={label}
                onClick={clear}
                className="inline-flex items-center gap-1.5 bg-periwinkle/10 text-periwinkle border border-periwinkle/20 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-periwinkle/15 transition-colors"
              >
                {label}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
            <button onClick={clearAll} className="text-sm font-bold text-periwinkle hover:text-periwinkle-dark transition-colors px-1">
              Clear all
            </button>
          </div>
        )}

        {/* Mobile filter button */}
        <button
          className="lg:hidden w-full mb-5 bg-white border border-periwinkle-100/60 rounded-xl px-4 py-3.5 text-sm font-bold text-periwinkle flex items-center justify-center gap-2 min-h-[44px]"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {chips.length > 0 && (
            <span className="bg-periwinkle text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {chips.length}
            </span>
          )}
        </button>

        {/* Mobile quick specialty pills */}
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

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-periwinkle-100/40 p-6 max-h-[calc(100vh-120px)] overflow-y-auto shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text">Filters</h2>
                {chips.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-periwinkle hover:text-periwinkle-dark font-bold">
                    Clear all ({chips.length})
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Results header + sort */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-periwinkle text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm shadow-periwinkle/20">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"} from verified RI employers
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-sm font-semibold text-text bg-white border border-periwinkle-100/60 rounded-xl px-3 py-2 focus:outline-none focus:border-periwinkle cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="match">Best match</option>
                <option value="pay_high">Pay: high to low</option>
                <option value="pay_low">Pay: low to high</option>
              </select>
            </div>

            {/* Job cards grid */}
            {sortedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {sortedJobs.map((job, i) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={i}
                    isApplied={appliedIds.includes(job.id)}
                  />
                ))}
              </div>
            ) : (
              /* ── Zero results state ── */
              <div className="text-center py-20 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-text mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Nothing matching that filter yet
                </h3>
                <p className="text-text-muted text-base max-w-sm mx-auto mb-8 leading-relaxed">
                  We only show real jobs from verified employers — which means fewer listings but every one is real. More employers are joining soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowEmailCapture(true)}
                    className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Get notified when new jobs are posted →
                  </button>
                  <button
                    onClick={clearAll}
                    className="border border-periwinkle text-periwinkle font-bold px-8 py-3.5 rounded-full text-sm hover:bg-periwinkle hover:text-white transition-all duration-200"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}

            {/* ── Coming Soon section ── */}
            {sortedJobs.length > 0 && (
              <div className="mt-16 bg-periwinkle-50/60 rounded-2xl border border-periwinkle-100/40 p-8 sm:p-10 text-center">
                <span className="inline-flex items-center gap-2 text-periwinkle text-xs font-bold uppercase tracking-wider mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming soon
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  More employers joining soon
                </h3>
                <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                  We&apos;re onboarding verified community health employers across Rhode Island. Want to be first to know when new positions go live?
                </p>
                <button
                  onClick={() => setShowEmailCapture(true)}
                  className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Notify me
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter slide-up ── */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex-shrink-0 pt-3 pb-2 px-6 border-b border-periwinkle-100/40">
              <div className="w-10 h-1 bg-periwinkle-100 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-text">Filters</h2>
                <div className="flex items-center gap-3">
                  {chips.length > 0 && <button onClick={clearAll} className="text-xs text-periwinkle font-bold">Clear all</button>}
                  <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full bg-periwinkle-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">{filterContent}</div>
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

      {/* Email capture modal */}
      {showEmailCapture && <EmailCaptureModal onClose={() => setShowEmailCapture(false)} />}
    </div>
  );
}
