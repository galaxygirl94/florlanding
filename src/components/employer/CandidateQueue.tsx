"use client";

import { useState, useMemo } from "react";
import type { Application, JobListing, NurseProfile } from "@/data/types";
import { demoNurses } from "@/data/demo-nurses";

/* ── Helpers ──────────────────────────────────────────────────────── */

function nurseById(id?: string): NurseProfile | undefined {
  return demoNurses.find((n) => n.id === id);
}

function fitBadgeColor(score: number): string {
  if (score >= 85) return "bg-[#059669] text-white";
  if (score >= 70) return "bg-[#F4A942] text-white";
  return "bg-[#9CA3AF] text-white";
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-22T12:00:00");
  const then = new Date(dateStr + "T00:00:00");
  const days = Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const AVATAR_COLORS = [
  "#8B8FD4",
  "#E97D6B",
  "#7BA68E",
  "#F4A942",
  "#6C70B8",
  "#C5C7EA",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ── Types ────────────────────────────────────────────────────────── */

type SortOption = "fitScore" | "dateApplied" | "experience";
type ShiftFilter = "All" | "Days" | "Evenings" | "Nights" | "Rotating";

/* ── Component ────────────────────────────────────────────────────── */

export default function CandidateQueue({
  jobs,
  apps,
}: {
  jobs: JobListing[];
  apps: Application[];
}) {
  const facilityJobs = jobs.filter(
    (j) => j.facilityName === "Bayside Medical Center"
  );
  const [selectedJobId, setSelectedJobId] = useState(
    facilityJobs[0]?.id || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>("fitScore");
  const [minFitScore, setMinFitScore] = useState(0);
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [interviewRequested, setInterviewRequested] = useState<Set<string>>(
    new Set()
  );

  const selectedJob = facilityJobs.find((j) => j.id === selectedJobId);

  const candidates = useMemo(() => {
    let filtered = apps
      .filter((a) => a.jobId === selectedJobId)
      .map((a) => {
        const nurse = nurseById(a.nurseId);
        return { ...a, nurse };
      });

    // Filter by fit score
    if (minFitScore > 0) {
      filtered = filtered.filter((c) => (c.fitScore || 0) >= minFitScore);
    }

    // Filter by shift
    if (shiftFilter !== "All") {
      filtered = filtered.filter((c) =>
        c.nurse?.shiftPreferences?.some(
          (s) => s.toLowerCase() === shiftFilter.toLowerCase()
        )
      );
    }

    // Filter verified only
    if (verifiedOnly) {
      filtered = filtered.filter(
        (c) =>
          c.nurse?.licenses?.some(
            (l) => l.verified && l.verificationStatus === "active"
          )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "fitScore") return (b.fitScore || 0) - (a.fitScore || 0);
      if (sortBy === "dateApplied")
        return b.appliedDate.localeCompare(a.appliedDate);
      if (sortBy === "experience")
        return (
          (b.nurse?.yearsOfExperience || 0) -
          (a.nurse?.yearsOfExperience || 0)
        );
      return 0;
    });

    return filtered;
  }, [apps, selectedJobId, sortBy, minFitScore, shiftFilter, verifiedOnly]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-extrabold mb-1"
          style={{ color: "#1E1E2E" }}
        >
          Candidates for{" "}
          <span style={{ color: "#8B8FD4" }}>
            {selectedJob?.title || "Job"}
          </span>
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} in
          queue
        </p>
      </div>

      {/* Job selector */}
      <div className="mb-5">
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none w-full sm:w-auto"
          style={{
            borderColor: "#E4E4EC",
            color: "#1E1E2E",
            background: "white",
            fontFamily: "'Manrope', system-ui, sans-serif",
          }}
        >
          {facilityJobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl border"
        style={{ background: "#FAFAFE", borderColor: "#E4E4EC" }}
      >
        {/* Fit Score filter */}
        <div className="flex items-center gap-2">
          <label
            className="text-xs font-bold"
            style={{ color: "#6B7280", letterSpacing: "0.05em" }}
          >
            MIN FIT
          </label>
          <select
            value={minFitScore}
            onChange={(e) => setMinFitScore(Number(e.target.value))}
            className="rounded-lg border px-3 py-1.5 text-sm outline-none"
            style={{
              borderColor: "#E4E4EC",
              color: "#1E1E2E",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            <option value={0}>Any</option>
            <option value={70}>70+</option>
            <option value={85}>85+</option>
            <option value={90}>90+</option>
          </select>
        </div>

        {/* Shift filter */}
        <div className="flex items-center gap-2">
          <label
            className="text-xs font-bold"
            style={{ color: "#6B7280", letterSpacing: "0.05em" }}
          >
            SHIFT
          </label>
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as ShiftFilter)}
            className="rounded-lg border px-3 py-1.5 text-sm outline-none"
            style={{
              borderColor: "#E4E4EC",
              color: "#1E1E2E",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            <option>All</option>
            <option>Days</option>
            <option>Evenings</option>
            <option>Nights</option>
            <option>Rotating</option>
          </select>
        </div>

        {/* Verified only */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded"
            style={{ accentColor: "#8B8FD4" }}
          />
          <span className="text-xs font-bold" style={{ color: "#6B7280" }}>
            Verified Only
          </span>
        </label>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <label
            className="text-xs font-bold"
            style={{ color: "#6B7280", letterSpacing: "0.05em" }}
          >
            SORT
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border px-3 py-1.5 text-sm outline-none"
            style={{
              borderColor: "#E4E4EC",
              color: "#1E1E2E",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            <option value="fitScore">Fit Score</option>
            <option value="dateApplied">Date Applied</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>

      {/* Candidate cards */}
      <div className="space-y-3">
        {candidates.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ background: "white", borderColor: "#E4E4EC" }}
          >
            <div className="text-3xl mb-3">👥</div>
            <div
              className="text-sm font-semibold"
              style={{ color: "#9CA3AF" }}
            >
              No candidates match your filters.
            </div>
          </div>
        ) : (
          candidates.map((c) => {
            const nurse = c.nurse;
            const initials = c.nurseName
              ? c.nurseName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?";
            const isVerified = nurse?.licenses?.some(
              (l) => l.verified && l.verificationStatus === "active"
            );
            const distance = nurse?.maxCommuteMiles
              ? `${Math.floor(Math.random() * nurse.maxCommuteMiles)}mi`
              : null;

            return (
              <div
                key={c.id}
                className="rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "white", borderColor: "#E4E4EC" }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                    style={{
                      background: avatarColor(c.nurseName || "?"),
                    }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#1E1E2E" }}
                      >
                        {c.nurseName || "Unknown"}
                      </span>
                      {c.fitScore && (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${fitBadgeColor(
                            c.fitScore
                          )}`}
                        >
                          {c.fitScore}% Fit
                        </span>
                      )}
                      {isVerified && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: "#ECFDF5",
                            color: "#059669",
                          }}
                        >
                          Nursys Verified
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "#6B7280" }}>
                      {nurse?.specialties && nurse.specialties.length > 0 && (
                        <span className="font-medium">
                          {nurse.specialties.join(", ")}
                        </span>
                      )}
                      {nurse?.yearsOfExperience !== undefined && (
                        <span>{nurse.yearsOfExperience} yrs exp</span>
                      )}
                      {nurse?.shiftPreferences &&
                        nurse.shiftPreferences.length > 0 && (
                          <span>
                            {nurse.shiftPreferences.join("/")} shifts
                          </span>
                        )}
                      {distance && <span>{distance} away</span>}
                    </div>

                    <div
                      className="text-xs mt-1"
                      style={{ color: "#9CA3AF" }}
                    >
                      Applied {timeAgo(c.appliedDate)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        /* view profile - placeholder */
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-[#FAFAFE]"
                      style={{ borderColor: "#E4E4EC", color: "#1E1E2E" }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        setInterviewRequested((prev) => {
                          const next = new Set(prev);
                          next.add(c.id);
                          return next;
                        })
                      }
                      disabled={
                        interviewRequested.has(c.id) ||
                        c.status === "interview"
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity disabled:opacity-50"
                      style={{
                        background:
                          interviewRequested.has(c.id) ||
                          c.status === "interview"
                            ? "#7BA68E"
                            : "#8B8FD4",
                      }}
                    >
                      {interviewRequested.has(c.id) ||
                      c.status === "interview"
                        ? "Requested"
                        : "Request Interview"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
