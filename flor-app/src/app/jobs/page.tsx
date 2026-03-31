"use client";

import { useState, useMemo } from "react";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";
import { ShiftType, EmploymentType } from "@/data/types";

const SPECIALTIES = [
  { label: "Med Surg", count: 4 },
  { label: "ICU", count: 3 },
  { label: "ED", count: 2 },
  { label: "Peds", count: 3 },
  { label: "Psych", count: 2 },
  { label: "Home Health", count: 3 },
  { label: "SNF/LTC", count: 3 },
  { label: "Rehab", count: 2 },
  { label: "OR", count: 1 },
  { label: "Ortho", count: 1 },
  { label: "Community Health", count: 1 },
  { label: "Outpatient/Clinic", count: 1 },
  { label: "School Nurse", count: 1 },
];

const FACILITY_TYPES = [
  "Acute Care Hospital",
  "Hospital",
  "Psychiatric Hospital",
  "Community Health/Nonprofit",
  "Outpatient clinic",
  "SNF/Long-term care",
  "Rehab",
  "Home health",
  "School",
];

const SHIFTS: ShiftType[] = ["Days", "Nights", "Evenings", "Rotating"];
const EMP_TYPES: EmploymentType[] = ["Full Time", "Part Time", "Per Diem"];

export default function JobListingsPage() {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>([]);
  const [weekendsOnly, setWeekendsNo] = useState(false);
  const [unionOnly, setUnionOnly] = useState(false);
  const [pslf, setPslf] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasFilters =
    selectedSpecialties.length > 0 ||
    selectedFacilityTypes.length > 0 ||
    selectedShifts.length > 0 ||
    selectedEmpTypes.length > 0 ||
    weekendsOnly ||
    unionOnly ||
    pslf ||
    verifiedOnly;

  const filteredJobs = useMemo(() => {
    return seedJobs.filter((job) => {
      if (selectedSpecialties.length > 0 && !selectedSpecialties.includes(job.specialty)) return false;
      if (selectedFacilityTypes.length > 0 && !selectedFacilityTypes.includes(job.facilityType)) return false;
      if (selectedShifts.length > 0 && !selectedShifts.includes(job.shift)) return false;
      if (selectedEmpTypes.length > 0 && !selectedEmpTypes.includes(job.employmentType)) return false;
      if (weekendsOnly && job.weekends !== "none") return false;
      if (unionOnly && !job.union) return false;
      if (pslf && !job.loanForgivenessEligible) return false;
      if (verifiedOnly && !job.verified) return false;
      return true;
    });
  }, [selectedSpecialties, selectedFacilityTypes, selectedShifts, selectedEmpTypes, weekendsOnly, unionOnly, pslf, verifiedOnly]);

  const toggleItem = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const resetFilters = () => {
    setSelectedSpecialties([]);
    setSelectedFacilityTypes([]);
    setSelectedShifts([]);
    setSelectedEmpTypes([]);
    setWeekendsNo(false);
    setUnionOnly(false);
    setPslf(false);
    setVerifiedOnly(false);
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-text">Filters</h2>
        {hasFilters && (
          <button onClick={resetFilters} className="text-xs text-periwinkle hover:underline">
            Reset all
          </button>
        )}
      </div>

      {/* Specialty */}
      <div>
        <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Specialty</h3>
        <div className="space-y-1">
          {SPECIALTIES.map(({ label, count }) => (
            <label key={label} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(label)}
                  onChange={() => toggleItem(label, selectedSpecialties, setSelectedSpecialties)}
                  className="rounded border-periwinkle-100 text-periwinkle"
                />
                <span className="text-sm text-text group-hover:text-periwinkle transition-colors">{label}</span>
              </div>
              <span className="text-xs text-text-light">{count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Facility Type */}
      <div>
        <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Facility Type</h3>
        <div className="space-y-1">
          {FACILITY_TYPES.map((ft) => (
            <label key={ft} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFacilityTypes.includes(ft)}
                onChange={() => toggleItem(ft, selectedFacilityTypes, setSelectedFacilityTypes)}
                className="rounded border-periwinkle-100 text-periwinkle"
              />
              <span className="text-sm text-text group-hover:text-periwinkle transition-colors">{ft}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Shift */}
      <div>
        <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Shift</h3>
        <div className="flex flex-wrap gap-2">
          {SHIFTS.map((s) => (
            <button
              key={s}
              onClick={() => toggleItem(s, selectedShifts, setSelectedShifts)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedShifts.includes(s)
                  ? "bg-periwinkle text-white border-periwinkle"
                  : "bg-white text-text-light border-periwinkle-100 hover:border-periwinkle"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Employment Type</h3>
        <div className="flex flex-wrap gap-2">
          {EMP_TYPES.map((et) => (
            <button
              key={et}
              onClick={() => toggleItem(et, selectedEmpTypes, setSelectedEmpTypes)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedEmpTypes.includes(et)
                  ? "bg-periwinkle text-white border-periwinkle"
                  : "bg-white text-text-light border-periwinkle-100 hover:border-periwinkle"
              }`}
            >
              {et}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">More Filters</h3>
        <div className="space-y-2">
          {[
            { label: "No weekends required", value: weekendsOnly, setter: setWeekendsNo },
            { label: "Union position", value: unionOnly, setter: setUnionOnly },
            { label: "PSLF eligible", value: pslf, setter: setPslf },
            { label: "Flor Verified only", value: verifiedOnly, setter: setVerifiedOnly },
          ].map(({ label, value, setter }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={value}
                onChange={() => setter(!value)}
                className="rounded border-periwinkle-100 text-periwinkle"
              />
              <span className="text-sm text-text group-hover:text-periwinkle transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header stats bar */}
      <div className="bg-periwinkle rounded-2xl px-5 py-4 mb-6 sm:mb-8 flex flex-wrap gap-4 sm:gap-8 items-center justify-center sm:justify-start">
        {[
          { label: "Open Positions", value: "27" },
          { label: "Pay Transparent", value: "100%" },
          { label: "Recruiter Middlemen", value: "0" },
          { label: "Direct Apply", value: "Always" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center sm:text-left">
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-periwinkle-light">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl card-shadow p-5 sticky top-24">
            <SidebarContent />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button + result count */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Nursing Jobs in Rhode Island</h1>
              <p className="text-sm text-text-light mt-0.5">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""}
                {hasFilters ? " matching filters" : " available"}
              </p>
            </div>
            <button
              className="lg:hidden flex items-center gap-2 bg-white border border-periwinkle-100 rounded-xl px-4 py-2.5 text-sm font-medium text-periwinkle hover:bg-periwinkle-50 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters{hasFilters ? ` (${[selectedSpecialties.length, selectedFacilityTypes.length, selectedShifts.length, selectedEmpTypes.length].reduce((a, b) => a + b, 0) + (weekendsOnly ? 1 : 0) + (unionOnly ? 1 : 0) + (pslf ? 1 : 0) + (verifiedOnly ? 1 : 0)})` : ""}
            </button>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {[...selectedSpecialties, ...selectedFacilityTypes, ...selectedShifts, ...selectedEmpTypes].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 bg-periwinkle-100 text-periwinkle-dark text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {f}
                  <button
                    onClick={() => {
                      if (selectedSpecialties.includes(f)) toggleItem(f, selectedSpecialties, setSelectedSpecialties);
                      else if (selectedFacilityTypes.includes(f)) toggleItem(f, selectedFacilityTypes, setSelectedFacilityTypes);
                      else if (selectedShifts.includes(f)) toggleItem(f, selectedShifts, setSelectedShifts);
                      else if (selectedEmpTypes.includes(f)) toggleItem(f, selectedEmpTypes, setSelectedEmpTypes);
                    }}
                    className="hover:text-periwinkle"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Job cards */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl card-shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold mb-2">No jobs match your filters</h3>
              <p className="text-text-light text-sm mb-6">Try adjusting or removing some filters to see more results.</p>
              <button
                onClick={resetFilters}
                className="bg-periwinkle text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-periwinkle-dark transition-colors"
              >
                Show all jobs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-72 max-w-full bg-white h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-periwinkle-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent />
            <div className="mt-6 pt-4 border-t border-periwinkle-100">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full bg-periwinkle text-white py-3 rounded-full font-semibold hover:bg-periwinkle-dark transition-colors"
              >
                Show {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
