"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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

  const activeFilters = [specialty, ehr, schedule, location].filter((f) => f !== "All").length + (unionOnly ? 1 : 0) + (payMin > 0 ? 1 : 0);

  return (
    <div>
      {/* Page Header with photo banner */}
      <div className="relative overflow-hidden h-[200px] sm:h-[280px]">
        <Image
          src="/nurse-tablet.png"
          alt="Nurse browsing jobs on a tablet"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2E]/80 via-[#1E1E2E]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">Find Nursing Jobs</h1>
              <p className="text-white/75 mt-3 text-base sm:text-lg max-w-lg leading-relaxed">
                Every listing shows real pay and honest schedules. No guesswork, no ghost posts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Mobile filter toggle */}
        <button
          className="md:hidden w-full mb-5 bg-white border border-periwinkle-100/60 rounded-xl px-4 py-3.5 text-sm font-bold text-periwinkle flex items-center justify-center gap-2 min-h-[44px]"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? "Hide Filters" : "Filters"}
          {activeFilters > 0 && (
            <span className="bg-periwinkle text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        {/* Mobile specialty pills */}
        <div className="md:hidden overflow-x-auto pb-3 mb-5 -mx-4 px-4">
          <div className="flex gap-2">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  specialty === s
                    ? "bg-periwinkle text-white shadow-sm"
                    : "bg-white text-text-light border border-periwinkle-100/60"
                }`}
              >
                {s === "All" ? "All Specialties" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        <div className={`${showFilters ? "block" : "hidden"} md:block bg-white rounded-2xl border border-periwinkle-100/40 p-5 sm:p-6 mb-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-3.5 py-3 text-sm bg-white min-h-[44px]"
              >
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">EHR System</label>
              <select
                value={ehr}
                onChange={(e) => setEhr(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-3.5 py-3 text-sm bg-white min-h-[44px]"
              >
                {EHR_SYSTEMS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Schedule</label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-3.5 py-3 text-sm bg-white min-h-[44px]"
              >
                {SCHEDULE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-periwinkle-100/60 rounded-xl px-3.5 py-3 text-sm bg-white min-h-[44px]"
              >
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Min Pay ($/hr)</label>
              <input
                type="number"
                value={payMin || ""}
                onChange={(e) => setPayMin(Number(e.target.value))}
                placeholder="No minimum"
                className="w-full border border-periwinkle-100/60 rounded-xl px-3.5 py-3 text-sm min-h-[44px]"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={unionOnly}
                  onChange={(e) => setUnionOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-periwinkle-100 text-periwinkle accent-periwinkle"
                />
                <span className="text-sm font-semibold text-text">Union positions only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm font-semibold text-text">
            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
          </span>
          {activeFilters > 0 && (
            <button
              onClick={() => { setSpecialty("All"); setEhr("All"); setSchedule("All"); setLocation("All"); setUnionOnly(false); setPayMin(0); }}
              className="text-xs text-periwinkle hover:text-periwinkle-dark font-bold transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-periwinkle-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-text">No jobs match your filters</h3>
            <p className="text-text-muted text-sm">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
