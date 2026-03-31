"use client";

import { useState } from "react";
import type { Application, JobListing } from "@/data/types";
import type { Screen } from "./EmployerSidebar";

/* ── Helpers ──────────────────────────────────────────────────────── */

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status: string): { bg: string; color: string; label: string } {
  switch (status) {
    case "active":
      return { bg: "#ECFDF5", color: "#059669", label: "Active" };
    case "paused":
      return { bg: "#FFFBEB", color: "#F4A942", label: "Paused" };
    case "closed":
    case "filled":
      return { bg: "#EEEEF9", color: "#8B8FD4", label: "Filled" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280", label: status || "Draft" };
  }
}

/* ── Component ────────────────────────────────────────────────────── */

export default function ActivePostings({
  jobs,
  apps,
  onNavigate,
}: {
  jobs: JobListing[];
  apps: Application[];
  onNavigate: (s: Screen) => void;
}) {
  const facilityJobs = jobs.filter(
    (j) => j.facilityName === "Bayside Medical Center"
  );

  const [localJobs, setLocalJobs] = useState(facilityJobs);

  const candidateCount = (jobId: string) =>
    apps.filter((a) => a.jobId === jobId).length;

  const togglePause = (jobId: string) => {
    setLocalJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: j.status === "paused" ? "active" : "paused" }
          : j
      )
    );
  };

  const markFilled = (jobId: string) => {
    setLocalJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: "closed" as const } : j
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-1"
            style={{ color: "#1E1E2E" }}
          >
            Active Postings
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Manage your job listings
          </p>
        </div>
        <button
          onClick={() => onNavigate("post-job")}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "#8B8FD4" }}
        >
          + New Posting
        </button>
      </div>

      {/* Table for desktop */}
      <div
        className="rounded-2xl border overflow-hidden hidden sm:block"
        style={{ background: "white", borderColor: "#E4E4EC" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "#FAFAFE" }}>
              {["Position", "Specialty", "Pay Range", "Shift", "Candidates", "Status", "Posted", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-bold"
                    style={{
                      color: "#9CA3AF",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #E4E4EC",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {localJobs.map((job, i) => {
              const badge = statusBadge(job.status || "active");
              return (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-[#FAFAFE]"
                  style={{
                    borderBottom:
                      i < localJobs.length - 1
                        ? "1px solid #F0F0F5"
                        : "none",
                  }}
                >
                  <td className="px-5 py-4">
                    <div
                      className="text-sm font-bold"
                      style={{ color: "#1E1E2E" }}
                    >
                      {job.title}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#EEEEF9", color: "#6C70B8" }}
                    >
                      {job.specialty || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#1E1E2E" }}
                    >
                      ${job.payRange.min}–${job.payRange.max}/hr
                    </span>
                  </td>
                  <td
                    className="px-5 py-4 text-sm"
                    style={{ color: "#6B7280" }}
                  >
                    {job.scheduleType}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#8B8FD4" }}
                    >
                      {candidateCount(job.id)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td
                    className="px-5 py-4 text-sm"
                    style={{ color: "#6B7280" }}
                  >
                    {formatDate(job.postedDate)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate("post-job")}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#FAFAFE]"
                        style={{ borderColor: "#E4E4EC", color: "#6B7280" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => togglePause(job.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#FAFAFE]"
                        style={{
                          borderColor: "#E4E4EC",
                          color:
                            job.status === "paused" ? "#059669" : "#F4A942",
                        }}
                      >
                        {job.status === "paused" ? "Resume" : "Pause"}
                      </button>
                      {job.status !== "closed" && (
                        <button
                          onClick={() => markFilled(job.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            background: "#EEEEF9",
                            color: "#6C70B8",
                          }}
                        >
                          Mark Filled
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {localJobs.map((job) => {
          const badge = statusBadge(job.status || "active");
          return (
            <div
              key={job.id}
              className="rounded-2xl border p-5"
              style={{ background: "white", borderColor: "#E4E4EC" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div
                    className="text-sm font-bold mb-1"
                    style={{ color: "#1E1E2E" }}
                  >
                    {job.title}
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#EEEEF9", color: "#6C70B8" }}
                    >
                      {job.specialty || "—"}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#8B8FD4" }}
                >
                  {candidateCount(job.id)} candidates
                </span>
              </div>
              <div className="flex gap-2 text-xs" style={{ color: "#6B7280" }}>
                <span>${job.payRange.min}–${job.payRange.max}/hr</span>
                <span>·</span>
                <span>{job.scheduleType}</span>
                <span>·</span>
                <span>{formatDate(job.postedDate)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onNavigate("post-job")}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: "#E4E4EC", color: "#6B7280" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => togglePause(job.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border"
                  style={{
                    borderColor: "#E4E4EC",
                    color: job.status === "paused" ? "#059669" : "#F4A942",
                  }}
                >
                  {job.status === "paused" ? "Resume" : "Pause"}
                </button>
                {job.status !== "closed" && (
                  <button
                    onClick={() => markFilled(job.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ background: "#EEEEF9", color: "#6C70B8" }}
                  >
                    Mark Filled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
