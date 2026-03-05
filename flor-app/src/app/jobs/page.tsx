"use client";

import { useState, useMemo } from "react";
import JobCard from "@/components/JobCard";
import { seedJobs } from "@/data/seed-jobs";

const SPECIALTIES = ["All", "Behavioral Health", "OR/Perioperative", "CNA"];
const EHR_SYSTEMS = ["All", "Epic", "LifeChart", "Not specified"];
const SCHEDULE_TYPES = ["All", "Days", "Evenings", "Nights", "Rotating"];
const LOCATIONS = ["All", "Providence, RI", "Pawtucket, RI", "Newport, RI"];

export default function JobListingsPage() {
  const [specialty, setSpecialty] = useState("All");
  const [ehr, setEhr] = useState("All");
  const [schedule, setSchedule] = useState("All");
  const [location, setLocation] = useState("All");
  const [unionOnly, setUnionOnly] = useState(false);
  const [payMin, setPayMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    return seedJobs.filter((job) => {
      if (specialty !== "All") {
        const jobSpec = job.specialty || (job.licenseRequired.type === "CNA" ? "CNA" : "");
        if (jobSpec.toLowerCase() !== specialty.toLowerCase()) return false;
      }
      if (ehr !== "All") {
        const jobEhr = job.ehrSystem || "Not specified";
        if (jobEhr !== ehr) return false;
      }
      if (schedule !== "All" && job.scheduleType !== schedule) return false;
      if (location !== "All") {
        const jobLoc = `${job.location.city}, ${job.location.state}`;
        if (jobLoc !== location) return false;
      }
      if (unionOnly && !job.union) return false;
      if (payMin > 0 && job.payRange.max < payMin) return false;
      return true;
    });
  }, [specialty, ehr, schedule, location, unionOnly, payMin]);

  const FilterPill = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
        active
          ? "bg-periwinkle text-white"
          : "bg-white text-text-light border border-periwinkle-100 hover:border-periwinkle"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Find Nursing Jobs</h1>
        <p className="text-text-light mt-1 text-sm sm:text-base">
          Every listing shows real pay and real schedules. No guesswork.
        </p>
      </div>

      {/* Mobile: Show Filters button */}
      <button
        className="md:hidden w-full mb-4 bg-white border border-periwinkle-100 rounded-xl px-4 py-3 text-sm font-semibold text-periwinkle flex items-center justify-center gap-2 min-h-[44px]"
        onClick={() => setShowFilters(!showFilters)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Mobile: horizontally scrollable pills (always visible) */}
      <div className="md:hidden overflow-x-auto pb-3 mb-4 -mx-4 px-4">
        <div className="flex gap-2">
          {SPECIALTIES.map((s) => (
            <FilterPill key={s} label={s === "All" ? "All Specialties" : s} active={specialty === s} onClick={() => setSpecialty(s)} />
          ))}
        </div>
      </div>

      {/* Filters panel */}
      <div className={`${showFilters ? "block" : "hidden"} md:block bg-white rounded-2xl card-shadow p-4 sm:p-6 mb-6 sm:mb-8`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-light block mb-1.5">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-light block mb-1.5">EHR System</label>
            <select
              value={ehr}
              onChange={(e) => setEhr(e.target.value)}
              className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]"
            >
              {EHR_SYSTEMS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-light block mb-1.5">Schedule</label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]"
            >
              {SCHEDULE_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-light block mb-1.5">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px]"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-light block mb-1.5">Min Pay ($/hr)</label>
            <input
              type="number"
              value={payMin || ""}
              onChange={(e) => setPayMin(Number(e.target.value))}
              placeholder="No minimum"
              className="w-full border border-periwinkle-100 rounded-xl px-3 py-3 text-sm min-h-[44px]"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={unionOnly}
                onChange={(e) => setUnionOnly(e.target.checked)}
                className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle"
              />
              <span className="text-sm font-medium">Union positions only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-text-light">
        {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {filteredJobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">No jobs match your filters</h3>
          <p className="text-text-light text-sm">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}
